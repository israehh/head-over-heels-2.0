# Orbital Station Zenith — Asset Integration Plan
**Document**: `asset_integration_plan.md`  
**Role**: Senior Engine Programmer & Technical Artist  
**Objective**: Transformation Blueprint from Procedural Vector Rendering to Texture Atlas Blitting

---

## 1. Architectural Conversion Pattern

### 1.1 The Fundamental Replacement Formula
Currently, `renderer.ts` evaluates paths, mathematical bezier/arc calculations, and multi-stop color gradients for every entity on every frame.

The replacement pipeline substitutes expensive vector rasterization with high-throughput texture atlas blitting via:
```ts
ctx.drawImage(
  atlasImage,
  sprite.x,       // sx: sub-rectangle source X in atlas
  sprite.y,       // sy: sub-rectangle source Y in atlas
  sprite.w,       // sw: source width
  sprite.h,       // sh: source height
  Math.round(screen.x - sprite.anchorX), // dx: aligned destination X
  Math.round(screen.y - sprite.anchorY), // dy: aligned destination Y
  sprite.w,       // dw: destination width
  sprite.h        // dh: destination height
);
```

### 1.2 Coordinate System & Anchor Point Mathematics
In 2.5D isometric projection:
$$\text{screenX} = (x - y) \cdot \frac{W_{\text{tile}}}{2}, \quad \text{screenY} = (x + y) \cdot \frac{H_{\text{tile}}}{2} - z \cdot H_z$$

The destination coordinate must align the sprite's visual ground contact point precisely to `(screenX, screenY)`:
$$\text{destX} = \text{screenX} - \text{anchorX}, \quad \text{destY} = \text{screenY} - \text{anchorY}$$

* **Floor Diamonds ($64\times 32$)**: Anchor at `(32, 16)` places the sprite center on the tile diamond vertex.
* **Walls & Columns ($64\times 64$ / $64\times 96$)**: Anchor at `(32, 64)` or `(32, 96)` grounds the bottom corner to $(x, y, 0)$.
* **Player Operative ($64\times 64$)**: Anchor at `(32, 52)` grounds the character boots at $z=0$, providing 12px for jump height and jet flare exhaust.
* **Crates ($64\times 64$)**: Anchor at `(32, 48)` matches the bottom corner of the isometric bounding cube.

---

## 2. Before & After Code Transformations

### 2.1 Floor Tile Rendering

#### Current (Procedural Diamond & Gradient)
```ts
// File: src/engine/renderer.ts:313-340
ctx.beginPath();
ctx.moveTo(screen.x, screen.y - halfH);
ctx.lineTo(screen.x + halfW, screen.y);
ctx.lineTo(screen.x, screen.y + halfH);
ctx.lineTo(screen.x - halfW, screen.y);
ctx.closePath();

const floorGrad = ctx.createLinearGradient(
  screen.x - halfW, screen.y - halfH,
  screen.x + halfW, screen.y + halfH
);
floorGrad.addColorStop(0, isAlt ? '#101726' : '#151e30');
floorGrad.addColorStop(0.5, isAlt ? '#0b101c' : '#0f1726');
floorGrad.addColorStop(1, isAlt ? '#070b14' : '#0a0f1a');
ctx.fillStyle = floorGrad;
ctx.fill();

ctx.strokeStyle = '#182438';
ctx.lineWidth = 0.8;
ctx.stroke();
```

#### Replacement (`drawImage` Atlas Blit)
```ts
// Atlas: atlas_environment.png
const spriteName = isAlt ? `tile_floor_${biome}_alt` : `tile_floor_${biome}_standard`;
const frame = assetLoader.getFrame('environment', spriteName);

if (frame) {
  ctx.drawImage(
    assetLoader.getAtlas('environment'),
    frame.x, frame.y, frame.w, frame.h,
    Math.round(screen.x - frame.anchorX), // anchorX = 32
    Math.round(screen.y - frame.anchorY), // anchorY = 16
    frame.w, frame.h
  );
} else {
  // Procedural Fallback
}
```

---

### 2.2 Bulkhead Wall Rendering

#### Current (Procedural Shadow/Lit Polygons & AO)
```ts
// File: src/engine/renderer.ts:203-252
// Left Face (Shadow Side)
const leftGrad = ctx.createLinearGradient(
  screen.x - halfW, screen.y,
  screen.x, screen.y + halfH + totalHeight
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

// Right Face (Lit Side)
const rightGrad = ctx.createLinearGradient(
  screen.x, screen.y + halfH,
  screen.x + halfW, screen.y + totalHeight
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
```

#### Replacement (`drawImage` Atlas Blit)
```ts
// Atlas: atlas_environment.png
const wallSprite = elev > 1 
  ? `wall_pillar_column_${biome}`
  : `wall_standard_${biome}`;
const frame = assetLoader.getFrame('environment', wallSprite);

if (frame) {
  ctx.drawImage(
    assetLoader.getAtlas('environment'),
    frame.x, frame.y, frame.w, frame.h,
    Math.round(screen.x - frame.anchorX), // anchorX = 32
    Math.round(screen.y - frame.anchorY), // anchorY = 64 (or 96)
    frame.w, frame.h
  );
} else {
  // Procedural Fallback
}
```

---

### 2.3 Tactical Cargo Crate Rendering

#### Current (Procedural Isometric Cube & Drop Shadow)
```ts
// File: src/engine/renderer.ts:575-644
// Dynamic Shadow
ctx.beginPath();
ctx.ellipse(groundScreen.x, groundScreen.y, halfW * 0.95 * shadowScale, halfH * 0.95 * shadowScale, 0, 0, Math.PI * 2);
ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * shadowScale})`;
ctx.fill();

// Left Face
ctx.fillStyle = leftGrad;
ctx.beginPath();
ctx.moveTo(screen.x - halfW, screen.y);
ctx.lineTo(screen.x, screen.y + halfH);
ctx.lineTo(screen.x, screen.y + halfH - boxH);
ctx.lineTo(screen.x - halfW, screen.y - boxH);
ctx.closePath();
ctx.fill();

// Right Face
ctx.fillStyle = rightGrad;
ctx.beginPath();
ctx.moveTo(screen.x, screen.y + halfH);
ctx.lineTo(screen.x + halfW, screen.y);
ctx.lineTo(screen.x + halfW, screen.y - boxH);
ctx.lineTo(screen.x, screen.y + halfH - boxH);
ctx.closePath();
ctx.fill();

// Top Face
ctx.fillStyle = topGrad;
ctx.beginPath();
ctx.moveTo(screen.x, screen.y - halfH - boxH);
ctx.lineTo(screen.x + halfW, screen.y - boxH);
ctx.lineTo(screen.x, screen.y + halfH - boxH);
ctx.lineTo(screen.x - halfW, screen.y - boxH);
ctx.closePath();
ctx.fill();
```

#### Replacement (`drawImage` Atlas Blit)
```ts
// Atlas: atlas_environment.png
// 1. Blit Dynamic Drop Shadow
const shadowFrame = assetLoader.getFrame('environment', 'crate_shadow_dynamic');
if (shadowFrame) {
  ctx.save();
  ctx.globalAlpha = 0.55 * shadowScale;
  ctx.drawImage(
    assetLoader.getAtlas('environment'),
    shadowFrame.x, shadowFrame.y, shadowFrame.w, shadowFrame.h,
    Math.round(groundScreen.x - shadowFrame.anchorX * shadowScale),
    Math.round(groundScreen.y - shadowFrame.anchorY * shadowScale),
    shadowFrame.w * shadowScale,
    shadowFrame.h * shadowScale
  );
  ctx.restore();
}

// 2. Blit Crate Body
const crateSprite = crate.weight > 1 ? 'crate_heavy_reinforced' : 'crate_standard_blue';
const frame = assetLoader.getFrame('environment', crateSprite);
if (frame) {
  ctx.drawImage(
    assetLoader.getAtlas('environment'),
    frame.x, frame.y, frame.w, frame.h,
    Math.round(screen.x - frame.anchorX), // anchorX = 32
    Math.round(screen.y - frame.anchorY), // anchorY = 48
    frame.w, frame.h
  );
}
```

---

### 2.4 Hydraulic Blast Door Rendering

#### Current (Procedural Frame & Sliding Rectangle)
```ts
// File: src/engine/renderer.ts:697-727
ctx.beginPath();
ctx.rect(pos.x - 20, pos.y - 48, 40, 48);
ctx.stroke();

if (!door.isOpen) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(pos.x - 17, pos.y - 45, 34, 45);
  ctx.fillStyle = cardColor;
  ctx.fillRect(pos.x - 12, pos.y - 28, 24, 11);
}
```

#### Replacement (`drawImage` Flipbook Blit)
```ts
// Atlas: atlas_environment.png
// Frame: 8-frame sliding door cycle (f0 = closed, f7 = fully retracted)
const animFrameIndex = Math.floor(door.openProgress * 7);
const frameName = `door_slide_standard_f${animFrameIndex}`;
const frame = assetLoader.getFrame('environment', frameName);

// Blit Frame and Sliding Panel
if (frame) {
  ctx.drawImage(
    assetLoader.getAtlas('environment'),
    frame.x, frame.y, frame.w, frame.h,
    Math.round(pos.x - frame.anchorX),
    Math.round(pos.y - frame.anchorY),
    frame.w, frame.h
  );
}
```

---

### 2.5 Cyber Operative Player Character

#### Current (Procedural Multi-Part Body with Sine Limbs)
```ts
// File: src/engine/renderer.ts:1398-1465
ctx.beginPath();
ctx.moveTo(-4, 8 + walkBob);
ctx.lineTo(-4 + Math.sin(legAngle) * 6, 17 + walkBob);
ctx.stroke();

ctx.fillStyle = torsoGrad;
ctx.roundRect(-8, -4 + walkBob, 16, 14, 3);
ctx.fill();

ctx.fillStyle = headGrad;
ctx.roundRect(-9, -18 + walkBob, 18, 14, 4);
ctx.fill();

ctx.fillStyle = '#06b6d4';
ctx.fillRect(-5 + visorOffsetX, -14 + walkBob, 10, 5);
```

#### Replacement (`drawImage` 8-Directional Flipbook)
```ts
// Atlas: atlas_player.png
// Dynamic Action Key Resolution:
// e.g., 'player_walk_se_f2', 'player_idle_nw_f0', 'player_carry_walk_s_f3'
const action = player.carriedCrate 
  ? (player.isMoving ? 'carry_walk' : 'carry_idle')
  : (!player.isGrounded ? 'jump' : (player.isMoving ? 'walk' : 'idle'));

const dir = player.direction.toLowerCase();
const frameNum = player.isMoving ? (Math.floor(player.walkFrame * 2) % 8) : 0;
const spriteKey = `player_${action}_${dir}_f${frameNum}`;

const frame = assetLoader.getFrame('player', spriteKey);
if (frame) {
  ctx.drawImage(
    assetLoader.getAtlas('player'),
    frame.x, frame.y, frame.w, frame.h,
    Math.round(screen.x - frame.anchorX), // anchorX = 32
    Math.round(screen.y - frame.anchorY), // anchorY = 52
    frame.w, frame.h
  );
}
```

---

### 2.6 Patrol Sentinel & Defense Turret

#### Current (Procedural Swivel Geometry & Wing Rects)
```ts
// File: src/engine/renderer.ts:1074-1150
// Turret Dome and Barrels
ctx.arc(pos.x, pos.y - 14, 12, 0, Math.PI * 2);
ctx.stroke();
ctx.moveTo(pos.x - 3, pos.y - 14);
ctx.lineTo(pos.x - 3 + bx, pos.y - 14 + by);
ctx.stroke();

// Sentinel Body and Wings
ctx.roundRect(-12, -10, 24, 18, 5);
ctx.fill();
ctx.fillRect(-17, -4, 4, 8);
ctx.fillRect(13, -4, 4, 8);
```

#### Replacement (`drawImage` Directional Atlas)
```ts
// Atlas: atlas_entities_items.png
if (drone.type === 'turret') {
  // Base blit
  const baseFrame = assetLoader.getFrame('entities', 'turret_base_industrial');
  ctx.drawImage(atlas, baseFrame.x, baseFrame.y, baseFrame.w, baseFrame.h,
    Math.round(pos.x - baseFrame.anchorX), Math.round(pos.y - baseFrame.anchorY), baseFrame.w, baseFrame.h);
  
  // 16-angle indexed turret head swivel
  const angleIndex = Math.round(((drone.visionAngle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 8)) % 16;
  const headFrame = assetLoader.getFrame('entities', `turret_head_dir${angleIndex}`);
  ctx.drawImage(atlas, headFrame.x, headFrame.y, headFrame.w, headFrame.h,
    Math.round(pos.x - headFrame.anchorX), Math.round(pos.y - headFrame.anchorY), headFrame.w, headFrame.h);
} else {
  // Sentinel 4-directional hover loop
  const dir = getIsometricDirection(drone.heading);
  const hoverF = Math.floor(time * 8) % 4;
  const droneFrame = assetLoader.getFrame('entities', `drone_sentinel_hover_${dir}_f${hoverF}`);
  ctx.drawImage(atlas, droneFrame.x, droneFrame.y, droneFrame.w, droneFrame.h,
    Math.round(pos.x - droneFrame.anchorX), Math.round(py - droneFrame.anchorY), droneFrame.w, droneFrame.h);
}
```

---

## 3. Graceful Fallback Strategy

To guarantee that the game never crashes or renders blank frames during asset loading or network interruptions:
```ts
class AssetLoader {
  private atlases: Map<string, HTMLImageElement> = new Map();
  private specs: Map<string, AtlasSpec> = new Map();

  public getFrame(atlasKey: string, spriteName: string): FrameData | null {
    const spec = this.specs.get(atlasKey);
    const img = this.atlases.get(atlasKey);
    if (!spec || !img || !img.complete || img.naturalWidth === 0) {
      return null; // Signals renderer to execute the procedural vector fallback
    }
    return spec.frames[spriteName] || null;
  }
}
```
Every render method preserves its original procedural draw code in an `else` branch.
