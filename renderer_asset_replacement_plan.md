# Renderer Asset Replacement Plan: Procedural to Bespoke Asset Roadmap
**Orbital Station Zenith — Technical Artist Systems Architecture & Visual Pipeline Analysis**
*Prepared by: Senior Technical Artist*

---

## 1. Executive Summary

Orbital Station Zenith currently achieves its real-time 2.5D isometric presentation via **100% procedural HTML5 Canvas 2D vector instructions** in `src/engine/renderer.ts`. While this architecture guarantees zero external asset dependencies, zero network download latency, and absolute resolution scalability, it relies on primitive geometric routines (diamond paths, linear gradients, strokerect outlines, and ellipse stamps).

This report performs a comprehensive breakdown of:
- Every procedural visual element currently drawn by code.
- The precise file, function, and rasterization method powering it.
- The target bespoke asset format required for high-fidelity production.
- Classification into the 12 functional categories: **PLAYER**, **ENEMIES**, **BOSSES**, **TILES**, **WALLS**, **DOORS**, **CRATES**, **SWITCHES**, **TERMINALS**, **COLLECTIBLES**, **VFX**, and **UI**.
- Quantitative metrics for **Visual Impact (1–10)**, **Production Effort (Hours)**, and **Implementation Effort (Hours)**.
- Final roadmap sorted strictly by **Highest Visual Improvement Per Hour Invested (ROI = Visual Impact / Total Effort)**.

---

## 2. Global ROI Ranking (Sorted by Highest Visual Improvement Per Hour)

| Rank | Asset Component | Category | Visual Impact (1-10) | Production Effort (h) | Engine Impl Effort (h) | Total Effort (h) | ROI (Impact / Hour) | Recommended Phase |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | **Plasma Energy Cells & Nano-Medkits** | `COLLECTIBLES` | **6** | 2.5h | 1h | 3.5h | **1.71** | Phase 1 (Quick Wins) |
| **#2** | **Nexus Quantum Crystalline Fragments** | `COLLECTIBLES` | **8** | 4h | 1.5h | 5.5h | **1.45** | Phase 1 (Quick Wins) |
| **#3** | **High-Energy Laser Hazard Beams** | `VFX` | **8** | 3.5h | 2h | 5.5h | **1.45** | Phase 1 (Quick Wins) |
| **#4** | **Security Clearance Keycards (Blue, Red, Green)** | `COLLECTIBLES` | **6.5** | 3h | 1.5h | 4.5h | **1.44** | Phase 1 (Quick Wins) |
| **#5** | **Holographic Vision Cones & Radar Sweeps** | `VFX` | **8.5** | 4h | 2.5h | 6.5h | **1.31** | Phase 1 (Quick Wins) |
| **#6** | **Titanium Hydraulic Pressure Plates** | `SWITCHES` | **6.5** | 3.5h | 1.5h | 5h | **1.30** | Phase 1 (Quick Wins) |
| **#7** | **Magnetic Crate Harness & Thruster Flame** | `PLAYER` | **7** | 4h | 2h | 6h | **1.17** | Phase 2 (High Leverage) |
| **#8** | **Tactical Radar Minimap & Node Grid** | `UI` | **7** | 4h | 2h | 6h | **1.17** | Phase 2 (High Leverage) |
| **#9** | **Interactive Holographic Data Terminals** | `TERMINALS` | **7.5** | 4.5h | 2h | 6.5h | **1.15** | Phase 2 (High Leverage) |
| **#10** | **Quantum Teleporter Pads** | `SWITCHES` | **7.5** | 5h | 2h | 7h | **1.07** | Phase 2 (High Leverage) |
| **#11** | **Tactical Cyberpunk HUD Gauges & Frames** | `UI` | **7.5** | 5h | 2h | 7h | **1.07** | Phase 2 (High Leverage) |
| **#12** | **Combat Projectiles, Sparks & Impacts** | `VFX` | **8** | 5h | 2.5h | 7.5h | **1.07** | Phase 2 (High Leverage) |
| **#13** | **Quantum Reunification Stargate & Vortex** | `VFX` | **8.5** | 6h | 2.5h | 8.5h | **1.00** | Phase 2 (High Leverage) |
| **#14** | **Deep Space Parallax Nebula & Starfield** | `VFX` | **8.5** | 7h | 2h | 9h | **0.94** | Phase 2 (High Leverage) |
| **#15** | **Wall Conduit Cables & Access Panels** | `WALLS` | **6.5** | 5h | 2h | 7h | **0.93** | Phase 2 (High Leverage) |
| **#16** | **Hazard Warning Borders & Pits** | `TILES` | **7.5** | 6h | 2.5h | 8.5h | **0.88** | Phase 3 (Core Production) |
| **#17** | **Tactical Cargo Crates & Heavy Boxes** | `CRATES` | **8.5** | 8h | 2.5h | 10.5h | **0.81** | Phase 3 (Core Production) |
| **#18** | **Automated Hydraulic Bulkhead Doors** | `DOORS` | **8** | 8h | 3h | 11h | **0.73** | Phase 3 (Core Production) |
| **#19** | **Heavy Automated Fortress Turrets** | `ENEMIES` | **8** | 8h | 3h | 11h | **0.73** | Phase 3 (Core Production) |
| **#20** | **Sector Floor Deck Tiles (5 Biomes)** | `TILES` | **9.5** | 12h | 4h | 16h | **0.59** | Phase 4 (Late Production) |
| **#21** | **Combat Patrol Drones & Sentinels** | `ENEMIES` | **9** | 14h | 4h | 18h | **0.50** | Phase 4 (Late Production) |
| **#22** | **Modular Bulkhead Walls & Columns** | `WALLS` | **9** | 16h | 5h | 21h | **0.43** | Phase 4 (Late Production) |
| **#23** | **Overmind Central Core Boss Entity** | `BOSSES` | **9.5** | 18h | 5h | 23h | **0.41** | Phase 4 (Late Production) |
| **#24** | **Cyber Operative Character & Animations** | `PLAYER` | **10** | 24h | 6h | 30h | **0.33** | Phase 4 (Late Production) |

---

## 3. Comprehensive Breakdown by Functional Category

### PLAYER

#### **Magnetic Crate Harness & Thruster Flame** (`player_carried_harness`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queuePlayer()`
- **Current Render Method**: Procedural stroke brackets, carried crate diamond, jump thruster triangle flare
- **Asset Type Required**: `Layered Equipment Sprite Overlays + VFX Flame Animation Strip (32x32px PNG)`
- **Specifications**: Magnetic clamp beams, jump thruster flame particle strip (4 frames)
- **Visual Impact**: **7 / 10** | **Production Effort**: 4 hrs | **Implementation Effort**: 2 hrs | **Total**: 6 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.17**

#### **Cyber Operative Character & Animations** (`player_operative_suit`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queuePlayer()`
- **Current Render Method**: Procedural Vector Composite (roundRect torso, gradient helmet, stroke limbs, sin() walk bob)
- **Asset Type Required**: `8-Directional Isometric Character Spritesheet (64x64px per frame, PNG, 60fps)`
- **Specifications**: Idle (4f), Run/Walk (8f), Push Crate (6f), Carry Crate (6f), Jump/Airborne (3f), Hurt/Death (4f) across 8 directions
- **Visual Impact**: **10 / 10** | **Production Effort**: 24 hrs | **Implementation Effort**: 6 hrs | **Total**: 30 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.33**

### ENEMIES

#### **Heavy Automated Fortress Turrets** (`enemy_turrets_bolted`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueDrones()`
- **Current Render Method**: Procedural Octagonal Base + Rotating Dome Arc + Dual Line Barrels + Sensor Eye Dot
- **Asset Type Required**: `Turret Base Sprite + 360-Degree Rotational Swivel Turret Head Sheet (48x48px, 16 angles, PNG)`
- **Specifications**: Heavy riveted foundation with hazard stripes, rotating twin-barrel railgun pod
- **Visual Impact**: **8 / 10** | **Production Effort**: 8 hrs | **Implementation Effort**: 3 hrs | **Total**: 11 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.73**

#### **Combat Patrol Drones & Sentinels** (`enemy_patrol_drones`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueDrones()`
- **Current Render Method**: Procedural Floating Oval (roundRect chassis, scanner eye circle, stabilizer wing rects, thruster flare)
- **Asset Type Required**: `8-Directional Flying Drone Spritesheet (48x48px, 4-frame hover loop + alert pulse, PNG)`
- **Specifications**: Patrol Sentinel (Green eye), High-speed Interceptor (Amber), Heavy Enforcer (Red armor)
- **Visual Impact**: **9 / 10** | **Production Effort**: 14 hrs | **Implementation Effort**: 4 hrs | **Total**: 18 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.50**

### BOSSES

#### **Overmind Central Core Boss Entity** (`boss_overmind_core`)
- **File**: `src/engine/renderer.ts & src/engine/gameLoop.ts`
- **Function**: `queueDrones() / sector_20 logic`
- **Current Render Method**: Procedural Scaled Turret / Drone Geometry with High-Intensity Screen Shakes & Particle Bursts
- **Asset Type Required**: `Multi-Part Large Isometric Boss Sprite (128x128px Central Core + 4 Floating Shield Pods, PNG)`
- **Specifications**: Bio-mechanical neural core, pulsing energy heart, rotating deflector shields, damage states
- **Visual Impact**: **9.5 / 10** | **Production Effort**: 18 hrs | **Implementation Effort**: 5 hrs | **Total**: 23 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.41**

### TILES

#### **Hazard Warning Borders & Pits** (`tile_hazard_edges`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueMapTiles()`
- **Current Render Method**: Procedural yellow/black stripe accents & corner bolt fills (ctx.fillRect 2x2)
- **Asset Type Required**: `Decal Overlay / Edge Transition Tileset (64x32px PNG with transparent cutouts)`
- **Specifications**: Hazard warning stripes, floor expansion grates, sub-atmospheric pit rims
- **Visual Impact**: **7.5 / 10** | **Production Effort**: 6 hrs | **Implementation Effort**: 2.5 hrs | **Total**: 8.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.88**

#### **Sector Floor Deck Tiles (5 Biomes)** (`tile_floor_base`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueMapTiles()`
- **Current Render Method**: Canvas 2D Path (ctx.moveTo, lineTo diamond polygon, linearGradient fills, micro-circuit strokes)
- **Asset Type Required**: `Isometric Tile Spritesheet (64x32px base diamond, PNG with alpha + normal map)`
- **Specifications**: 5 biomes x 4 variations (Clean Cryo-deck, Diamond Tread, Inductive Bus, Obsidian Chitin, Nexus Terrazzo)
- **Visual Impact**: **9.5 / 10** | **Production Effort**: 12 hrs | **Implementation Effort**: 4 hrs | **Total**: 16 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.59**

### WALLS

#### **Wall Conduit Cables & Access Panels** (`wall_trim_decals`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueMapTiles()`
- **Current Render Method**: Procedural vertical rib strokes (ctx.lineWidth = 1.2) & pulsing LED circles (ctx.arc)
- **Asset Type Required**: `Wall Prop / Decal Sheet (32x64px decals, PNG)`
- **Specifications**: Cable bundles, warning stencils, junction breaker boxes, ventilation louvers
- **Visual Impact**: **6.5 / 10** | **Production Effort**: 5 hrs | **Implementation Effort**: 2 hrs | **Total**: 7 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.93**

#### **Modular Bulkhead Walls & Columns** (`wall_bulkhead_columns`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueMapTiles()`
- **Current Render Method**: Procedural 2.5D Prisms (Left face shadow, Right face specular sheen, Top beveled cap, LED diode)
- **Asset Type Required**: `Modular Isometric Wall Tileset (64x64px, 64x96px & 64x128px multi-height pillars, PNG)`
- **Specifications**: Riveted hulls, conduit racks, magnetic containment coils, dielectric plates, observation glass
- **Visual Impact**: **9 / 10** | **Production Effort**: 16 hrs | **Implementation Effort**: 5 hrs | **Total**: 21 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.43**

### DOORS

#### **Automated Hydraulic Bulkhead Doors** (`door_hydraulic_bulkheads`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueDoorsAndLasers()`
- **Current Render Method**: Procedural Rect Archway + Sliding Armored Panel + Color-coded Clearance Plaque
- **Asset Type Required**: `Animated Isometric Doorway Spritesheet (64x80px, 8-frame slide/open animation, PNG)`
- **Specifications**: Door frame, sliding blast shields, holographic forcefield barrier for open state
- **Visual Impact**: **8 / 10** | **Production Effort**: 8 hrs | **Implementation Effort**: 3 hrs | **Total**: 11 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.73**

### CRATES

#### **Tactical Cargo Crates & Heavy Boxes** (`crate_tactical_containers`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueCrates()`
- **Current Render Method**: Procedural 2.5D Isometric Cube (blue gradients, strokeRect bumpers, text stencil "CRG-02")
- **Asset Type Required**: `Isometric Textured Crate Sprites (48x48px, 64x64px, PNG with normal & emissive maps)`
- **Specifications**: Standard Cargo (Blue), Heavy Reinforced (Orange/Iron), Cryo Container, Explosive Volatile
- **Visual Impact**: **8.5 / 10** | **Production Effort**: 8 hrs | **Implementation Effort**: 2.5 hrs | **Total**: 10.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.81**

### SWITCHES

#### **Titanium Hydraulic Pressure Plates** (`switch_pressure_plates`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueFloorObjects()`
- **Current Render Method**: Procedural Concentric Ellipses (Outer ring, inner compression pad, glowing LED status dot)
- **Asset Type Required**: `2-Frame State Isometric Sprite (48x28px, Idle & Depressed, PNG with glow mask)`
- **Specifications**: Standard light plate (Cyan/Green), Heavy dual-weight plate (Amber/Gold)
- **Visual Impact**: **6.5 / 10** | **Production Effort**: 3.5 hrs | **Implementation Effort**: 1.5 hrs | **Total**: 5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.30**

#### **Quantum Teleporter Pads** (`switch_teleporters`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueFloorObjects()`
- **Current Render Method**: Procedural Concentric Rings + Swirling Ellipse Core + Vertical Energy Column Line
- **Asset Type Required**: `Animated Platform Ring + Swirling Portal Core Sprite (64x36px loop, 8 frames, PNG)`
- **Specifications**: Base metal casing, rotating quantum plasma emitter, vertical particle column
- **Visual Impact**: **7.5 / 10** | **Production Effort**: 5 hrs | **Implementation Effort**: 2 hrs | **Total**: 7 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.07**

### TERMINALS

#### **Interactive Holographic Data Terminals** (`terminal_data_consoles`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueFloorObjects()`
- **Current Render Method**: Procedural Stand Rect + roundRect Hologram Panel + Scanline Loops + Monospace Text
- **Asset Type Required**: `Animated Console Prop Sprite + Floating Holographic Screen (32x48px, PNG)`
- **Specifications**: Pedestal base, flickering cyan/green holographic OS display with animated scanlines
- **Visual Impact**: **7.5 / 10** | **Production Effort**: 4.5 hrs | **Implementation Effort**: 2 hrs | **Total**: 6.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.15**

### COLLECTIBLES

#### **Plasma Energy Cells & Nano-Medkits** (`collectible_cells_medkits`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueItems()`
- **Current Render Method**: Procedural Glowing Circles with Radial Blurs (ctx.arc, shadowBlur 10)
- **Asset Type Required**: `Rendered Canister & Cross Capsule Sprites (20x20px, 4-frame bob, PNG)`
- **Specifications**: Green glowing energy canister, white/cyan medical nanite injector
- **Visual Impact**: **6 / 10** | **Production Effort**: 2.5 hrs | **Implementation Effort**: 1 hrs | **Total**: 3.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.71**

#### **Nexus Quantum Crystalline Fragments** (`collectible_nexus_fragments`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueItems()`
- **Current Render Method**: Procedural Octahedron Diamond Path with Facet Lines and Pulsing Amber Glow
- **Asset Type Required**: `Animated Octahedral Crystal Sprite (32x32px, 12-frame rotating gem loop, PNG + emissive)`
- **Specifications**: Glowing golden crystal artifact with refractive facets and orbiting quantum specks
- **Visual Impact**: **8 / 10** | **Production Effort**: 4 hrs | **Implementation Effort**: 1.5 hrs | **Total**: 5.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.45**

#### **Security Clearance Keycards (Blue, Red, Green)** (`collectible_keycards`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueItems()`
- **Current Render Method**: Procedural roundRect badge with shadowBlur glow, Greek font glyph (α, R, G), sine bob
- **Asset Type Required**: `Animated Floating Isometric Keycard Sprites (24x24px, 8-frame spin/shimmer loop, PNG)`
- **Specifications**: Alpha Blue, Red Eng-Core, Green Bastion, Purple Relic Cards
- **Visual Impact**: **6.5 / 10** | **Production Effort**: 3 hrs | **Implementation Effort**: 1.5 hrs | **Total**: 4.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.44**

### VFX

#### **High-Energy Laser Hazard Beams** (`vfx_laser_hazards`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueDoorsAndLasers()`
- **Current Render Method**: Procedural Multi-Pass Lines (Outer hazard glow, red core, white-hot center line, floor pool line)
- **Asset Type Required**: `Laser Beam Texture Strip + Animated Beam Core (32x8px repeating tile + impact sparks, PNG)`
- **Specifications**: Turbulent energy beam texture, emitter lens flare sprite, floor contact burn decal
- **Visual Impact**: **8 / 10** | **Production Effort**: 3.5 hrs | **Implementation Effort**: 2 hrs | **Total**: 5.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.45**

#### **Holographic Vision Cones & Radar Sweeps** (`vfx_vision_cones`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueVisionCones()`
- **Current Render Method**: Procedural Polygon Fan (16 arc points, transparent colored fill, dynamic radar sweep line)
- **Asset Type Required**: `Dynamic Shader / Texture Projection Strip (128x128px scanline grid texture, PNG)`
- **Specifications**: Soft edge falloff mask, animated radar sweep line texture, floor decal projection
- **Visual Impact**: **8.5 / 10** | **Production Effort**: 4 hrs | **Implementation Effort**: 2.5 hrs | **Total**: 6.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.31**

#### **Combat Projectiles, Sparks & Impacts** (`vfx_particles_projectiles`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueProjectiles() & drawParticles()`
- **Current Render Method**: Procedural Circles, Motion Streak Lines & Particle Arrays (ctx.arc, linear trail strokes)
- **Asset Type Required**: `Particle Atlas / FX Spritesheet (128x128px atlas with sparks, smoke, plasma bolts, flares)`
- **Specifications**: Energy bolt bullet sprite with glow, 4-frame impact puff, metal spark flakes
- **Visual Impact**: **8 / 10** | **Production Effort**: 5 hrs | **Implementation Effort**: 2.5 hrs | **Total**: 7.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.07**

#### **Quantum Reunification Stargate & Vortex** (`vfx_exit_portal`)
- **File**: `src/engine/renderer.ts`
- **Function**: `queueExitPortal()`
- **Current Render Method**: Procedural Heavy Ring Ellipse + createRadialGradient Vortex + Rotating StrokeRect Chevrons
- **Asset Type Required**: `Stargate Frame Sprite + Swirling Vortex Particle Texture (96x128px, PNG)`
- **Specifications**: Heavy ring armature, swirling event horizon swirl, rotating chevron glyphs
- **Visual Impact**: **8.5 / 10** | **Production Effort**: 6 hrs | **Implementation Effort**: 2.5 hrs | **Total**: 8.5 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.00**

#### **Deep Space Parallax Nebula & Starfield** (`vfx_cinematic_backdrop`)
- **File**: `src/engine/renderer.ts`
- **Function**: `drawCinematicBackdrop()`
- **Current Render Method**: Procedural Radial Gradient + 60 Loop-Rendered Star Rects with Parallax Math
- **Asset Type Required**: `Layered Parallax Matte Painting (1920x1080px space vista, distant planet, nebula layers, PNG)`
- **Specifications**: Sector-tinted cosmic dust nebula, distant orbital planetoid, layered parallax star clusters
- **Visual Impact**: **8.5 / 10** | **Production Effort**: 7 hrs | **Implementation Effort**: 2 hrs | **Total**: 9 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **0.94**

### UI

#### **Tactical Radar Minimap & Node Grid** (`ui_radar_minimap`)
- **File**: `src/components/Minimap.tsx`
- **Function**: `Minimap component`
- **Current Render Method**: HTML/CSS Grid of Room Boxes with Border Highlights & Blinking Status Divs
- **Asset Type Required**: `Stylized Radar Hologram Vector Frame + Custom Icon Pins (SVG/PNG)`
- **Specifications**: Cathode-ray green/cyan scan line texture overlay, tactile room node buttons, compass bezel
- **Visual Impact**: **7 / 10** | **Production Effort**: 4 hrs | **Implementation Effort**: 2 hrs | **Total**: 6 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.17**

#### **Tactical Cyberpunk HUD Gauges & Frames** (`ui_hud_bars_meters`)
- **File**: `src/components/GameHUD.tsx`
- **Function**: `GameHUD component`
- **Current Render Method**: Tailwind CSS div hierarchy with backdrop-blur, border lines, text labels and Lucide SVG icons
- **Asset Type Required**: `9-Slice UI Frame Panels & Gauge Textures (SVG/PNG vector atlas)`
- **Specifications**: Beveled metal header bar, status bracket corners, custom segment health/energy meters
- **Visual Impact**: **7.5 / 10** | **Production Effort**: 5 hrs | **Implementation Effort**: 2 hrs | **Total**: 7 hrs
- **ROI Ratio (Visual Improvement / Hour)**: **1.07**


---

## 4. Phased Production Implementation Roadmap

To maximize developer velocity and achieve visual transformation with minimal downtime, asset replacement must follow four distinct delivery phases:

```
[ PHASE 1: Quick Wins & High ROI (ROI > 1.20) ] ➔ Keycards, Plasma Cells, Pressure Plates, Minimap, Teleporters
[ PHASE 2: High Leverage Atmosphere (ROI 0.90 - 1.20) ] ➔ Starfield Matte, Vision Cones, Terminals, Lasers, Hazard Trims
[ PHASE 3: Core World Foundations (ROI 0.60 - 0.90) ] ➔ Sector Floor Deck Tiles, Tactical Crates, Bulkhead Doors, Turrets, Exit Portal
[ PHASE 4: Hero Characters & Complex Bosses (ROI < 0.60) ] ➔ 8-Direction Cyber Operative, Modular Walls, Patrol Drones, Overmind Boss
```

### Phase 1: High-Leverage Quick Wins (14.5 Total Hours — Average ROI: 1.48)
*Goal: Rapidly eliminate the most obvious procedural geometric artifacts with minimal art generation time.*
1. **Security Clearance Keycards** (`collectible_keycards`): Replace procedural rounded rectangles with glowing isometric keycard badges (3h art, 1.5h code).
2. **Plasma Energy Cells & Medkits** (`collectible_cells_medkits`): Replace green circles with sci-fi energy canisters and nanite injectors (2.5h art, 1h code).
3. **Titanium Pressure Plates** (`switch_pressure_plates`): Replace concentric ellipses with 2-frame depressed hydraulic pads (3.5h art, 1.5h code).
4. **Nexus Quantum Fragments** (`collectible_nexus_fragments`): Replace canvas octahedrons with pre-rendered rotating gold crystals (4h art, 1.5h code).
5. **Tactical Minimap Frame** (`ui_radar_minimap`): Overlay cathode CRT scanlines and tactical bezel (4h art, 2h code).

### Phase 2: Atmospheric & Lighting Enhancements (31.5 Total Hours — Average ROI: 1.08)
*Goal: Establish cinematic sci-fi atmosphere and clear telegraphing for hazards.*
1. **Deep Space Parallax Vista** (`vfx_cinematic_backdrop`): Replace 60 canvas star rects with a layered matte painting of the orbital abyss (7h art, 2h code).
2. **Holographic Vision Cones** (`vfx_vision_cones`): Replace flat polygon fans with soft-edge projected textures and scanline sweepers (4h art, 2.5h code).
3. **High-Energy Laser Hazards** (`vfx_laser_hazards`): Replace multi-stroke lines with electric plasma beam textures and impact scorch decals (3.5h art, 2h code).
4. **Interactive Data Terminals** (`terminal_data_consoles`): Replace vector rectangles with animated cyberpunk terminal pods (4.5h art, 2h code).
5. **Quantum Teleporters** (`switch_teleporters`): Replace flat spinning ellipses with animated swirling vortex rings (5h art, 2h code).
6. **Floor Hazard Trims** (`tile_hazard_edges`): Add industrial grating and hazard borders to tile edges (6h art, 2.5h code).

### Phase 3: Core World Entities (48.0 Total Hours — Average ROI: 0.74)
*Goal: Replace primary interactables and architectural surfaces.*
1. **Sector Floor Deck Tilesets** (`tile_floor_base`): Replace canvas diamond math with 5 biome tilesets (12h art, 4h code).
2. **Tactical Cargo Crates** (`crate_tactical_containers`): Replace procedural blue boxes with detailed sci-fi containers (8h art, 2.5h code).
3. **Automated Bulkhead Doors** (`door_hydraulic_bulkheads`): Replace vector frames with sliding armored airlock doors (8h art, 3h code).
4. **Heavy Automated Turrets** (`enemy_turrets_bolted`): Replace composite circles with rotating turret pods (8h art, 3h code).
5. **Quantum Stargate Exit Portal** (`vfx_exit_portal`): Replace canvas arcs with an imposing alien ring portal (6h art, 2.5h code).
6. **Combat FX & Projectile Atlas** (`vfx_particles_projectiles`): Replace dot particles with an atlas of sparks, smoke, and plasma bolts (5h art, 2.5h code).

### Phase 4: Master Character & Boss Architecture (82.0 Total Hours — Average ROI: 0.45)
*Goal: Hero character animation, complex structural walls, and multi-stage boss combat.*
1. **Cyber Operative Character** (`player_operative_suit`): Full 8-direction animated spritesheet with walk, carry, jump, and hurt cycles (24h art, 6h code).
2. **Modular Bulkhead Walls** (`wall_bulkhead_columns`): Multi-height vertical isometric column and wall trims (16h art, 5h code).
3. **Patrol Drones & Sentinels** (`enemy_patrol_drones`): 8-direction hover animations and alert states (14h art, 4h code).
4. **Overmind Central Core Boss** (`boss_overmind_core`): Multi-part animated central core with orbiting shield satellites (18h art, 5h code).

---

## 5. Technical Implementation Details: Canvas 2D Texture Pipeline

To replace procedural draw calls without destabilizing the current Painter's sort or isometric coordinate pipeline:

1. **Sprite Preloading & Cache Manager**:
   Create an `AssetManager` in `src/engine/assets.ts` that loads texture atlases once at startup, caching `HTMLImageElement` instances.
2. **Drop-in Painter's Queue Replacement**:
   Replace:
   ```typescript
   // Legacy Procedural Crate Draw
   ctx.beginPath();
   ctx.moveTo(screen.x - halfW, screen.y);
   ...
   ctx.fill();
   ```
   With:
   ```typescript
   // Bespoke Cached Blit
   const sprite = AssetManager.getSprite('crate_standard_blue');
   ctx.drawImage(sprite.image, sprite.sx, sprite.sy, sprite.sw, sprite.sh, screen.x - sprite.anchorX, screen.y - sprite.anchorY, sprite.w, sprite.h);
   ```
3. **Coordinate Parity**:
   Keep `worldToScreen(x, y, z)` identical so depth sorting, collision boundaries, and elevation stacking remain mathematically synchronized.
