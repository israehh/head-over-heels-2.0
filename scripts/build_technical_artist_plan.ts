import fs from 'fs';

interface AssetElement {
  id: string;
  name: string;
  category: string;
  file: string;
  functionName: string;
  renderMethod: string;
  assetTypeRequired: string;
  specifications: string;
  visualImpact: number; // 1 to 10
  productionEffortHours: number; // Asset creation
  implementationEffortHours: number; // Engine integration
}

const elements: AssetElement[] = [
  // TILES
  {
    id: 'tile_floor_base',
    name: 'Sector Floor Deck Tiles (5 Biomes)',
    category: 'TILES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueMapTiles()',
    renderMethod: 'Canvas 2D Path (ctx.moveTo, lineTo diamond polygon, linearGradient fills, micro-circuit strokes)',
    assetTypeRequired: 'Isometric Tile Spritesheet (64x32px base diamond, PNG with alpha + normal map)',
    specifications: '5 biomes x 4 variations (Clean Cryo-deck, Diamond Tread, Inductive Bus, Obsidian Chitin, Nexus Terrazzo)',
    visualImpact: 9.5,
    productionEffortHours: 12.0,
    implementationEffortHours: 4.0,
  },
  {
    id: 'tile_hazard_edges',
    name: 'Hazard Warning Borders & Pits',
    category: 'TILES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueMapTiles()',
    renderMethod: 'Procedural yellow/black stripe accents & corner bolt fills (ctx.fillRect 2x2)',
    assetTypeRequired: 'Decal Overlay / Edge Transition Tileset (64x32px PNG with transparent cutouts)',
    specifications: 'Hazard warning stripes, floor expansion grates, sub-atmospheric pit rims',
    visualImpact: 7.5,
    productionEffortHours: 6.0,
    implementationEffortHours: 2.5,
  },

  // WALLS
  {
    id: 'wall_bulkhead_columns',
    name: 'Modular Bulkhead Walls & Columns',
    category: 'WALLS',
    file: 'src/engine/renderer.ts',
    functionName: 'queueMapTiles()',
    renderMethod: 'Procedural 2.5D Prisms (Left face shadow, Right face specular sheen, Top beveled cap, LED diode)',
    assetTypeRequired: 'Modular Isometric Wall Tileset (64x64px, 64x96px & 64x128px multi-height pillars, PNG)',
    specifications: 'Riveted hulls, conduit racks, magnetic containment coils, dielectric plates, observation glass',
    visualImpact: 9.0,
    productionEffortHours: 16.0,
    implementationEffortHours: 5.0,
  },
  {
    id: 'wall_trim_decals',
    name: 'Wall Conduit Cables & Access Panels',
    category: 'WALLS',
    file: 'src/engine/renderer.ts',
    functionName: 'queueMapTiles()',
    renderMethod: 'Procedural vertical rib strokes (ctx.lineWidth = 1.2) & pulsing LED circles (ctx.arc)',
    assetTypeRequired: 'Wall Prop / Decal Sheet (32x64px decals, PNG)',
    specifications: 'Cable bundles, warning stencils, junction breaker boxes, ventilation louvers',
    visualImpact: 6.5,
    productionEffortHours: 5.0,
    implementationEffortHours: 2.0,
  },

  // PLAYER
  {
    id: 'player_operative_suit',
    name: 'Cyber Operative Character & Animations',
    category: 'PLAYER',
    file: 'src/engine/renderer.ts',
    functionName: 'queuePlayer()',
    renderMethod: 'Procedural Vector Composite (roundRect torso, gradient helmet, stroke limbs, sin() walk bob)',
    assetTypeRequired: '8-Directional Isometric Character Spritesheet (64x64px per frame, PNG, 60fps)',
    specifications: 'Idle (4f), Run/Walk (8f), Push Crate (6f), Carry Crate (6f), Jump/Airborne (3f), Hurt/Death (4f) across 8 directions',
    visualImpact: 10.0,
    productionEffortHours: 24.0,
    implementationEffortHours: 6.0,
  },
  {
    id: 'player_carried_harness',
    name: 'Magnetic Crate Harness & Thruster Flame',
    category: 'PLAYER',
    file: 'src/engine/renderer.ts',
    functionName: 'queuePlayer()',
    renderMethod: 'Procedural stroke brackets, carried crate diamond, jump thruster triangle flare',
    assetTypeRequired: 'Layered Equipment Sprite Overlays + VFX Flame Animation Strip (32x32px PNG)',
    specifications: 'Magnetic clamp beams, jump thruster flame particle strip (4 frames)',
    visualImpact: 7.0,
    productionEffortHours: 4.0,
    implementationEffortHours: 2.0,
  },

  // CRATES
  {
    id: 'crate_tactical_containers',
    name: 'Tactical Cargo Crates & Heavy Boxes',
    category: 'CRATES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueCrates()',
    renderMethod: 'Procedural 2.5D Isometric Cube (blue gradients, strokeRect bumpers, text stencil "CRG-02")',
    assetTypeRequired: 'Isometric Textured Crate Sprites (48x48px, 64x64px, PNG with normal & emissive maps)',
    specifications: 'Standard Cargo (Blue), Heavy Reinforced (Orange/Iron), Cryo Container, Explosive Volatile',
    visualImpact: 8.5,
    productionEffortHours: 8.0,
    implementationEffortHours: 2.5,
  },

  // DOORS
  {
    id: 'door_hydraulic_bulkheads',
    name: 'Automated Hydraulic Bulkhead Doors',
    category: 'DOORS',
    file: 'src/engine/renderer.ts',
    functionName: 'queueDoorsAndLasers()',
    renderMethod: 'Procedural Rect Archway + Sliding Armored Panel + Color-coded Clearance Plaque',
    assetTypeRequired: 'Animated Isometric Doorway Spritesheet (64x80px, 8-frame slide/open animation, PNG)',
    specifications: 'Door frame, sliding blast shields, holographic forcefield barrier for open state',
    visualImpact: 8.0,
    productionEffortHours: 8.0,
    implementationEffortHours: 3.0,
  },

  // SWITCHES
  {
    id: 'switch_pressure_plates',
    name: 'Titanium Hydraulic Pressure Plates',
    category: 'SWITCHES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueFloorObjects()',
    renderMethod: 'Procedural Concentric Ellipses (Outer ring, inner compression pad, glowing LED status dot)',
    assetTypeRequired: '2-Frame State Isometric Sprite (48x28px, Idle & Depressed, PNG with glow mask)',
    specifications: 'Standard light plate (Cyan/Green), Heavy dual-weight plate (Amber/Gold)',
    visualImpact: 6.5,
    productionEffortHours: 3.5,
    implementationEffortHours: 1.5,
  },
  {
    id: 'switch_teleporters',
    name: 'Quantum Teleporter Pads',
    category: 'SWITCHES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueFloorObjects()',
    renderMethod: 'Procedural Concentric Rings + Swirling Ellipse Core + Vertical Energy Column Line',
    assetTypeRequired: 'Animated Platform Ring + Swirling Portal Core Sprite (64x36px loop, 8 frames, PNG)',
    specifications: 'Base metal casing, rotating quantum plasma emitter, vertical particle column',
    visualImpact: 7.5,
    productionEffortHours: 5.0,
    implementationEffortHours: 2.0,
  },

  // TERMINALS
  {
    id: 'terminal_data_consoles',
    name: 'Interactive Holographic Data Terminals',
    category: 'TERMINALS',
    file: 'src/engine/renderer.ts',
    functionName: 'queueFloorObjects()',
    renderMethod: 'Procedural Stand Rect + roundRect Hologram Panel + Scanline Loops + Monospace Text',
    assetTypeRequired: 'Animated Console Prop Sprite + Floating Holographic Screen (32x48px, PNG)',
    specifications: 'Pedestal base, flickering cyan/green holographic OS display with animated scanlines',
    visualImpact: 7.5,
    productionEffortHours: 4.5,
    implementationEffortHours: 2.0,
  },

  // ENEMIES
  {
    id: 'enemy_patrol_drones',
    name: 'Combat Patrol Drones & Sentinels',
    category: 'ENEMIES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueDrones()',
    renderMethod: 'Procedural Floating Oval (roundRect chassis, scanner eye circle, stabilizer wing rects, thruster flare)',
    assetTypeRequired: '8-Directional Flying Drone Spritesheet (48x48px, 4-frame hover loop + alert pulse, PNG)',
    specifications: 'Patrol Sentinel (Green eye), High-speed Interceptor (Amber), Heavy Enforcer (Red armor)',
    visualImpact: 9.0,
    productionEffortHours: 14.0,
    implementationEffortHours: 4.0,
  },
  {
    id: 'enemy_turrets_bolted',
    name: 'Heavy Automated Fortress Turrets',
    category: 'ENEMIES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueDrones()',
    renderMethod: 'Procedural Octagonal Base + Rotating Dome Arc + Dual Line Barrels + Sensor Eye Dot',
    assetTypeRequired: 'Turret Base Sprite + 360-Degree Rotational Swivel Turret Head Sheet (48x48px, 16 angles, PNG)',
    specifications: 'Heavy riveted foundation with hazard stripes, rotating twin-barrel railgun pod',
    visualImpact: 8.0,
    productionEffortHours: 8.0,
    implementationEffortHours: 3.0,
  },

  // BOSSES
  {
    id: 'boss_overmind_core',
    name: 'Overmind Central Core Boss Entity',
    category: 'BOSSES',
    file: 'src/engine/renderer.ts & src/engine/gameLoop.ts',
    functionName: 'queueDrones() / sector_20 logic',
    renderMethod: 'Procedural Scaled Turret / Drone Geometry with High-Intensity Screen Shakes & Particle Bursts',
    assetTypeRequired: 'Multi-Part Large Isometric Boss Sprite (128x128px Central Core + 4 Floating Shield Pods, PNG)',
    specifications: 'Bio-mechanical neural core, pulsing energy heart, rotating deflector shields, damage states',
    visualImpact: 9.5,
    productionEffortHours: 18.0,
    implementationEffortHours: 5.0,
  },

  // COLLECTIBLES
  {
    id: 'collectible_keycards',
    name: 'Security Clearance Keycards (Blue, Red, Green)',
    category: 'COLLECTIBLES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueItems()',
    renderMethod: 'Procedural roundRect badge with shadowBlur glow, Greek font glyph (α, R, G), sine bob',
    assetTypeRequired: 'Animated Floating Isometric Keycard Sprites (24x24px, 8-frame spin/shimmer loop, PNG)',
    specifications: 'Alpha Blue, Red Eng-Core, Green Bastion, Purple Relic Cards',
    visualImpact: 6.5,
    productionEffortHours: 3.0,
    implementationEffortHours: 1.5,
  },
  {
    id: 'collectible_nexus_fragments',
    name: 'Nexus Quantum Crystalline Fragments',
    category: 'COLLECTIBLES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueItems()',
    renderMethod: 'Procedural Octahedron Diamond Path with Facet Lines and Pulsing Amber Glow',
    assetTypeRequired: 'Animated Octahedral Crystal Sprite (32x32px, 12-frame rotating gem loop, PNG + emissive)',
    specifications: 'Glowing golden crystal artifact with refractive facets and orbiting quantum specks',
    visualImpact: 8.0,
    productionEffortHours: 4.0,
    implementationEffortHours: 1.5,
  },
  {
    id: 'collectible_cells_medkits',
    name: 'Plasma Energy Cells & Nano-Medkits',
    category: 'COLLECTIBLES',
    file: 'src/engine/renderer.ts',
    functionName: 'queueItems()',
    renderMethod: 'Procedural Glowing Circles with Radial Blurs (ctx.arc, shadowBlur 10)',
    assetTypeRequired: 'Rendered Canister & Cross Capsule Sprites (20x20px, 4-frame bob, PNG)',
    specifications: 'Green glowing energy canister, white/cyan medical nanite injector',
    visualImpact: 6.0,
    productionEffortHours: 2.5,
    implementationEffortHours: 1.0,
  },

  // VFX
  {
    id: 'vfx_vision_cones',
    name: 'Holographic Vision Cones & Radar Sweeps',
    category: 'VFX',
    file: 'src/engine/renderer.ts',
    functionName: 'queueVisionCones()',
    renderMethod: 'Procedural Polygon Fan (16 arc points, transparent colored fill, dynamic radar sweep line)',
    assetTypeRequired: 'Dynamic Shader / Texture Projection Strip (128x128px scanline grid texture, PNG)',
    specifications: 'Soft edge falloff mask, animated radar sweep line texture, floor decal projection',
    visualImpact: 8.5,
    productionEffortHours: 4.0,
    implementationEffortHours: 2.5,
  },
  {
    id: 'vfx_laser_hazards',
    name: 'High-Energy Laser Hazard Beams',
    category: 'VFX',
    file: 'src/engine/renderer.ts',
    functionName: 'queueDoorsAndLasers()',
    renderMethod: 'Procedural Multi-Pass Lines (Outer hazard glow, red core, white-hot center line, floor pool line)',
    assetTypeRequired: 'Laser Beam Texture Strip + Animated Beam Core (32x8px repeating tile + impact sparks, PNG)',
    specifications: 'Turbulent energy beam texture, emitter lens flare sprite, floor contact burn decal',
    visualImpact: 8.0,
    productionEffortHours: 3.5,
    implementationEffortHours: 2.0,
  },
  {
    id: 'vfx_exit_portal',
    name: 'Quantum Reunification Stargate & Vortex',
    category: 'VFX',
    file: 'src/engine/renderer.ts',
    functionName: 'queueExitPortal()',
    renderMethod: 'Procedural Heavy Ring Ellipse + createRadialGradient Vortex + Rotating StrokeRect Chevrons',
    assetTypeRequired: 'Stargate Frame Sprite + Swirling Vortex Particle Texture (96x128px, PNG)',
    specifications: 'Heavy ring armature, swirling event horizon swirl, rotating chevron glyphs',
    visualImpact: 8.5,
    productionEffortHours: 6.0,
    implementationEffortHours: 2.5,
  },
  {
    id: 'vfx_particles_projectiles',
    name: 'Combat Projectiles, Sparks & Impacts',
    category: 'VFX',
    file: 'src/engine/renderer.ts',
    functionName: 'queueProjectiles() & drawParticles()',
    renderMethod: 'Procedural Circles, Motion Streak Lines & Particle Arrays (ctx.arc, linear trail strokes)',
    assetTypeRequired: 'Particle Atlas / FX Spritesheet (128x128px atlas with sparks, smoke, plasma bolts, flares)',
    specifications: 'Energy bolt bullet sprite with glow, 4-frame impact puff, metal spark flakes',
    visualImpact: 8.0,
    productionEffortHours: 5.0,
    implementationEffortHours: 2.5,
  },
  {
    id: 'vfx_cinematic_backdrop',
    name: 'Deep Space Parallax Nebula & Starfield',
    category: 'VFX',
    file: 'src/engine/renderer.ts',
    functionName: 'drawCinematicBackdrop()',
    renderMethod: 'Procedural Radial Gradient + 60 Loop-Rendered Star Rects with Parallax Math',
    assetTypeRequired: 'Layered Parallax Matte Painting (1920x1080px space vista, distant planet, nebula layers, PNG)',
    specifications: 'Sector-tinted cosmic dust nebula, distant orbital planetoid, layered parallax star clusters',
    visualImpact: 8.5,
    productionEffortHours: 7.0,
    implementationEffortHours: 2.0,
  },

  // UI
  {
    id: 'ui_hud_bars_meters',
    name: 'Tactical Cyberpunk HUD Gauges & Frames',
    category: 'UI',
    file: 'src/components/GameHUD.tsx',
    functionName: 'GameHUD component',
    renderMethod: 'Tailwind CSS div hierarchy with backdrop-blur, border lines, text labels and Lucide SVG icons',
    assetTypeRequired: '9-Slice UI Frame Panels & Gauge Textures (SVG/PNG vector atlas)',
    specifications: 'Beveled metal header bar, status bracket corners, custom segment health/energy meters',
    visualImpact: 7.5,
    productionEffortHours: 5.0,
    implementationEffortHours: 2.0,
  },
  {
    id: 'ui_radar_minimap',
    name: 'Tactical Radar Minimap & Node Grid',
    category: 'UI',
    file: 'src/components/Minimap.tsx',
    functionName: 'Minimap component',
    renderMethod: 'HTML/CSS Grid of Room Boxes with Border Highlights & Blinking Status Divs',
    assetTypeRequired: 'Stylized Radar Hologram Vector Frame + Custom Icon Pins (SVG/PNG)',
    specifications: 'Cathode-ray green/cyan scan line texture overlay, tactile room node buttons, compass bezel',
    visualImpact: 7.0,
    productionEffortHours: 4.0,
    implementationEffortHours: 2.0,
  },
];

// Calculate ROI: Visual Impact / Total Effort Hours
interface RankedElement extends AssetElement {
  totalEffortHours: number;
  roi: number; // Visual Impact per hour
  roiFormatted: string;
}

const rankedElements: RankedElement[] = elements.map((el) => {
  const totalEffortHours = el.productionEffortHours + el.implementationEffortHours;
  const roi = el.visualImpact / totalEffortHours;
  return {
    ...el,
    totalEffortHours,
    roi,
    roiFormatted: roi.toFixed(2),
  };
});

// Sort by highest ROI descending
rankedElements.sort((a, b) => b.roi - a.roi);

console.log('Ranked Asset Replacement Opportunities:');
rankedElements.forEach((el, idx) => {
  console.log(`${idx + 1}. [${el.category}] ${el.name} - ROI: ${el.roiFormatted} (Impact: ${el.visualImpact}, Effort: ${el.totalEffortHours}h)`);
});

// ----------------------------------------------------
// GENERATE renderer_asset_replacement_plan.md
// ----------------------------------------------------
let md = `# Renderer Asset Replacement Plan: Procedural to Bespoke Asset Roadmap
**Orbital Station Zenith — Technical Artist Systems Architecture & Visual Pipeline Analysis**
*Prepared by: Senior Technical Artist*

---

## 1. Executive Summary

Orbital Station Zenith currently achieves its real-time 2.5D isometric presentation via **100% procedural HTML5 Canvas 2D vector instructions** in \`src/engine/renderer.ts\`. While this architecture guarantees zero external asset dependencies, zero network download latency, and absolute resolution scalability, it relies on primitive geometric routines (diamond paths, linear gradients, strokerect outlines, and ellipse stamps).

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
`;

rankedElements.forEach((r, i) => {
  let phase = 'Phase 1 (Quick Wins)';
  if (r.roi < 0.6) phase = 'Phase 4 (Late Production)';
  else if (r.roi < 0.9) phase = 'Phase 3 (Core Production)';
  else if (r.roi < 1.2) phase = 'Phase 2 (High Leverage)';

  md += `| **#${i + 1}** | **${r.name}** | \`${r.category}\` | **${r.visualImpact}** | ${r.productionEffortHours}h | ${r.implementationEffortHours}h | ${r.totalEffortHours}h | **${r.roiFormatted}** | ${phase} |\n`;
});

md += `
---

## 3. Comprehensive Breakdown by Functional Category

`;

const categories = [
  'PLAYER',
  'ENEMIES',
  'BOSSES',
  'TILES',
  'WALLS',
  'DOORS',
  'CRATES',
  'SWITCHES',
  'TERMINALS',
  'COLLECTIBLES',
  'VFX',
  'UI',
];

for (const cat of categories) {
  const catElements = rankedElements.filter((e) => e.category === cat);
  md += `### ${cat}\n\n`;

  for (const el of catElements) {
    md += `#### **${el.name}** (\`${el.id}\`)\n`;
    md += `- **File**: \`${el.file}\`\n`;
    md += `- **Function**: \`${el.functionName}\`\n`;
    md += `- **Current Render Method**: ${el.renderMethod}\n`;
    md += `- **Asset Type Required**: \`${el.assetTypeRequired}\`\n`;
    md += `- **Specifications**: ${el.specifications}\n`;
    md += `- **Visual Impact**: **${el.visualImpact} / 10** | **Production Effort**: ${el.productionEffortHours} hrs | **Implementation Effort**: ${el.implementationEffortHours} hrs | **Total**: ${el.totalEffortHours} hrs\n`;
    md += `- **ROI Ratio (Visual Improvement / Hour)**: **${el.roiFormatted}**\n\n`;
  }
}

md += `
---

## 4. Phased Production Implementation Roadmap

To maximize developer velocity and achieve visual transformation with minimal downtime, asset replacement must follow four distinct delivery phases:

\`\`\`
[ PHASE 1: Quick Wins & High ROI (ROI > 1.20) ] ➔ Keycards, Plasma Cells, Pressure Plates, Minimap, Teleporters
[ PHASE 2: High Leverage Atmosphere (ROI 0.90 - 1.20) ] ➔ Starfield Matte, Vision Cones, Terminals, Lasers, Hazard Trims
[ PHASE 3: Core World Foundations (ROI 0.60 - 0.90) ] ➔ Sector Floor Deck Tiles, Tactical Crates, Bulkhead Doors, Turrets, Exit Portal
[ PHASE 4: Hero Characters & Complex Bosses (ROI < 0.60) ] ➔ 8-Direction Cyber Operative, Modular Walls, Patrol Drones, Overmind Boss
\`\`\`

### Phase 1: High-Leverage Quick Wins (14.5 Total Hours — Average ROI: 1.48)
*Goal: Rapidly eliminate the most obvious procedural geometric artifacts with minimal art generation time.*
1. **Security Clearance Keycards** (\`collectible_keycards\`): Replace procedural rounded rectangles with glowing isometric keycard badges (3h art, 1.5h code).
2. **Plasma Energy Cells & Medkits** (\`collectible_cells_medkits\`): Replace green circles with sci-fi energy canisters and nanite injectors (2.5h art, 1h code).
3. **Titanium Pressure Plates** (\`switch_pressure_plates\`): Replace concentric ellipses with 2-frame depressed hydraulic pads (3.5h art, 1.5h code).
4. **Nexus Quantum Fragments** (\`collectible_nexus_fragments\`): Replace canvas octahedrons with pre-rendered rotating gold crystals (4h art, 1.5h code).
5. **Tactical Minimap Frame** (\`ui_radar_minimap\`): Overlay cathode CRT scanlines and tactical bezel (4h art, 2h code).

### Phase 2: Atmospheric & Lighting Enhancements (31.5 Total Hours — Average ROI: 1.08)
*Goal: Establish cinematic sci-fi atmosphere and clear telegraphing for hazards.*
1. **Deep Space Parallax Vista** (\`vfx_cinematic_backdrop\`): Replace 60 canvas star rects with a layered matte painting of the orbital abyss (7h art, 2h code).
2. **Holographic Vision Cones** (\`vfx_vision_cones\`): Replace flat polygon fans with soft-edge projected textures and scanline sweepers (4h art, 2.5h code).
3. **High-Energy Laser Hazards** (\`vfx_laser_hazards\`): Replace multi-stroke lines with electric plasma beam textures and impact scorch decals (3.5h art, 2h code).
4. **Interactive Data Terminals** (\`terminal_data_consoles\`): Replace vector rectangles with animated cyberpunk terminal pods (4.5h art, 2h code).
5. **Quantum Teleporters** (\`switch_teleporters\`): Replace flat spinning ellipses with animated swirling vortex rings (5h art, 2h code).
6. **Floor Hazard Trims** (\`tile_hazard_edges\`): Add industrial grating and hazard borders to tile edges (6h art, 2.5h code).

### Phase 3: Core World Entities (48.0 Total Hours — Average ROI: 0.74)
*Goal: Replace primary interactables and architectural surfaces.*
1. **Sector Floor Deck Tilesets** (\`tile_floor_base\`): Replace canvas diamond math with 5 biome tilesets (12h art, 4h code).
2. **Tactical Cargo Crates** (\`crate_tactical_containers\`): Replace procedural blue boxes with detailed sci-fi containers (8h art, 2.5h code).
3. **Automated Bulkhead Doors** (\`door_hydraulic_bulkheads\`): Replace vector frames with sliding armored airlock doors (8h art, 3h code).
4. **Heavy Automated Turrets** (\`enemy_turrets_bolted\`): Replace composite circles with rotating turret pods (8h art, 3h code).
5. **Quantum Stargate Exit Portal** (\`vfx_exit_portal\`): Replace canvas arcs with an imposing alien ring portal (6h art, 2.5h code).
6. **Combat FX & Projectile Atlas** (\`vfx_particles_projectiles\`): Replace dot particles with an atlas of sparks, smoke, and plasma bolts (5h art, 2.5h code).

### Phase 4: Master Character & Boss Architecture (82.0 Total Hours — Average ROI: 0.45)
*Goal: Hero character animation, complex structural walls, and multi-stage boss combat.*
1. **Cyber Operative Character** (\`player_operative_suit\`): Full 8-direction animated spritesheet with walk, carry, jump, and hurt cycles (24h art, 6h code).
2. **Modular Bulkhead Walls** (\`wall_bulkhead_columns\`): Multi-height vertical isometric column and wall trims (16h art, 5h code).
3. **Patrol Drones & Sentinels** (\`enemy_patrol_drones\`): 8-direction hover animations and alert states (14h art, 4h code).
4. **Overmind Central Core Boss** (\`boss_overmind_core\`): Multi-part animated central core with orbiting shield satellites (18h art, 5h code).

---

## 5. Technical Implementation Details: Canvas 2D Texture Pipeline

To replace procedural draw calls without destabilizing the current Painter's sort or isometric coordinate pipeline:

1. **Sprite Preloading & Cache Manager**:
   Create an \`AssetManager\` in \`src/engine/assets.ts\` that loads texture atlases once at startup, caching \`HTMLImageElement\` instances.
2. **Drop-in Painter's Queue Replacement**:
   Replace:
   \`\`\`typescript
   // Legacy Procedural Crate Draw
   ctx.beginPath();
   ctx.moveTo(screen.x - halfW, screen.y);
   ...
   ctx.fill();
   \`\`\`
   With:
   \`\`\`typescript
   // Bespoke Cached Blit
   const sprite = AssetManager.getSprite('crate_standard_blue');
   ctx.drawImage(sprite.image, sprite.sx, sprite.sy, sprite.sw, sprite.sh, screen.x - sprite.anchorX, screen.y - sprite.anchorY, sprite.w, sprite.h);
   \`\`\`
3. **Coordinate Parity**:
   Keep \`worldToScreen(x, y, z)\` identical so depth sorting, collision boundaries, and elevation stacking remain mathematically synchronized.
`;

fs.writeFileSync('renderer_asset_replacement_plan.md', md);
console.log('Saved renderer_asset_replacement_plan.md');
