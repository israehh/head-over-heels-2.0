import {
  CrateEntity,
  Direction,
  DoorEntity,
  EnemyProjectile,
  ExitPortal,
  ItemCollectible,
  LaserBarrier,
  MovingElevator,
  Particle,
  PatrolDrone,
  PlayerState,
  RoomDefinition,
  SwitchEntity,
  TeleporterPad,
} from '../types/game';
import { TILE_HEIGHT, TILE_WIDTH, TILE_Z_HEIGHT, worldToScreen } from './isometric';

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  cameraX: number;
  cameraY: number;
  zoom: number;
  time: number;
  room: RoomDefinition;
  player: PlayerState;
  particles: Particle[];
  projectiles?: EnemyProjectile[];
  showGrid?: boolean;
}

export class IsometricRenderer {
  // Offscreen lightmap canvas for volumetric lighting & 60 FPS performance on integrated GPUs
  private lightCanvas: HTMLCanvasElement | null = null;
  private lightCtx: CanvasRenderingContext2D | null = null;

  constructor() {}

  // Ensure lightweight half-resolution lighting buffer for soft volumetric diffusion & ultra-high performance
  private getLightBuffer(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const targetW = Math.max(1, Math.floor(width / 2));
    const targetH = Math.max(1, Math.floor(height / 2));

    if (!this.lightCanvas) {
      this.lightCanvas = document.createElement('canvas');
      this.lightCanvas.width = targetW;
      this.lightCanvas.height = targetH;
      this.lightCtx = this.lightCanvas.getContext('2d', { alpha: true });
    } else if (this.lightCanvas.width !== targetW || this.lightCanvas.height !== targetH) {
      this.lightCanvas.width = targetW;
      this.lightCanvas.height = targetH;
      this.lightCtx = this.lightCanvas.getContext('2d', { alpha: true });
    }

    return { canvas: this.lightCanvas, ctx: this.lightCtx! };
  }

  public render(params: RenderContext) {
    const { ctx, canvasWidth, canvasHeight, cameraX, cameraY, zoom, time, room, player, particles, projectiles } = params;

    // ----------------------------------------------------
    // 1. DEEP SCI-FI SPACE VOID & NEBULA BACKDROP
    // ----------------------------------------------------
    this.drawCinematicBackdrop(ctx, canvasWidth, canvasHeight, cameraX, cameraY, room, time);

    // Save state and apply isometric camera transformation
    ctx.save();
    ctx.translate(canvasWidth / 2 - cameraX * zoom, canvasHeight / 2 - cameraY * zoom);
    ctx.scale(zoom, zoom);

    // Expose context for closures
    (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx = ctx;

    // Gather all drawable elements with depth values for Painter's sorting algorithm
    const renderQueue: { depth: number; draw: () => void }[] = [];

    // 2. Queue map floor tiles & static walls with contact AO and metallic materials
    this.queueMapTiles(room, renderQueue, time);

    // 3. Queue teleporters & switches
    this.queueFloorObjects(room, renderQueue, time);

    // 4. Queue moving elevators
    if (room.movingElevators && room.movingElevators.length > 0) {
      this.queueMovingElevators(room.movingElevators, renderQueue, time);
    }

    // 5. Queue crates with tactical military sci-fi shaders
    this.queueCrates(room.crates, room, renderQueue, time);

    // 6. Queue doors & lasers with energetic bloom
    this.queueDoorsAndLasers(room, renderQueue, time);

    // 7. Queue items & quantum fragments
    this.queueItems(room.items, renderQueue, time);

    // 8. Queue Enemy Vision Cones (holographic ground projection)
    this.queueVisionCones(room.drones, renderQueue, time);

    // 9. Queue patrol drones & advanced turrets
    this.queueDrones(room.drones, renderQueue, time);

    // 10. Queue Enemy Projectiles
    if (projectiles && projectiles.length > 0) {
      this.queueProjectiles(projectiles, renderQueue, time);
    }

    // 11. Queue exit portal
    if (room.exitPortal) {
      this.queueExitPortal(room.exitPortal, renderQueue, time, player.energyCells);
    }

    // 12. Queue Player (with rim lighting, thrusters, and dynamic contact shadows)
    this.queuePlayer(player, room, renderQueue, time);

    // Sort queue by depth: ascending order
    renderQueue.sort((a, b) => a.depth - b.depth);

    // Execute draw operations
    for (let i = 0; i < renderQueue.length; i++) {
      renderQueue[i].draw();
    }

    // Draw active dynamic particles
    this.drawParticles(ctx, particles);

    ctx.restore();

    // ----------------------------------------------------
    // 13. DYNAMIC VOLUMETRIC LIGHTING PASS (DEFERRED COMPOSITE)
    // ----------------------------------------------------
    this.renderVolumetricLightingPass(ctx, canvasWidth, canvasHeight, cameraX, cameraY, zoom, room, player, time);

    // ----------------------------------------------------
    // 14. CINEMATIC POST-PROCESSING & LENS VIGNETTE
    // ----------------------------------------------------
    this.drawCinematicVignette(ctx, canvasWidth, canvasHeight, room, time);
  }

  // ----------------------------------------------------
  // BACKDROP (DEEP SPACE, STARFIELD & NEBULA)
  // ----------------------------------------------------
  private drawCinematicBackdrop(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    camY: number,
    room: RoomDefinition,
    time: number
  ) {
    // Deep dark void base
    ctx.fillStyle = '#020408';
    ctx.fillRect(0, 0, w, h);

    // Ambient sector color gradient
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.max(w, h) * 0.9;
    const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, maxR);

    // Sector mood tinting
    let ambientHex = room.ambientColor || '#0a1020';
    if (room.quadrant?.includes('Alpha')) ambientHex = '#061325';
    else if (room.quadrant?.includes('Beta')) ambientHex = '#1c1007';
    else if (room.quadrant?.includes('Gamma')) ambientHex = '#061a12';
    else if (room.quadrant?.includes('Delta')) ambientHex = '#1f060b';
    else if (room.quadrant?.includes('Omega')) ambientHex = '#150624';

    grad.addColorStop(0, ambientHex);
    grad.addColorStop(0.5, '#040711');
    grad.addColorStop(1, '#010204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Parallax subtle cosmic stars
    ctx.save();
    ctx.fillStyle = '#ffffff';
    const numStars = 60;
    for (let i = 0; i < numStars; i++) {
      const seed = i * 137.5;
      const sx = (((seed * 31.7 - camX * 0.04) % w) + w) % w;
      const sy = (((seed * 53.3 - camY * 0.04) % h) + h) % h;
      const alpha = 0.15 + 0.35 * Math.sin(time * 1.5 + seed);
      const starSize = i % 5 === 0 ? 1.6 : 1.0;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillRect(sx, sy, starSize, starSize);
    }
    ctx.restore();
  }

  // ----------------------------------------------------
  // MAP TILES (Floors, elevated blocks, industrial walls)
  // ----------------------------------------------------
  private queueMapTiles(
    room: RoomDefinition,
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    const halfW = TILE_WIDTH / 2;
    const halfH = TILE_HEIGHT / 2;

    for (let x = 0; x < room.width; x++) {
      for (let y = 0; y < room.depth; y++) {
        const tile = room.floorGrid[x][y];
        const elev = tile.elevation || 0;
        const depth = (x + y) * 100 + elev * 10;

        queue.push({
          depth,
          draw: () => {
            const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
            if (!ctx) return;
            const screen = worldToScreen(x, y, elev);

            if (tile.type === 'wall' || elev > 0) {
              // ----------------------------------------------------
              // INDUSTRIAL BULKHEAD WALL / ELEVATED COLUMN
              // ----------------------------------------------------
              const totalHeight = elev * TILE_Z_HEIGHT;

              // 1. Base Ambient Occlusion on ground
              const baseScreen = worldToScreen(x, y, 0);
              ctx.beginPath();
              ctx.ellipse(baseScreen.x, baseScreen.y + halfH, halfW * 1.05, halfH * 0.85, 0, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
              ctx.fill();

              // 2. Left Face (Shadow Side - directional lighting from top-right)
              const leftGrad = ctx.createLinearGradient(
                screen.x - halfW,
                screen.y,
                screen.x,
                screen.y + halfH + totalHeight
              );
              leftGrad.addColorStop(0, tile.type === 'wall' ? '#111827' : '#1e293b');
              leftGrad.addColorStop(1, '#090d16');

              ctx.fillStyle = leftGrad;
              ctx.beginPath();
              ctx.moveTo(screen.x - halfW, screen.y);
              ctx.lineTo(screen.x, screen.y + halfH);
              ctx.lineTo(screen.x, screen.y + halfH + totalHeight);
              ctx.lineTo(screen.x - halfW, screen.y + totalHeight);
              ctx.closePath();
              ctx.fill();

              // Structural vertical rib on left face
              ctx.strokeStyle = '#0b1120';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(screen.x - halfW * 0.5, screen.y + halfH * 0.5);
              ctx.lineTo(screen.x - halfW * 0.5, screen.y + halfH * 0.5 + totalHeight);
              ctx.stroke();

              // Wall edge seam
              ctx.strokeStyle = '#090d16';
              ctx.lineWidth = 1.0;
              ctx.stroke();

              // 3. Right Face (Lit Side - metallic specular sheen)
              const rightGrad = ctx.createLinearGradient(
                screen.x,
                screen.y + halfH,
                screen.x + halfW,
                screen.y + totalHeight
              );
              rightGrad.addColorStop(0, tile.type === 'wall' ? '#243044' : '#38465c');
              rightGrad.addColorStop(1, '#131b2a');

              ctx.fillStyle = rightGrad;
              ctx.beginPath();
              ctx.moveTo(screen.x, screen.y + halfH);
              ctx.lineTo(screen.x + halfW, screen.y);
              ctx.lineTo(screen.x + halfW, screen.y + totalHeight);
              ctx.lineTo(screen.x, screen.y + halfH + totalHeight);
              ctx.closePath();
              ctx.fill();

              // Structural vertical rib on right face
              ctx.strokeStyle = '#2b394f';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(screen.x + halfW * 0.5, screen.y + halfH * 0.5);
              ctx.lineTo(screen.x + halfW * 0.5, screen.y + halfH * 0.5 + totalHeight);
              ctx.stroke();

              // 4. Top Face (Cap Surface - bevel and cyber paneling)
              const topGrad = ctx.createLinearGradient(
                screen.x - halfW,
                screen.y - halfH,
                screen.x + halfW,
                screen.y + halfH
              );
              topGrad.addColorStop(0, tile.type === 'wall' ? '#3e4d66' : '#526582');
              topGrad.addColorStop(1, tile.type === 'wall' ? '#263447' : '#334358');

              ctx.fillStyle = topGrad;
              ctx.beginPath();
              ctx.moveTo(screen.x, screen.y - halfH);
              ctx.lineTo(screen.x + halfW, screen.y);
              ctx.lineTo(screen.x, screen.y + halfH);
              ctx.lineTo(screen.x - halfW, screen.y);
              ctx.closePath();
              ctx.fill();

              // Specular bevel rim highlight on top surface
              ctx.strokeStyle = room.accentColor || '#38bdf8';
              ctx.lineWidth = 0.9;
              ctx.stroke();

              // Top face recessed inner panel
              ctx.beginPath();
              ctx.moveTo(screen.x, screen.y - halfH + 4);
              ctx.lineTo(screen.x + halfW - 8, screen.y);
              ctx.lineTo(screen.x, screen.y + halfH - 4);
              ctx.lineTo(screen.x - halfW + 8, screen.y);
              ctx.closePath();
              ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
              ctx.fill();
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
              ctx.lineWidth = 0.8;
              ctx.stroke();

              // Status LED diode on wall tops
              if (tile.type === 'wall' && (x + y) % 3 === 0) {
                const ledPulse = (Math.sin(time * 3 + x * 2 + y) + 1) * 0.5;
                ctx.fillStyle = ledPulse > 0.4 ? room.accentColor : 'rgba(56, 189, 248, 0.3)';
                ctx.beginPath();
                ctx.arc(screen.x, screen.y, 2, 0, Math.PI * 2);
                ctx.fill();
              }
            } else {
              // ----------------------------------------------------
              // HIGH-TECH SCI-FI FLOOR TILE
              // ----------------------------------------------------
              const isAlt = (x + y) % 2 === 0;

              // Top face diamond
              ctx.beginPath();
              ctx.moveTo(screen.x, screen.y - halfH);
              ctx.lineTo(screen.x + halfW, screen.y);
              ctx.lineTo(screen.x, screen.y + halfH);
              ctx.lineTo(screen.x - halfW, screen.y);
              ctx.closePath();

              // Subtle metallic directional gradient across tile
              const floorGrad = ctx.createLinearGradient(
                screen.x - halfW,
                screen.y - halfH,
                screen.x + halfW,
                screen.y + halfH
              );
              if (isAlt) {
                floorGrad.addColorStop(0, '#101726');
                floorGrad.addColorStop(0.5, '#0b101c');
                floorGrad.addColorStop(1, '#070b14');
              } else {
                floorGrad.addColorStop(0, '#151e30');
                floorGrad.addColorStop(0.5, '#0f1726');
                floorGrad.addColorStop(1, '#0a0f1a');
              }

              ctx.fillStyle = floorGrad;
              ctx.fill();

              // Beveled expansion seams
              ctx.strokeStyle = '#182438';
              ctx.lineWidth = 0.8;
              ctx.stroke();

              // Corner bolt accents on floor panels
              ctx.fillStyle = '#080d16';
              ctx.fillRect(screen.x - halfW + 4, screen.y - 1, 2, 2);
              ctx.fillRect(screen.x + halfW - 6, screen.y - 1, 2, 2);
              ctx.fillRect(screen.x - 1, screen.y - halfH + 3, 2, 2);
              ctx.fillRect(screen.x - 1, screen.y + halfH - 5, 2, 2);

              // Industrial Grip Grid / Micro-Circuit Lines
              if (isAlt && (x * 3 + y * 5) % 4 === 0) {
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(screen.x - halfW * 0.5, screen.y);
                ctx.lineTo(screen.x, screen.y - halfH * 0.5);
                ctx.lineTo(screen.x + halfW * 0.5, screen.y);
                ctx.lineTo(screen.x, screen.y + halfH * 0.5);
                ctx.closePath();
                ctx.stroke();
              }

              // Glowing Floor Energy Conduits
              if ((x === 3 || x === 7 || y === 4 || y === 8) && (x + y) % 3 === 0) {
                const pulse = (Math.sin(time * 4 + x + y) + 1) * 0.5;
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + pulse * 0.25})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(screen.x, screen.y - halfH * 0.5);
                ctx.lineTo(screen.x, screen.y + halfH * 0.5);
                ctx.stroke();
              }
            }
          },
        });
      }
    }
  }

  // ----------------------------------------------------
  // FLOOR OBJECTS (Switches, Terminals, Teleporters)
  // ----------------------------------------------------
  private queueFloorObjects(
    room: RoomDefinition,
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    // Switches (Pressure Plates & Terminals)
    for (const sw of room.switches) {
      const isTerminal = sw.type === 'terminal' || sw.type === 'toggle';
      const depth = (sw.x + sw.y) * 100 + sw.z * 10 + (isTerminal ? 25 : 5);

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const pos = worldToScreen(sw.x, sw.y, sw.z);

          if (isTerminal) {
            // Energy Terminal / Wall Console (The Ascent / Dead Space style)
            ctx.save();

            // Terminal Base Shadow
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y + 2, 12, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fill();

            // Pedestal Stand
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.rect(pos.x - 5, pos.y - 20, 10, 20);
            ctx.fill();
            ctx.stroke();

            // Holographic Display Panel with Scanlines
            const screenGlow = sw.isActivated ? '#10b981' : '#38bdf8';
            ctx.fillStyle = sw.isActivated ? 'rgba(16, 185, 129, 0.9)' : 'rgba(56, 189, 248, 0.9)';
            ctx.strokeStyle = screenGlow;
            ctx.shadowColor = screenGlow;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(pos.x - 13, pos.y - 34, 26, 16, 3);
            ctx.fill();
            ctx.stroke();

            // Holographic Scanlines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            for (let sl = -32; sl < -20; sl += 3) {
              ctx.fillRect(pos.x - 12, pos.y + sl, 24, 1);
            }

            // Console Text
            ctx.font = 'bold 7px JetBrains Mono, monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 0;
            ctx.fillText(sw.isActivated ? 'SYS_ONLINE' : 'SYS_IDLE', pos.x, pos.y - 23);

            ctx.restore();
          } else {
            // Heavy Isometric Pressure Plate (Titanium Hydraulics)
            const halfW = 20;
            const halfH = 10;
            const isDown = sw.isActivated;
            const isHeavy = !!(sw.requiredWeight && sw.requiredWeight > 1);

            ctx.save();

            // Contact AO
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y + 3, halfW * 1.3, halfH * 1.3, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.fill();

            // Outer hydraulic ring
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y, halfW, halfH, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#090d16';
            ctx.fill();
            ctx.strokeStyle = isDown ? '#10b981' : isHeavy ? '#f59e0b' : '#38bdf8';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            // Inner compression pad
            const padY = pos.y - (isDown ? 1 : 4);
            ctx.beginPath();
            ctx.ellipse(pos.x, padY, halfW * 0.75, halfH * 0.75, 0, 0, Math.PI * 2);
            ctx.fillStyle = isDown ? '#065f46' : '#1e293b';
            ctx.fill();
            ctx.strokeStyle = isDown ? '#34d399' : '#64748b';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Status light pulse
            const pulse = (Math.sin(time * 6) + 1) * 0.5;
            ctx.fillStyle = isDown ? '#34d399' : isHeavy ? '#fbbf24' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(pos.x, padY, 2 + pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        },
      });
    }

    // Teleporters
    for (const tp of room.teleporters) {
      const depth = (tp.x + tp.y) * 100 + tp.z * 10 + 6;
      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const pos = worldToScreen(tp.x, tp.y, tp.z);
          const pulse = (Math.sin(time * 5) + 1) * 0.5;

          ctx.save();
          // Ground Pad AO
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y + 2, 24, 12, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fill();

          // Outer Metal Ring
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, 22, 11, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = tp.color || '#38bdf8';
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Swirling Quantum Core
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, 15 + pulse * 3, 7 + pulse * 1.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + pulse * 0.4})`;
          ctx.fill();

          // Vertical Teleport Energy Beam
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 + pulse * 0.3})`;
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos.x, pos.y - 45);
          ctx.stroke();

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // CRATES (Tactical Sci-Fi Cargo Containers)
  // ----------------------------------------------------
  private queueCrates(
    crates: CrateEntity[],
    room: RoomDefinition,
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const crate of crates) {
      const depth = (crate.x + crate.y + 0.5) * 100 + crate.z * 10 + 20;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;

          const screen = worldToScreen(crate.x, crate.y, crate.z);
          const halfW = (TILE_WIDTH / 2) * crate.w * 0.82;
          const halfH = (TILE_HEIGHT / 2) * crate.d * 0.82;
          const boxH = crate.h * TILE_Z_HEIGHT * 1.1;

          // Surface drop shadow
          const surfaceZ = this.getSurfaceBelow(crate.x, crate.y, room, crate.id);
          const groundScreen = worldToScreen(crate.x, crate.y, surfaceZ);
          const heightAbove = Math.max(0, crate.z - surfaceZ);
          const shadowScale = Math.max(0.35, 1 - (heightAbove / 4) * 0.4);

          ctx.beginPath();
          ctx.ellipse(groundScreen.x, groundScreen.y, halfW * 0.95 * shadowScale, halfH * 0.95 * shadowScale, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * shadowScale})`;
          ctx.fill();

          // 1. Left Face (Shadowed)
          const leftGrad = ctx.createLinearGradient(
            screen.x - halfW,
            screen.y,
            screen.x,
            screen.y + halfH
          );
          leftGrad.addColorStop(0, '#1e3a8a');
          leftGrad.addColorStop(1, '#0f1e42');

          ctx.fillStyle = leftGrad;
          ctx.beginPath();
          ctx.moveTo(screen.x - halfW, screen.y);
          ctx.lineTo(screen.x, screen.y + halfH);
          ctx.lineTo(screen.x, screen.y + halfH - boxH);
          ctx.lineTo(screen.x - halfW, screen.y - boxH);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#0a1428';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Left Face Titanium Reinforcing Bumper
          ctx.strokeStyle = '#1d4ed8';
          ctx.lineWidth = 2.0;
          ctx.strokeRect(screen.x - halfW + 4, screen.y - boxH + 4, halfW - 8, boxH - 8);

          // 2. Right Face (Mid-tone)
          const rightGrad = ctx.createLinearGradient(
            screen.x,
            screen.y + halfH,
            screen.x + halfW,
            screen.y
          );
          rightGrad.addColorStop(0, '#2563eb');
          rightGrad.addColorStop(1, '#1d4ed8');

          ctx.fillStyle = rightGrad;
          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y + halfH);
          ctx.lineTo(screen.x + halfW, screen.y);
          ctx.lineTo(screen.x + halfW, screen.y - boxH);
          ctx.lineTo(screen.x, screen.y + halfH - boxH);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#0f2b6b';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // 3. Top Face (Lit Top Deck)
          const topGrad = ctx.createLinearGradient(
            screen.x - halfW,
            screen.y - halfH - boxH,
            screen.x + halfW,
            screen.y + halfH - boxH
          );
          topGrad.addColorStop(0, '#60a5fa');
          topGrad.addColorStop(1, '#3b82f6');

          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y - halfH - boxH);
          ctx.lineTo(screen.x + halfW, screen.y - boxH);
          ctx.lineTo(screen.x, screen.y + halfH - boxH);
          ctx.lineTo(screen.x - halfW, screen.y - boxH);
          ctx.closePath();
          ctx.fill();

          // Metallic Rim Highlight
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Crate Top Magnetic Clamping Plate
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y - halfH - boxH + 4);
          ctx.lineTo(screen.x + halfW - 8, screen.y - boxH);
          ctx.lineTo(screen.x, screen.y + halfH - boxH - 4);
          ctx.lineTo(screen.x - halfW + 8, screen.y - boxH);
          ctx.closePath();
          ctx.fill();

          // Central Stencil Caution Icon & Text
          const pulse = (Math.sin(time * 5) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + pulse * 0.3})`;
          ctx.font = 'bold 7px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('CRG-02', screen.x, screen.y - boxH + 2);
        },
      });
    }
  }

  // ----------------------------------------------------
  // DOORS & LASER HAZARDS
  // ----------------------------------------------------
  private queueDoorsAndLasers(
    room: RoomDefinition,
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    // Doors
    for (const door of room.doors) {
      const depth = (door.x + door.y) * 100 + door.z * 10 + 30;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const pos = worldToScreen(door.x, door.y, door.z);

          // Hydraulic Frame Pillars
          ctx.save();
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = door.isOpen ? '#10b981' : door.requiredKeycard ? '#f59e0b' : '#ef4444';
          ctx.lineWidth = 2.5;

          // Door Archway Arch
          ctx.beginPath();
          ctx.rect(pos.x - 20, pos.y - 48, 40, 48);
          ctx.stroke();

          // Sliding armored panels
          if (!door.isOpen) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(pos.x - 17, pos.y - 45, 34, 45);

            // Access Tier Emblem
            let cardColor = '#ef4444';
            let cardLabel = 'LOCKED';
            if (door.requiredKeycard === 'BLUE' || door.requiredKeycard === 'ALPHA') {
              cardColor = '#38bdf8';
              cardLabel = 'SEC-α';
            } else if (door.requiredKeycard === 'RED') {
              cardColor = '#ef4444';
              cardLabel = 'SEC-R';
            } else if (door.requiredKeycard === 'GREEN') {
              cardColor = '#10b981';
              cardLabel = 'APEX';
            } else if (door.requiredKeycard === 'BETA') {
              cardColor = '#c084fc';
              cardLabel = 'SEC-β';
            }

            ctx.fillStyle = cardColor;
            ctx.shadowColor = cardColor;
            ctx.shadowBlur = 8;
            ctx.fillRect(pos.x - 12, pos.y - 28, 24, 11);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 7px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(cardLabel, pos.x, pos.y - 20);
          } else {
            // Open Gateway Holographic Safety Field
            const pulse = (Math.sin(time * 6) + 1) * 0.5;
            ctx.fillStyle = `rgba(16, 185, 129, ${0.12 + pulse * 0.1})`;
            ctx.fillRect(pos.x - 17, pos.y - 45, 34, 45);
          }

          ctx.restore();
        },
      });
    }

    // Lasers
    for (const laser of room.lasers) {
      if (!laser.isActive) continue;
      const depth = (laser.startX + laser.startY) * 100 + laser.z * 10 + 28;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const p1 = worldToScreen(laser.startX, laser.startY, laser.z);
          const p2 = worldToScreen(laser.endX, laser.endY, laser.z);
          const pulse = (Math.sin(time * 18) + 1) * 0.5;

          ctx.save();
          // Outer Hazard Beam Glow
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 8 + pulse * 4;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y - 12);
          ctx.lineTo(p2.x, p2.y - 12);
          ctx.stroke();

          // Intense Red Core
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y - 12);
          ctx.lineTo(p2.x, p2.y - 12);
          ctx.stroke();

          // Blinding White Hot Core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
          ctx.stroke();

          // Ground Reflection Laser Pool
          const g1 = worldToScreen(laser.startX, laser.startY, 0);
          const g2 = worldToScreen(laser.endX, laser.endY, 0);
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.15 + pulse * 0.15})`;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(g1.x, g1.y);
          ctx.lineTo(g2.x, g2.y);
          ctx.stroke();

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // ITEMS & COLLECTIBLES (Quantum Crystals, Keycards)
  // ----------------------------------------------------
  private queueItems(
    items: ItemCollectible[],
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const item of items) {
      if (item.isCollected) continue;
      const bob = Math.sin(time * 4 + item.x * 2) * 5;
      const depth = (item.x + item.y) * 100 + item.z * 10 + 25;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const pos = worldToScreen(item.x, item.y, item.z);
          const py = pos.y + bob;

          // Shadow on ground
          const ground = worldToScreen(item.x, item.y, 0);
          ctx.beginPath();
          ctx.ellipse(ground.x, ground.y, 10, 5, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fill();

          if (item.type.startsWith('keycard_')) {
            let cardColor = '#38bdf8';
            let glyph = 'α';
            if (item.type.includes('red')) { cardColor = '#ef4444'; glyph = 'R'; }
            else if (item.type.includes('green')) { cardColor = '#10b981'; glyph = 'G'; }
            else if (item.type.includes('beta')) { cardColor = '#c084fc'; glyph = 'β'; }

            ctx.save();
            ctx.translate(pos.x, py - 16);
            ctx.fillStyle = '#090d16';
            ctx.strokeStyle = cardColor;
            ctx.lineWidth = 1.8;
            ctx.shadowColor = cardColor;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.roundRect(-10, -7, 20, 14, 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(glyph, 0, 3);
            ctx.restore();
          } else if (item.type === 'nexus_fragment') {
            // Quantum Fragment Crystalline Octahedron
            const pulse = (Math.sin(time * 6) + 1) * 0.5;
            ctx.save();
            ctx.translate(pos.x, py - 20);
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 16 + pulse * 8;

            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.lineTo(9, 0);
            ctx.lineTo(0, 14);
            ctx.lineTo(-9, 0);
            ctx.closePath();
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Inner facet lines
            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.lineTo(0, 14);
            ctx.moveTo(-9, 0);
            ctx.lineTo(9, 0);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.0;
            ctx.stroke();

            ctx.restore();
          } else {
            // Generic Energy Cell / Medkit
            ctx.save();
            ctx.translate(pos.x, py - 15);
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        },
      });
    }
  }

  // ----------------------------------------------------
  // ENEMY VISION CONES (Holographic Volumetric Projection)
  // ----------------------------------------------------
  private queueVisionCones(
    drones: PatrolDrone[],
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const drone of drones) {
      const depth = (drone.x + drone.y) * 100 + 12;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;

          const fov = drone.visionFov || Math.PI * 0.45;
          const range = drone.visionRange || 5.2;
          const facing = drone.visionAngle ?? 0;
          const state = drone.alertState || 'patrol';

          const apex = worldToScreen(drone.x, drone.y, 0.05);

          const segments = 16;
          const arcPoints: { x: number; y: number }[] = [];
          const startAngle = facing - fov * 0.5;

          for (let s = 0; s <= segments; s++) {
            const angle = startAngle + (fov * s) / segments;
            const wx = drone.x + Math.cos(angle) * range;
            const wy = drone.y + Math.sin(angle) * range;
            arcPoints.push(worldToScreen(wx, wy, 0.05));
          }

          ctx.save();

          // Alert level styling
          let fillCol = 'rgba(16, 185, 129, 0.12)';
          let strokeCol = 'rgba(52, 211, 153, 0.55)';
          let edgeGlow = '#10b981';

          if (state === 'suspicious') {
            const pulse = (Math.sin(time * 12) + 1) * 0.5;
            fillCol = `rgba(245, 158, 11, ${0.16 + pulse * 0.12})`;
            strokeCol = 'rgba(251, 191, 36, 0.85)';
            edgeGlow = '#f59e0b';
          } else if (state === 'search') {
            fillCol = 'rgba(249, 115, 22, 0.22)';
            strokeCol = 'rgba(251, 146, 60, 0.9)';
            edgeGlow = '#f97316';
          } else if (state === 'chase') {
            const strobe = (Math.sin(time * 24) + 1) * 0.5;
            fillCol = `rgba(239, 68, 68, ${0.25 + strobe * 0.2})`;
            strokeCol = 'rgba(239, 68, 68, 1.0)';
            edgeGlow = '#ef4444';
          }

          // Render Volumetric Cone Fan
          ctx.beginPath();
          ctx.moveTo(apex.x, apex.y);
          for (const pt of arcPoints) {
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.fillStyle = fillCol;
          ctx.fill();

          ctx.lineWidth = state === 'chase' ? 2.2 : 1.4;
          ctx.strokeStyle = strokeCol;
          ctx.stroke();

          // Animated Radar Sweep Ring
          const sweepFrac = (time * (state === 'chase' ? 2.5 : 1.2)) % 1;
          const sweepR = range * sweepFrac;
          ctx.beginPath();
          for (let s = 0; s <= segments; s++) {
            const angle = startAngle + (fov * s) / segments;
            const wx = drone.x + Math.cos(angle) * sweepR;
            const wy = drone.y + Math.sin(angle) * sweepR;
            const spt = worldToScreen(wx, wy, 0.05);
            if (s === 0) ctx.moveTo(spt.x, spt.y);
            else ctx.lineTo(spt.x, spt.y);
          }
          ctx.strokeStyle = edgeGlow;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Turret Laser Target Beam
          if (drone.type === 'turret') {
            const beamDist = state === 'chase' ? range : range * 0.9;
            const tx = drone.x + Math.cos(facing) * beamDist;
            const ty = drone.y + Math.sin(facing) * beamDist;
            const ts = worldToScreen(tx, ty, 0.05);

            ctx.beginPath();
            ctx.moveTo(apex.x, apex.y - 12);
            ctx.lineTo(ts.x, ts.y);
            ctx.strokeStyle = state === 'chase' ? '#ef4444' : '#f59e0b';
            ctx.lineWidth = state === 'chase' ? 2.2 : 1.2;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Laser Target Reticle Dot
            ctx.beginPath();
            ctx.arc(ts.x, ts.y, state === 'chase' ? 4.5 : 3.0, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
          }

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // ENEMY CHASSIS & ADVANCED PATROL DRONES
  // ----------------------------------------------------
  private queueDrones(
    drones: PatrolDrone[],
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const drone of drones) {
      const isSentinel = drone.type === 'sentinel';
      const isTurret = drone.type === 'turret';
      const isSecurity = drone.type === 'security' || drone.type === 'guardian';
      const bob = isTurret ? 0 : Math.sin(time * 5 + drone.bobOffset) * (isSentinel ? 6 : 4);
      const depth = (drone.x + drone.y) * 100 + drone.z * 10 + 40;
      const state = drone.alertState || 'patrol';
      const isChasing = state === 'chase';

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;

          const pos = worldToScreen(drone.x, drone.y, drone.z);
          const py = pos.y + bob - 18;

          // Ground Contact Shadow
          const ground = worldToScreen(drone.x, drone.y, 0);
          ctx.beginPath();
          const shadowRadius = isSentinel ? 22 : isSecurity ? 20 : 16;
          ctx.ellipse(ground.x, ground.y, shadowRadius, shadowRadius * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = isChasing ? 'rgba(239, 68, 68, 0.45)' : 'rgba(0, 0, 0, 0.55)';
          ctx.fill();

          ctx.save();

          if (isTurret) {
            // Heavy Bolted Fortress Turret (The Ascent style)
            // Octagonal base
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y - 4, 17, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Hazard chevrons on foundation
            ctx.fillStyle = '#eab308';
            ctx.fillRect(pos.x - 11, pos.y - 7, 4, 6);
            ctx.fillRect(pos.x + 7, pos.y - 7, 4, 6);

            // Rotating Armored Dome
            ctx.fillStyle = isChasing ? '#450a0a' : '#1e293b';
            ctx.strokeStyle = isChasing ? '#ef4444' : '#64748b';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - 14, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Dual Precision Barrels
            const angle = drone.visionAngle ?? 0;
            const barrelLen = 15;
            const bx = Math.cos(angle) * barrelLen;
            const by = Math.sin(angle) * (barrelLen * 0.6);

            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#090d16';
            ctx.beginPath();
            ctx.moveTo(pos.x - 3, pos.y - 14);
            ctx.lineTo(pos.x - 3 + bx, pos.y - 14 + by);
            ctx.moveTo(pos.x + 3, pos.y - 14);
            ctx.lineTo(pos.x + 3 + bx, pos.y - 14 + by);
            ctx.stroke();

            // Central Sensor Eye
            ctx.fillStyle = isChasing ? '#ef4444' : '#f59e0b';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = isChasing ? 14 : 7;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Floating Combat Drone / Sentinel
            ctx.translate(pos.x, py);

            // Anti-gravity plasma thruster ring underneath
            const thrusterPulse = (Math.sin(time * 16) + 1) * 0.5;
            ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + thrusterPulse * 0.4})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(0, 10, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Armored Chassis (Directional metallic gradient)
            const bodyGrad = ctx.createLinearGradient(-12, -12, 12, 12);
            bodyGrad.addColorStop(0, isChasing ? '#7f1d1d' : '#1e293b');
            bodyGrad.addColorStop(1, isChasing ? '#450a0a' : '#0f172a');

            ctx.fillStyle = bodyGrad;
            ctx.strokeStyle = isChasing ? '#ef4444' : '#475569';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-12, -10, 24, 18, 5);
            ctx.fill();
            ctx.stroke();

            // Procedural Rim Light Highlight on Drone
            ctx.strokeStyle = isChasing ? '#fca5a5' : '#94a3b8';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(-10, -9);
            ctx.lineTo(10, -9);
            ctx.stroke();

            // Sensor Eye (Dead Space / Alien Isolation style scanner)
            ctx.fillStyle = isChasing ? '#ef4444' : '#10b981';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = isChasing ? 14 : 8;
            ctx.beginPath();
            ctx.arc(0, -1, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Floating stabilizer wings
            ctx.fillStyle = '#090d16';
            ctx.strokeStyle = isChasing ? '#ef4444' : '#38bdf8';
            ctx.lineWidth = 1.2;
            ctx.fillRect(-17, -4, 4, 8);
            ctx.strokeRect(-17, -4, 4, 8);
            ctx.fillRect(13, -4, 4, 8);
            ctx.strokeRect(13, -4, 4, 8);
          }

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // ENEMY PROJECTILES
  // ----------------------------------------------------
  private queueProjectiles(
    projectiles: EnemyProjectile[],
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const p of projectiles) {
      const depth = (p.x + p.y) * 100 + p.z * 10 + 42;

      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;
          const screenPos = worldToScreen(p.x, p.y, p.z);

          ctx.save();
          ctx.shadowColor = p.color || '#ef4444';
          ctx.shadowBlur = 14;

          // Energy Bolt Core
          ctx.fillStyle = p.color || '#ef4444';
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, 5, 0, Math.PI * 2);
          ctx.fill();

          // Hot White Center
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Motion streak trail
          ctx.beginPath();
          ctx.moveTo(screenPos.x, screenPos.y);
          ctx.lineTo(screenPos.x - p.vx * 2.0, screenPos.y - p.vy * 2.0);
          ctx.strokeStyle = p.glowColor || '#f87171';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // EXIT PORTAL (Quantum Event Horizon Gateway)
  // ----------------------------------------------------
  private queueExitPortal(
    portal: ExitPortal,
    queue: { depth: number; draw: () => void }[],
    time: number,
    playerCells: number
  ) {
    const depth = (portal.x + portal.y) * 100 + portal.z * 10 + 45;
    const isPrimed = playerCells >= portal.requiredEnergyCells;

    queue.push({
      depth,
      draw: () => {
        const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
        if (!ctx) return;
        const pos = worldToScreen(portal.x, portal.y, portal.z);

        ctx.save();
        // Heavy Stargate Arch Frame
        ctx.strokeStyle = isPrimed ? '#10b981' : '#475569';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y - 32, 38, 50, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Gravitational Vortex Interior
        const vortexGrad = ctx.createRadialGradient(pos.x, pos.y - 32, 4, pos.x, pos.y - 32, 36);
        if (isPrimed) {
          vortexGrad.addColorStop(0, '#ffffff');
          vortexGrad.addColorStop(0.3, '#34d399');
          vortexGrad.addColorStop(0.7, '#065f46');
          vortexGrad.addColorStop(1, 'transparent');
        } else {
          vortexGrad.addColorStop(0, '#334155');
          vortexGrad.addColorStop(1, '#0b101c');
        }

        ctx.fillStyle = vortexGrad;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y - 32, 34, 46, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Chevron Glyphs
        if (isPrimed) {
          ctx.save();
          ctx.translate(pos.x, pos.y - 32);
          ctx.rotate(time * 0.8);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.0;
          for (let c = 0; c < 6; c++) {
            ctx.rotate(Math.PI / 3);
            ctx.strokeRect(30, -3, 6, 6);
          }
          ctx.restore();
        }

        // Status Readout
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isPrimed ? '#34d399' : '#f59e0b';
        ctx.fillText(
          isPrimed ? 'EXTRACTION PRIMED' : `GATEWAY LOCK: ${playerCells}/${portal.requiredEnergyCells} CELLS`,
          pos.x,
          pos.y - 88
        );

        ctx.restore();
      },
    });
  }

  // ----------------------------------------------------
  // MOVING ELEVATORS
  // ----------------------------------------------------
  private queueMovingElevators(
    elevators: MovingElevator[],
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    for (const elev of elevators) {
      const depth = (elev.x + elev.y) * 100 + elev.z * 10 + 15;
      queue.push({
        depth,
        draw: () => {
          const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
          if (!ctx) return;

          const screen = worldToScreen(elev.x, elev.y, elev.z);
          const baseScreen = worldToScreen(elev.x, elev.y, elev.minZ || 0);
          const halfW = (TILE_WIDTH / 2) * (elev.width || 1.2) * 0.9;
          const halfH = (TILE_HEIGHT / 2) * (elev.depth || 1.2) * 0.9;
          const platformThick = 9;

          ctx.save();

          // Hydraulic Column
          if (screen.y < baseScreen.y) {
            ctx.fillStyle = '#090d16';
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.rect(screen.x - 6, screen.y + platformThick, 12, baseScreen.y - screen.y - platformThick);
            ctx.fill();
            ctx.stroke();
          }

          // Base shadow
          ctx.beginPath();
          ctx.ellipse(baseScreen.x, baseScreen.y, halfW, halfH, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fill();

          // Platform Top Deck
          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y - halfH);
          ctx.lineTo(screen.x + halfW, screen.y);
          ctx.lineTo(screen.x, screen.y + halfH);
          ctx.lineTo(screen.x - halfW, screen.y);
          ctx.closePath();
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Center Reactor Ring
          const pulse = (Math.sin(time * 5) + 1) * 0.5;
          ctx.beginPath();
          ctx.ellipse(screen.x, screen.y, halfW * 0.45, halfH * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + pulse * 0.3})`;
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.restore();
        },
      });
    }
  }

  // ----------------------------------------------------
  // PLAYER (CYBER OPERATIVE WITH RIM LIGHTING & HIGH-TECH SUIT)
  // ----------------------------------------------------
  private queuePlayer(
    player: PlayerState,
    room: RoomDefinition,
    queue: { depth: number; draw: () => void }[],
    time: number
  ) {
    const depth = (player.x + player.y) * 100 + player.z * 10 + 32;

    queue.push({
      depth,
      draw: () => {
        const ctx = (window as unknown as { __currentRenderCtx: CanvasRenderingContext2D }).__currentRenderCtx;
        if (!ctx) return;

        const screen = worldToScreen(player.x, player.y, player.z);
        const surfaceZ = this.getSurfaceBelow(player.x, player.y, room);
        const ground = worldToScreen(player.x, player.y, surfaceZ);

        // 1. Dynamic Surface Drop Shadow
        const heightFactor = Math.max(0.2, 1 - (Math.max(0, player.z - surfaceZ) / 3.5) * 0.45);
        ctx.beginPath();
        ctx.ellipse(ground.x, ground.y, 16 * heightFactor, 8 * heightFactor, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.58 * heightFactor})`;
        ctx.fill();

        // 2. Invulnerability flicker
        if (player.invulnerableTimer > 0 && Math.floor(time * 20) % 2 === 0) {
          return;
        }

        ctx.save();
        ctx.translate(screen.x, screen.y - 18);

        // Walk cycle animation bob
        const walkBob = player.isMoving ? Math.sin(player.walkFrame * 2) * 2.2 : 0;
        const legAngle = player.isMoving ? Math.sin(player.walkFrame * 2) * 0.45 : 0;

        // 3. Cybernetic Legs
        ctx.strokeStyle = '#090d16';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(-4, 8 + walkBob);
        ctx.lineTo(-4 + Math.sin(legAngle) * 6, 17 + walkBob);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(4, 8 + walkBob);
        ctx.lineTo(4 - Math.sin(legAngle) * 6, 17 + walkBob);
        ctx.stroke();

        // 4. Armored Torso / Power Suit (Directional metallic gradient)
        const torsoGrad = ctx.createLinearGradient(-8, -4 + walkBob, 8, 10 + walkBob);
        torsoGrad.addColorStop(0, '#0284c7');
        torsoGrad.addColorStop(1, '#034575');

        ctx.fillStyle = torsoGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-8, -4 + walkBob, 16, 14, 3);
        ctx.fill();
        ctx.stroke();

        // 5. Procedural Rim Light Highlight (The Ascent / Ruiner style silhouette pop)
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-7, -3 + walkBob);
        ctx.lineTo(-7, 8 + walkBob);
        ctx.stroke();

        // 6. Chest Arc-Reactor Core (Pulsing cyan emission)
        const corePulse = (Math.sin(time * 8) + 1) * 0.5;
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10 + corePulse * 4;
        ctx.beginPath();
        ctx.arc(0, 3 + walkBob, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 7. Head Chassis
        const headGrad = ctx.createLinearGradient(-9, -18 + walkBob, 9, -4 + walkBob);
        headGrad.addColorStop(0, '#f1f5f9');
        headGrad.addColorStop(1, '#94a3b8');

        ctx.fillStyle = headGrad;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-9, -18 + walkBob, 18, 14, 4);
        ctx.fill();
        ctx.stroke();

        // Visor facing offset
        let visorOffsetX = 0;
        if (player.direction === 'E' || player.direction === 'SE' || player.direction === 'NE') {
          visorOffsetX = 3.5;
        } else if (player.direction === 'W' || player.direction === 'SW' || player.direction === 'NW') {
          visorOffsetX = -3.5;
        }

        // Visor Glow & Lens Flare
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.fillRect(-5 + visorOffsetX, -14 + walkBob, 10, 5);
        ctx.shadowBlur = 0;

        // Cyber Antenna / Audio Sensors
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-5, -18 + walkBob);
        ctx.lineTo(-7, -24 + walkBob);
        ctx.moveTo(5, -18 + walkBob);
        ctx.lineTo(7, -24 + walkBob);
        ctx.stroke();

        // 8. Crate Carrying Magnetic Harness
        if (player.carriedCrate) {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.moveTo(-6, -4 + walkBob);
          ctx.lineTo(-12, -18 + walkBob);
          ctx.lineTo(-9, -28 + walkBob);
          ctx.moveTo(6, -4 + walkBob);
          ctx.lineTo(12, -18 + walkBob);
          ctx.lineTo(9, -28 + walkBob);
          ctx.stroke();

          // Magnetic Clamp Emissive Nodes
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fillRect(-11, -30 + walkBob, 4, 4);
          ctx.fillRect(7, -30 + walkBob, 4, 4);
          ctx.shadowBlur = 0;

          // Carried Crate hovering above head
          const crateY = -48 + walkBob;
          const cw = 16;
          const ch = 8;
          const cDepth = 14;

          ctx.beginPath();
          ctx.moveTo(0, crateY - ch);
          ctx.lineTo(cw, crateY);
          ctx.lineTo(0, crateY + ch);
          ctx.lineTo(-cw, crateY);
          ctx.closePath();
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-cw, crateY);
          ctx.lineTo(0, crateY + ch);
          ctx.lineTo(0, crateY + ch + cDepth);
          ctx.lineTo(-cw, crateY + cDepth);
          ctx.closePath();
          ctx.fillStyle = '#1e3a8a';
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cw, crateY);
          ctx.lineTo(0, crateY + ch);
          ctx.lineTo(0, crateY + ch + cDepth);
          ctx.lineTo(cw, crateY + cDepth);
          ctx.closePath();
          ctx.fillStyle = '#172554';
          ctx.fill();
          ctx.stroke();
        }

        // Jump Thrusters Flare
        if (!player.isGrounded) {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(-3, 14 + walkBob);
          ctx.lineTo(3, 14 + walkBob);
          ctx.lineTo(0, 22 + walkBob + Math.random() * 5);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      },
    });
  }

  // ----------------------------------------------------
  // VOLUMETRIC LIGHTING PASS (DEFERRED CANVAS COMPOSITING)
  // ----------------------------------------------------
  private renderVolumetricLightingPass(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    camX: number,
    camY: number,
    zoom: number,
    room: RoomDefinition,
    player: PlayerState,
    time: number
  ) {
    const { canvas: lCanvas, ctx: lCtx } = this.getLightBuffer(canvasW, canvasH);
    const lw = lCanvas.width;
    const lh = lCanvas.height;
    const scale = lw / canvasW;

    // 1. Clear Light Buffer with space station ambient darkness
    lCtx.clearRect(0, 0, lw, lh);
    lCtx.fillStyle = 'rgba(2, 4, 10, 0.88)';
    lCtx.fillRect(0, 0, lw, lh);

    // Save lightmap matrix matching isometric camera space
    lCtx.save();
    lCtx.scale(scale, scale);
    lCtx.translate(canvasW / 2 - camX * zoom, canvasH / 2 - camY * zoom);
    lCtx.scale(zoom, zoom);

    // We use 'destination-out' to cut radiant light holes in the ambient darkness
    lCtx.globalCompositeOperation = 'destination-out';

    // ----------------------------------------------------
    // PLAYER ILLUMINATION: AMBIENT VISIBILITY
    // ----------------------------------------------------
    const playerScreen = worldToScreen(player.x, player.y, player.z);
    const flashOriginX = playerScreen.x;
    const flashOriginY = playerScreen.y - 18;

    // Soft omnidirectional light around operative
    const coreGrad = lCtx.createRadialGradient(flashOriginX, flashOriginY, 10, flashOriginX, flashOriginY, 130);
    coreGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    coreGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.75)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    lCtx.fillStyle = coreGrad;
    lCtx.beginPath();
    lCtx.arc(flashOriginX, flashOriginY, 130, 0, Math.PI * 2);
    lCtx.fill();

    // ----------------------------------------------------
    // LIGHT 2: TERMINALS & EMISSIVE SWITCHES
    // ----------------------------------------------------
    for (const sw of room.switches) {
      const sp = worldToScreen(sw.x, sw.y, sw.z);
      const sGrad = lCtx.createRadialGradient(sp.x, sp.y - 20, 5, sp.x, sp.y - 20, 65);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = sGrad;
      lCtx.beginPath();
      lCtx.arc(sp.x, sp.y - 20, 65, 0, Math.PI * 2);
      lCtx.fill();
    }

    // ----------------------------------------------------
    // LIGHT 4: LASER BARRIER GLOW
    // ----------------------------------------------------
    for (const laser of room.lasers) {
      if (!laser.isActive) continue;
      const lp1 = worldToScreen(laser.startX, laser.startY, laser.z);
      const lp2 = worldToScreen(laser.endX, laser.endY, laser.z);
      const mx = (lp1.x + lp2.x) * 0.5;
      const my = (lp1.y + lp2.y) * 0.5 - 12;

      const lGrad = lCtx.createRadialGradient(mx, my, 10, mx, my, 85);
      lGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      lGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = lGrad;
      lCtx.beginPath();
      lCtx.arc(mx, my, 85, 0, Math.PI * 2);
      lCtx.fill();
    }

    // ----------------------------------------------------
    // LIGHT 5: DRONE SEARCHLIGHTS
    // ----------------------------------------------------
    for (const drone of room.drones) {
      const dp = worldToScreen(drone.x, drone.y, drone.z);
      const dGrad = lCtx.createRadialGradient(dp.x, dp.y - 18, 5, dp.x, dp.y - 18, 75);
      dGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      dGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = dGrad;
      lCtx.beginPath();
      lCtx.arc(dp.x, dp.y - 18, 75, 0, Math.PI * 2);
      lCtx.fill();
    }

    // ----------------------------------------------------
    // LIGHT 6: EMERGENCY ALARM BEACON (Chase Mode)
    // ----------------------------------------------------
    const hasChase = room.drones.some((d) => d.alertState === 'chase');
    if (hasChase) {
      const sirenAngle = time * 4.0;
      const sx = Math.cos(sirenAngle) * 350;
      const sy = Math.sin(sirenAngle) * 200;
      const sirenGrad = lCtx.createRadialGradient(
        playerScreen.x + sx,
        playerScreen.y + sy,
        20,
        playerScreen.x + sx,
        playerScreen.y + sy,
        320
      );
      sirenGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      sirenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = sirenGrad;
      lCtx.beginPath();
      lCtx.arc(playerScreen.x + sx, playerScreen.y + sy, 320, 0, Math.PI * 2);
      lCtx.fill();
    }

    lCtx.restore();

    // ----------------------------------------------------
    // COMPOSITE LIGHTMAP OVER MAIN CANVAS (Hardware-Accelerated)
    // ----------------------------------------------------
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(lCanvas, 0, 0, lw, lh, 0, 0, canvasW, canvasH);
    ctx.restore();
  }

  // ----------------------------------------------------
  // CINEMATIC VIGNETTE & COLOR GRADING
  // ----------------------------------------------------
  private drawCinematicVignette(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    room: RoomDefinition,
    time: number
  ) {
    ctx.save();
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.max(w, h) * 0.72;

    const vigGrad = ctx.createRadialGradient(cx, cy, maxR * 0.45, cx, cy, maxR);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.7, 'rgba(1, 3, 8, 0.35)');
    vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');

    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Emergency Alarm Screen Strobe if Under Pursuit
    const hasChase = room.drones.some((d) => d.alertState === 'chase');
    if (hasChase) {
      const strobe = (Math.sin(time * 12) + 1) * 0.5;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.04 + strobe * 0.06})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  // ----------------------------------------------------
  // HELPER: SURFACE HEIGHT DETECTION
  // ----------------------------------------------------
  private getSurfaceBelow(
    x: number,
    y: number,
    room: RoomDefinition,
    ignoreCrateId?: string
  ): number {
    let maxHeight = 0;
    const gx = Math.floor(x);
    const gy = Math.floor(y);

    if (gx >= 0 && gx < room.width && gy >= 0 && gy < room.depth) {
      const tile = room.floorGrid[gx]?.[gy];
      maxHeight = tile?.elevation || 0;
    }

    if (room.crates) {
      for (const crate of room.crates) {
        if (crate.id === ignoreCrateId) continue;
        if (
          x >= crate.x - 0.48 * crate.w &&
          x <= crate.x + 0.48 * crate.w &&
          y >= crate.y - 0.48 * crate.d &&
          y <= crate.y + 0.48 * crate.d
        ) {
          const top = crate.z + crate.h;
          if (top > maxHeight) maxHeight = top;
        }
      }
    }

    if (room.movingElevators) {
      for (const elev of room.movingElevators) {
        const halfW = (elev.width || 1.2) * 0.55;
        const halfD = (elev.depth || 1.2) * 0.55;
        if (Math.abs(x - elev.x) <= halfW && Math.abs(y - elev.y) <= halfD) {
          if (elev.z > maxHeight) maxHeight = elev.z;
        }
      }
    }

    return maxHeight;
  }

  // ----------------------------------------------------
  // PARTICLES
  // ----------------------------------------------------
  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    ctx.save();
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const pos = worldToScreen(p.x, p.y, p.vz || 0);
      ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export const renderer = new IsometricRenderer();
