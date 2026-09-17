# Orbital Station Zenith — Renderer & Pipeline Procedural Draw Audit
**Document**: `renderer_audit.md`  
**Role**: Senior Engine Programmer & Technical Artist  
**Scope**: Complete rendering pipeline audit (`src/engine/renderer.ts`, `src/engine/isometric.ts`, `src/components/GameCanvas.tsx`)

---

## 1. Executive Summary & Pipeline Overview

The rendering architecture of **Orbital Station Zenith** is an isometric 2.5D system powered by HTML5 Canvas 2D. The game executes a fixed-step loop inside `src/components/GameCanvas.tsx`, invoking `renderer.render(params: RenderContext)` inside `src/engine/renderer.ts`.

### Rendering Pipeline Lifecycle per Frame:
1. **Viewport & Camera Transformation**: `ctx.setTransform(...)` scales and translates the camera to center on the player with zoom and fractional pixel alignment.
2. **Backdrop Pass**: `drawCinematicBackdrop(...)` renders deep space, sector nebula gradients, and parallax starfield points directly to screen coordinates.
3. **Queue Population Pass**: Render items are pushed to `renderQueue: { depth: number; draw: () => void }[]` by 11 domain queue methods.
4. **Z-Order Depth Sorting Pass**: `renderQueue.sort((a, b) => a.depth - b.depth)` executes the Painter's Algorithm.
5. **Draw Execution Pass**: Sorted callbacks execute sequentially, writing procedural vector geometries, gradients, and composite shadows.
6. **Particle Pass**: `drawParticles(...)` draws non-sorted volumetric spark/smoke particles with alpha blending.
7. **Post-Process Pass**: `drawCinematicVignette(...)` applies an alert-strobe screen overlay if any drone is in `chase` state.

---

## 2. Exhaustive Draw Call Audit Table

Below is the exhaustive function-by-function audit of all procedural draw calls across the engine.

| ID | Function Name | Engine File & Lines | Procedural Canvas Primitives | Screen Coords Source | World Coords Source | Depth Sorting Source | Animation Source | Collision Dependency |
|---|---|---|---|---|---|---|---|---|
| **01** | `drawBackdrop` | `src/engine/renderer.ts:117-164` | `fillRect`, `createRadialGradient`, loop of `fillRect` stars | Screen bounds $(0,0,w,h)$ | Viewport offset $(camX, camY)$ | Background pre-pass (No depth key; drawn first) | Star shimmer: $\sin(time \cdot 1.5 + seed)$; Cam parallax: $camX \cdot 0.04$ | None |
| **02** | `drawFloor` | `src/engine/renderer.ts:308-376` | `beginPath`, `moveTo`, `lineTo`, `createLinearGradient`, `fill`, `stroke`, `fillRect` (bolts), conduit lines | `worldToScreen(x, y, 0)` | `room.floorGrid[x][y]` ($x \in [0, w), y \in [0, d)$) | `(x + y) * 100` | Conduit pulse: $\sin(time \cdot 4 + x + y)$ | `tile.walkable`, `tile.elevation == 0` |
| **03** | `drawWall` | `src/engine/renderer.ts:190-307` | Ground AO `ellipse`, left face gradient `polygon`, right face gradient `polygon`, top cap `polygon`, vertical ribs, LED `arc` | `worldToScreen(x, y, elev)` & base at `worldToScreen(x, y, 0)` | `room.floorGrid[x][y]`, $elev = tile.elevation$ | `(x + y) * 100 + elev * 10` | Diode strobe: $\sin(time \cdot 3 + x \cdot 2 + y)$ | `tile.type === 'wall'`, $elev > 0$, solid vertical barrier |
| **04** | `drawSwitch` (Pressure Plate) | `src/engine/renderer.ts:448-489` | Contact AO `ellipse`, outer hydraulic ring `ellipse`, inner pad `ellipse`, status `arc` | `worldToScreen(sw.x, sw.y, sw.z)` | `room.switches[]` where `type === 'pressure'` | `(sw.x + sw.y) * 100 + sw.z * 10 + 5` | Spring depression ($padY = pos.y - 1$ or $- 4$); Status LED: $\sin(time \cdot 6)$ | Trigger volume `(sw.x, sw.y, sw.z)`, `sw.requiredWeight` |
| **05** | `drawTerminal` (Console) | `src/engine/renderer.ts:404-446` | Base `ellipse`, pedestal `rect`, holographic `roundRect` with scanline loop, `fillText` | `worldToScreen(sw.x, sw.y, sw.z)` | `room.switches[]` where `type === 'terminal' \|\| 'toggle'` | `(sw.x + sw.y) * 100 + sw.z * 10 + 25` | State transition (`sw.isActivated ? ONLINE : IDLE`) | Solid obstacle cylinder ($r=0.4, h=1.2$) |
| **06** | `drawTeleporter` | `src/engine/renderer.ts:500-536` | Ground AO `ellipse`, metal ring `ellipse`, quantum core `ellipse`, vertical beam line | `worldToScreen(tp.x, tp.y, tp.z)` | `room.teleporters[]` | `(tp.x + tp.y) * 100 + tp.z * 10 + 6` | Swirling core pulse: $\sin(time \cdot 5)$; Beam width oscillation | Trigger cylinder ($r=0.6, h=1.5$), `tp.targetRoomId` |
| **07** | `drawElevator` | `src/engine/renderer.ts:1295-1347` | Hydraulic shaft `rect`, base shadow `ellipse`, diamond deck `polygon`, reactor ring `ellipse` | `worldToScreen(elev.x, elev.y, elev.z)` & base `worldToScreen(..., minZ)` | `room.movingElevators[]` | `(elev.x + elev.y) * 100 + elev.z * 10 + 15` | Vertical position interpolation $elev.z$; Reactor pulse: $\sin(time \cdot 5)$ | Dynamic moving platform AABB ($w, d, topZ=elev.z$) |
| **08** | `drawCrate` | `src/engine/renderer.ts:556-666` | Surface shadow `ellipse`, left face `polygon`, right face `polygon`, top deck `polygon`, magnetic clamp, stencil `fillText` | `worldToScreen(crate.x, crate.y, crate.z)` | `crates[]` entity list | `(crate.x + crate.y + 0.5) * 100 + crate.z * 10 + 20` | Dynamic shadow scale: $1 - (heightAbove / 4) \cdot 0.4$; Stencil pulse: $\sin(time \cdot 5)$ | Pushable dynamic box AABB ($w, d, h$), ground support check |
| **09** | `drawDoor` | `src/engine/renderer.ts:685-741` | Frame arch `rect`, sliding armored panel `fillRect`, security badge `roundRect`, holographic gateway | `worldToScreen(door.x, door.y, door.z)` | `room.doors[]` | `(door.x + door.y) * 100 + door.z * 10 + 30` | Panel retraction state `door.isOpen`; Safety field pulse: $\sin(time \cdot 6)$ | Solid door jamb & movable barrier AABB when closed |
| **10** | `drawLaser` | `src/engine/renderer.ts:752-795` | Outer hazard glow stroke, intense core stroke, white core stroke, ground reflection pool stroke | `p1 = worldToScreen(startX, startY, z)`, `p2 = worldToScreen(endX, endY, z)` | `room.lasers[]` | `(laser.startX + laser.startY) * 100 + laser.z * 10 + 28` | High-frequency pulse: $\sin(time \cdot 18)$; Core oscillation | 2D raycast segment $(p1, p2)$, lethal on contact |
| **11** | `drawCollectible` (Keycard) | `src/engine/renderer.ts:821-851` | Ground shadow `ellipse`, glowing body `roundRect`, Greek glyph letter `fillText` | `worldToScreen(item.x, item.y, item.z)` | `items[]` where `type.startsWith('keycard_')` | `(item.x + item.y) * 100 + item.z * 10 + 25` | Levitation hover: $\sin(time \cdot 4 + item.x \cdot 2) \cdot 5$ | Proximity pickup sphere ($r=0.5, h=1.0$) |
| **12** | `drawCollectible` (Nexus Crystal) | `src/engine/renderer.ts:852-883` | Ground shadow `ellipse`, octahedron diamond `polygon`, facet cross strokes, glow blur | `worldToScreen(item.x, item.y, item.z)` | `items[]` where `type === 'nexus_fragment'` | `(item.x + item.y) * 100 + item.z * 10 + 26` | Levitation hover + golden aura pulse: $\sin(time \cdot 6)$ | Proximity pickup sphere ($r=0.6, h=1.2$) |
| **13** | `drawCollectible` (Cell/Medkit) | `src/engine/renderer.ts:884-894` | Ground shadow `ellipse`, glowing energy orb `arc`, glow blur | `worldToScreen(item.x, item.y, item.z)` | `items[]` where generic supply | `(item.x + item.y) * 100 + item.z * 10 + 24` | Vertical hover bob | Proximity pickup sphere ($r=0.5$) |
| **14** | `drawVisionCone` | `src/engine/renderer.ts:914-1011` | 16-point arc `polygon` fan, radar sweep arc strokes, turret targeting laser stroke & reticle `arc` | $apex = worldToScreen(drone.x, drone.y, 0.05)$, arc points via $(wx, wy)$ | `room.drones[]` | `(drone.x + drone.y) * 100 + 12` | Radar sweep line: $(time \cdot speed) \bmod 1$; Alert strobe: $\sin(time \cdot 24)$ | Cone-angle FOV raycast intersection with player |
| **15** | `drawDrone` (Sentinel / Scout) | `src/engine/renderer.ts:1102-1154` | Ground shadow `ellipse`, thruster ring `ellipse`, armored chassis `roundRect`, rim light stroke, sensor eye `arc`, stabilizer wings `fillRect` | `worldToScreen(drone.x, drone.y, drone.z)` | `room.drones[]` where `type !== 'turret'` | `(drone.x + drone.y) * 100 + drone.z * 10 + 40` | Hover oscillation: $\sin(time \cdot 5 + offset) \cdot 6$; Thruster pulse: $\sin(time \cdot 16)$ | Aerial combat cylinder ($r=0.5, h=0.8$) |
| **16** | `drawTurret` | `src/engine/renderer.ts:1053-1101` | Octagonal base `ellipse`, hazard chevron `fillRect`, rotating dome `arc`, dual barrel strokes, sensor eye `arc` | `worldToScreen(drone.x, drone.y, drone.z)` | `room.drones[]` where `type === 'turret'` | `(drone.x + drone.y) * 100 + drone.z * 10 + 40` | Barrel orientation: $\cos(\theta) \cdot L, \sin(\theta) \cdot L$; Alert color shift | Static obstacle cylinder ($r=0.6, h=1.0$) |
| **17** | `drawProjectile` | `src/engine/renderer.ts:1174-1205` | Glow blur, outer bolt `arc`, white center `arc`, velocity streak stroke | `worldToScreen(p.x, p.y, p.z)` | `projectiles[]` | `(p.x + p.y) * 100 + p.z * 10 + 42` | Velocity motion vector line $(p.vx \cdot 2, p.vy \cdot 2)$ | Projectile sphere raycast vs player & walls |
| **18** | `drawExitPortal` / `drawBossCore` | `src/engine/renderer.ts:1223-1278` | Stargate arch `ellipse`, vortex radial gradient `ellipse`, rotating chevron `strokeRect` loop, status readout `fillText` | `worldToScreen(portal.x, portal.y, portal.z)` | `room.exitPortal` (Sector 20 Overmind Sanctum) | `(portal.x + portal.y) * 100 + portal.z * 10 + 45` | Vortex rotation: $time \cdot 0.8$; Primed status toggle | Endgame victory trigger volume ($r=1.2, h=2.5$) |
| **19** | `drawPlayer` | `src/engine/renderer.ts:1366-1555` | Drop shadow `ellipse`, cyber leg strokes, armored torso `roundRect`, rim light stroke, arc reactor `arc`, helmet `roundRect`, visor `fillRect`, antenna strokes, magnetic harness strokes, carried crate polygons, thruster flame `polygon` | `worldToScreen(player.x, player.y, player.z)` & surface `worldToScreen(..., surfaceZ)` | `player: PlayerState` | `(player.x + player.y) * 100 + player.z * 10 + 32` | Walk cycle: $\sin(walkFrame \cdot 2)$; Core pulse: $\sin(time \cdot 8)$; Thruster flicker: random flame vertex | Player cylinder capsule ($r=0.35, h=1.6$), ground collision |
| **20** | `drawVignette` | `src/engine/renderer.ts:1560-1576` | Fullscreen alert overlay `fillRect` | Screen bounds $(0, 0, w, h)$ | Global room pursuit check `room.drones.some(chase)` | Post-render overlay (Drawn last, no depth key) | Red pursuit strobe: $\sin(time \cdot 12)$ | None |
| **21** | `drawParticles` | `src/engine/renderer.ts:1627-1639` | Loop of particle `arc` fills with fading alpha | `worldToScreen(p.x, p.y, p.vz)` | `engine.particles[]` | Particle overlay (Rendered post queue) | Particle life ratio: $p.life / p.maxLife$ | None (Pure visual particles) |

---

## 3. Deep Architectural Analysis per Function

### 3.1 `drawFloor()` (Inside `queueMapTiles`)
* **Purpose**: Generates the isometric base diamond plane for walkable tiles with checkerboard tinting, expansion seams, corner rivets, and pulsing energy conduits.
* **Screen Coordinates Source**:
  ```ts
  const screen = worldToScreen(x, y, elev);
  // screen.x = (x - y) * (TILE_WIDTH / 2);
  // screen.y = (x + y) * (TILE_HEIGHT / 2) - elev * TILE_Z_HEIGHT;
  ```
* **World Coordinates Source**: Double loop over `room.width` and `room.depth` querying `room.floorGrid[x][y]`.
* **Depth Sorting Source**: `(x + y) * 100`.
* **Animation Source**: Sinusoidal conduit emissive alpha: `pulse = (Math.sin(time * 4 + x + y) + 1) * 0.5`.
* **Collision Dependency**: Tied to `tile.walkable` and `tile.elevation === 0`. If elevation is positive or tile is a wall, it is branched into `drawWall()`.

### 3.2 `drawWall()` (Inside `queueMapTiles`)
* **Purpose**: Extrudes vertical 2.5D hexagonal column prisms from the floor grid, rendering contact ambient occlusion, shadowed left face, lit right face, beveled top cap, and status diode.
* **Screen Coordinates Source**: Top surface at `worldToScreen(x, y, elev)`; bottom baseline at `worldToScreen(x, y, 0)`.
* **World Coordinates Source**: `tile.elevation` and `tile.type === 'wall'`.
* **Depth Sorting Source**: `(x + y) * 100 + elev * 10`.
* **Animation Source**: Wall top status LED strobe: `Math.sin(time * 3 + x * 2 + y)`.
* **Collision Dependency**: `checkAABBCollision(...)` uses tile coordinates as impassable blocks with vertical height `elev * TILE_Z_HEIGHT`.

### 3.3 `drawCrate()` (Inside `queueCrates`)
* **Purpose**: Renders pushable tactical cargo containers with dynamic drop shadows, beveled side panels, magnetic clamps, and warning stencils.
* **Screen Coordinates Source**: Center origin from `worldToScreen(crate.x, crate.y, crate.z)`.
* **World Coordinates Source**: `crate.x, crate.y, crate.z, crate.w, crate.d, crate.h`.
* **Depth Sorting Source**: `(crate.x + crate.y + 0.5) * 100 + crate.z * 10 + 20`.
* **Animation Source**: Shadow size & opacity scale based on distance to ground: `heightAbove = crate.z - surfaceZ`.
* **Collision Dependency**: Core physics AABB collision in `isometric.ts` (`checkAABBCollision`) and pushing logic in `gameLoop.ts`.

### 3.4 `drawDoor()` (Inside `queueDoorsAndLasers`)
* **Purpose**: Renders the hydraulic bulkhead portal frame, locking mechanism, access keycard tier badge, and animated sliding panel.
* **Screen Coordinates Source**: `worldToScreen(door.x, door.y, door.z)`.
* **World Coordinates Source**: `room.doors[]` array with orientation (`NS` or `EW`).
* **Depth Sorting Source**: `(door.x + door.y) * 100 + door.z * 10 + 30`.
* **Animation Source**: `door.isOpen` boolean and opening pulse: `Math.sin(time * 6)`.
* **Collision Dependency**: A solid impassable wall volume when `door.isOpen === false`; passable trigger zone when `true`.

### 3.5 `drawSwitch()` (Inside `queueFloorObjects`)
* **Purpose**: Renders titanium hydraulic pressure plates and holographic data terminals.
* **Screen Coordinates Source**: `worldToScreen(sw.x, sw.y, sw.z)`.
* **World Coordinates Source**: `room.switches[]` array.
* **Depth Sorting Source**: Plates: `... + 5`; Terminals: `... + 25`.
* **Animation Source**: Hydraulic spring depression displacement: `padY = pos.y - (isDown ? 1 : 4)`.
* **Collision Dependency**: Trigger bounding box in `gameLoop.ts`. If player or crate overlaps the plate coords, `isActivated` is set to true.

### 3.6 `drawDrone()` & `drawTurret()` (Inside `queueDrones`)
* **Purpose**: Renders floating patrol sentinels with anti-grav thrusters and stationary defense turrets with 360-degree rotating gun domes.
* **Screen Coordinates Source**: `worldToScreen(drone.x, drone.y, drone.z)`.
* **World Coordinates Source**: `room.drones[]` array with AI parameters.
* **Depth Sorting Source**: `(drone.x + drone.y) * 100 + drone.z * 10 + 40`.
* **Animation Source**: Hover bob: `Math.sin(time * 5 + drone.bobOffset) * 6`; Thruster plasma: `Math.sin(time * 16)`; Turret swivel: trigonometric projection of `drone.visionAngle`.
* **Collision Dependency**: Cylinder collision check for player damage and drone movement obstruction against room walls.

### 3.7 `drawPlayer()` (Inside `queuePlayer`)
* **Purpose**: Renders the cybernetic operative hero with directional visor flare, animated limb articulation, arc reactor pulse, magnetic harness carrying crates, and jet thruster exhaust.
* **Screen Coordinates Source**: Character root at `worldToScreen(player.x, player.y, player.z)` with translation `screen.y - 18`.
* **World Coordinates Source**: `player.x, player.y, player.z, player.direction, player.isMoving, player.walkFrame`.
* **Depth Sorting Source**: `(player.x + player.y) * 100 + player.z * 10 + 32`.
* **Animation Source**: Foot walk cycle: `Math.sin(player.walkFrame * 2)`; Core pulse: `Math.sin(time * 8)`; Random thruster spark vertex displacement.
* **Collision Dependency**: Fundamental player physics capsule colliding with `floorGrid`, crates, lasers, hazards, and door barriers.
