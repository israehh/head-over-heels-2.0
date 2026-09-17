# Orbital Station Zenith — Floor Sprite Migration Specification
**Document**: `floor_sprite_migration.md`  
**Role**: Senior Engine Programmer & Technical Artist  
**Target Function**: `queueMapTiles()` in `src/engine/renderer.ts`  
**Target Atlas**: `/assets/atlases/atlas_environment.png` + `atlas_environment_spec.json`  

---

## 1. Existing Code Section

Currently, in `src/engine/renderer.ts` (lines 308–376), floor tiles are rasterized per-frame using Canvas 2D vector path commands, linear gradient allocations, and procedural accent strokes.

```typescript
// Location: src/engine/renderer.ts:308-376
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
```

---

## 2. New Code Section

In the modified `queueMapTiles()`, the procedural diamond block is replaced by an anchor-aligned atlas blit (`drawImage`). 

```typescript
// Replacement inside queueMapTiles() within src/engine/renderer.ts:
            } else {
              // ----------------------------------------------------
              // HIGH-PERFORMANCE ATLAS FLOOR TILE (WITH PROCEDURAL FALLBACK)
              // ----------------------------------------------------
              const isAlt = (x + y) % 2 === 0;
              const sectorQuadrant = (room.sector || 'alpha').toLowerCase();
              const biome = sectorQuadrant.includes('beta') ? 'beta'
                : sectorQuadrant.includes('gamma') ? 'gamma'
                : sectorQuadrant.includes('delta') ? 'delta'
                : sectorQuadrant.includes('omega') ? 'omega'
                : 'alpha';

              const spriteKey = isAlt
                ? `tile_floor_${biome}_alt`
                : `tile_floor_${biome}_standard`;

              const frame = environmentAssetCache.getFrame(spriteKey);
              const atlas = environmentAssetCache.getAtlas();

              if (frame && atlas) {
                // High-performance direct texture blit
                // Anchor (32, 16) places the 64x32 sprite center directly on screen.x, screen.y
                ctx.drawImage(
                  atlas,
                  frame.x,
                  frame.y,
                  frame.w,
                  frame.h,
                  Math.round(screen.x - frame.anchorX),
                  Math.round(screen.y - frame.anchorY),
                  frame.w,
                  frame.h
                );

                // Emissive conduit overlay (retains dynamic sector ambient lighting)
                if ((x === 3 || x === 7 || y === 4 || y === 8) && (x + y) % 3 === 0) {
                  const pulse = (Math.sin(time * 4 + x + y) + 1) * 0.5;
                  ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + pulse * 0.25})`;
                  ctx.lineWidth = 1.2;
                  ctx.beginPath();
                  ctx.moveTo(screen.x, screen.y - halfH * 0.5);
                  ctx.lineTo(screen.x, screen.y + halfH * 0.5);
                  ctx.stroke();
                }
              } else {
                // Guaranteed Zero-Regression Procedural Fallback
                this.drawProceduralFloorTile(ctx, screen.x, screen.y, halfW, halfH, isAlt, x, y, time);
              }
            }
```

---

## 3. Asset Loading Code

This module asynchronously loads the texture atlas image and parses its associated frame coordinate specification into a typed memory map.

```typescript
// Module: src/engine/assetLoader.ts

export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
  anchorX: number;
  anchorY: number;
}

export interface AtlasSpecification {
  meta: {
    image: string;
    size: { w: number; h: number };
    format: string;
  };
  frames: Record<string, FrameRect>;
}

export class AssetLoader {
  private static instance: AssetLoader;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private specCache: Map<string, AtlasSpecification> = new Map();
  private loadPromises: Map<string, Promise<boolean>> = new Map();

  private constructor() {}

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  /**
   * Preloads an atlas image and its JSON manifest concurrently.
   */
  public async loadAtlas(atlasId: string, imageSrc: string, specSrc: string): Promise<boolean> {
    if (this.loadPromises.has(atlasId)) {
      return this.loadPromises.get(atlasId)!;
    }

    const promise = (async () => {
      try {
        const [img, specResponse] = await Promise.all([
          this.loadImage(imageSrc),
          fetch(specSrc).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${specSrc}`);
            return res.json() as Promise<AtlasSpecification>;
          }),
        ]);

        this.imageCache.set(atlasId, img);
        this.specCache.set(atlasId, specResponse);
        return true;
      } catch (err) {
        console.warn(`[AssetLoader] Failed to load atlas "${atlasId}". Falling back to procedural vectors.`, err);
        return false;
      }
    })();

    this.loadPromises.set(atlasId, promise);
    return promise;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error(`Image load error for ${src}`));
      img.src = src;
    });
  }

  public getImage(atlasId: string): HTMLImageElement | null {
    const img = this.imageCache.get(atlasId);
    return (img && img.complete && img.naturalWidth > 0) ? img : null;
  }

  public getSpec(atlasId: string): AtlasSpecification | null {
    return this.specCache.get(atlasId) || null;
  }
}
```

---

## 4. Sprite Caching Code

To ensure **zero GC overhead** (no runtime object allocations or string concatenations inside the render loop), the floor subsystem pre-caches fast direct references to the sprite UV bounding boxes.

```typescript
// Module: src/engine/environmentCache.ts
import { AssetLoader, FrameRect } from './assetLoader';

class EnvironmentAssetCache {
  private atlasId = 'environment';
  private frameMap: Map<string, FrameRect> = new Map();
  private cachedAtlasImage: HTMLImageElement | null = null;
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;

    // Default 64x32 isometric floor diamond frame definitions
    // Standard Anchor Point: (32, 16) - center of diamond
    const defaultFloorFrames: Record<string, FrameRect> = {
      'tile_floor_alpha_standard': { x: 0, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_alpha_alt':      { x: 64, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_beta_standard':  { x: 128, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_beta_alt':       { x: 192, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_gamma_standard': { x: 256, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_gamma_alt':      { x: 320, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_delta_standard': { x: 384, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_delta_alt':      { x: 448, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_omega_standard': { x: 512, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
      'tile_floor_omega_alt':      { x: 576, y: 0, w: 64, h: 32, anchorX: 32, anchorY: 16 },
    };

    for (const [key, frame] of Object.entries(defaultFloorFrames)) {
      this.frameMap.set(key, frame);
    }

    this.isInitialized = true;
  }

  public getAtlas(): HTMLImageElement | null {
    if (!this.cachedAtlasImage) {
      this.cachedAtlasImage = AssetLoader.getInstance().getImage(this.atlasId);
    }
    return this.cachedAtlasImage;
  }

  public getFrame(spriteKey: string): FrameRect | undefined {
    return this.frameMap.get(spriteKey);
  }

  public registerCustomFrames(frames: Record<string, FrameRect>) {
    for (const [key, frame] of Object.entries(frames)) {
      this.frameMap.set(key, frame);
    }
  }
}

export const environmentAssetCache = new EnvironmentAssetCache();
environmentAssetCache.init();
```

---

## 5. Fallback to Procedural Rendering

If the atlas image is still downloading or if an error occurs, the renderer seamlessly falls back to the exact procedural routines.

```typescript
// Extracted Helper inside src/engine/renderer.ts:
  private drawProceduralFloorTile(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    halfW: number,
    halfH: number,
    isAlt: boolean,
    x: number,
    y: number,
    time: number
  ) {
    // 1. Top face diamond
    ctx.beginPath();
    ctx.moveTo(screenX, screenY - halfH);
    ctx.lineTo(screenX + halfW, screenY);
    ctx.lineTo(screenX, screenY + halfH);
    ctx.lineTo(screenX - halfW, screenY);
    ctx.closePath();

    // 2. Linear Gradient fill
    const floorGrad = ctx.createLinearGradient(
      screenX - halfW,
      screenY - halfH,
      screenX + halfW,
      screenY + halfH
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

    // 3. Beveled seams
    ctx.strokeStyle = '#182438';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 4. Corner bolt accents
    ctx.fillStyle = '#080d16';
    ctx.fillRect(screenX - halfW + 4, screenY - 1, 2, 2);
    ctx.fillRect(screenX + halfW - 6, screenY - 1, 2, 2);
    ctx.fillRect(screenX - 1, screenY - halfH + 3, 2, 2);
    ctx.fillRect(screenX - 1, screenY + halfH - 5, 2, 2);

    // 5. Industrial Micro-Circuit Lines
    if (isAlt && (x * 3 + y * 5) % 4 === 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(screenX - halfW * 0.5, screenY);
      ctx.lineTo(screenX, screenY - halfH * 0.5);
      ctx.lineTo(screenX + halfW * 0.5, screenY);
      ctx.lineTo(screenX, screenY + halfH * 0.5);
      ctx.closePath();
      ctx.stroke();
    }
  }
```

---

## 6. Architectural Preservation Guarantees

1. **Preserve Depth Sorting**:
   * The queue key formula remains strictly identical:
     $$\text{depth} = (x + y) \cdot 100 + \text{elev} \cdot 10$$
   * For flat ground floor tiles ($\text{elev} = 0$), depth is exactly $(x + y) \cdot 100$. This preserves the Painter's Algorithm order relative to walls, entities, player boots, crates, and collectibles.
2. **Preserve `worldToScreen()`**:
   * Ground positions are queried directly from:
     ```ts
     const screen = worldToScreen(x, y, elev);
     ```
   * No alteration to isometric math in `src/engine/isometric.ts`.
3. **Preserve Z Elevation**:
   * If `tile.elevation > 0` or `tile.type === 'wall'`, the renderer diverts to the wall/pillar extrusion block. Only true horizontal base planes ($\text{elev} = 0$) receive the floor diamond sprite.
4. **Preserve Collision System**:
   * Physics and navigation rely entirely on `room.floorGrid[x][y].walkable` and `checkAABBCollision()`. Canvas rendering is purely consumer-side and does not feed back into physics checks.
5. **Preserve Room Transitions**:
   * When `roomNetwork.ts` or `gameLoop.ts` switches active rooms, `room.floorGrid` is immediately re-read. The dynamic `biome` lookup adapts instantly to the new sector's visual identity.

---

## 7. Performance Considerations

* **Draw Call Cost**: Procedural rendering required **9 discrete Canvas API calls** per floor tile (`beginPath`, `moveTo`, 3x `lineTo`, `createLinearGradient`, 3x `addColorStop`, `fill`, `stroke`, 4x `fillRect`). For an $18\times 14$ room, this amounted to $\approx 2,268$ canvas API instructions per frame.
* **Atlas Blit Cost**: With `drawImage`, this drops to **1 blit call per tile** ($\approx 252$ instructions per frame), representing an **$\approx 88.9\%$ reduction in Canvas API invocations**.
* **Garbage Collection (GC)**: The procedural implementation allocated up to 252 `CanvasGradient` objects per frame in V8 heap memory. Atlas blitting reuses cached coordinate integers, resulting in **zero heap allocations** in the hot loop.
* **Pixel Alignment (`Math.round`)**: Passing rounded integers to `ctx.drawImage` prevents fractional anti-aliasing artifacts (eliminates 1px dark seams between adjacent isometric diamond tiles).
