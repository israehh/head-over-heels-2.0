# Level Design & Art Production Status Report
**Orbital Station Zenith — 53-Room Production Pipeline Audit**
*Prepared by: Senior Level Designer & Systems Architect*

---

## 1. Executive Summary

| Production Metric | Current Status | Notes |
| :--- | :---: | :--- |
| **Total Rooms in Active Scope** | **53** | 100% reachable and topologically verified |
| **Rooms Gameplay Complete** | **53 / 53 (100%)** | Full collision, movement, physics, triggers & state machines active |
| **Rooms Visually Incomplete** | **53 / 53 (100%)** | All environments currently use 2D canvas procedural placeholders |
| **Rooms Using Procedural Placeholders** | **53 / 53 (100%)** | Procedural vector prisms, diamonds, gradients, and canvas lines |
| **Rooms Requiring Custom Art Assets** | **53 / 53 (100%)** | Production requires isometric tilesets, sprite sheets, decals & VFX |
| **Average Production Completion** | **~84%** | Breakdown: Gameplay 100%, Puzzles 97%, Enemies 98%, Collectibles 96%, Visuals 35% |

### Key Takeaway for Production:
The underlying gameplay architecture, collision meshes, switch wiring, elevator systems, door bulkheads, laser grids, drone AI, and collectible systems are **100% implemented and fully playable from start to victory**. However, **visual production has not begun on bespoke raster or 3D art assets**; the renderer is executing in full procedural simulation mode.

---

## 2. Global Production Status Overview

```
[========================= 100% Gameplay Implementation ]
[========================= 100% Topological Reachability ]
[=======================--  97% Puzzle & Hazard Logic   ]
[=======================--  98% Enemy & Threat AI       ]
[=======================--  96% Collectibles & Items    ]
[========-----------------  35% Visuals (Procedural)    ]
---------------------------------------------------------
[====================-----  84% OVERALL PRODUCTION PROGRESS ]
```

---

## 3. Production Priority Staging

Rooms have been categorized into four production sprints to maximize gameplay polish and player-facing visual impact:

### Priority 1: Golden Path & Critical Milestones (12 Rooms)
*Target: First playable demo, tutorial onboarding, gatekeeper vaults, and station climax.*
- **Tutorial & First 15 Minutes**: `sector_01`, `sector_02`, `sector_03`, `sector_04`
- **Central Arterial Nexus**: `sector_00`
- **Keycard & Fragment Gatekeepers**: `sector_07` (Red Key), `sector_08` (Frag II & Lift), `sector_12` (Frag III), `sector_15` (Green Key), `sector_16` (Frag IV)
- **Station Climax & Boss Arena**: `sector_19` (Gate to Sanctum), `sector_20` (Overmind Core & Victory Exit Portal)

### Priority 2: Mainline Quadrant Spine & Major Wings (17 Rooms)
*Target: Complete the standard exploratory path through station infrastructure.*
- **Engineering & Logistics Spine**: `sector_05`, `sector_06`, `sector_09`, `sector_10`, `sector_11`, `sector_13`, `sector_14`, `sector_17`, `sector_18`
- **Wing B Cargo Facilities**: `sector_21`, `sector_22`, `sector_23`, `sector_24`
- **Wing C Reactor Core**: `sector_28`, `sector_29`, `sector_30`, `sector_31`

### Priority 3: Heavy Stacking Gauntlet & Transit Shortcuts (15 Rooms)
*Target: Secondary content, advanced spatial puzzles, and speedrunner shortcuts.*
- **Heavy Cargo Stacking Gauntlet**: `sector_35` through `sector_44` (10 sequential challenge rooms)
- **Express Bypasses & Shortcuts**: `sector_27`, `sector_34`, `sector_50`, `sector_51`, `sector_52`

### Priority 4: Secret Vaults & Optional Relic Caches (9 Rooms)
*Target: Environmental storytelling, hidden rooms, and 100% completionist rewards.*
- **Cul-de-sac Caches**: `sector_25`, `sector_26`, `sector_32`, `sector_33`, `sector_45`, `sector_46`, `sector_47`, `sector_48`, `sector_49`

---

## 4. Master Room Production Table (Sorted by Priority)

| Priority | Room ID | Room Name | Code | Sector / Biome | Gameplay | Visual | Puzzle | Enemy | Items | Overall | Status |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **P1** | `sector_00` | Orbital Transit Grand Nexus | `NEX-00` | Orbital Central Transit Nexus | 100% | 35% | 93% | 100% | 100% | **82%** | Procedural | 
| **P1** | `sector_01` | Cryo-Dock Awakening | `SEC-01` | Cryo-Docking & Awakening | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P1** | `sector_02` | Jump Calibration Bay | `SEC-02` | Cryo-Docking & Awakening | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P1** | `sector_03` | Crate Logistics Lab | `SEC-03` | Cryo-Docking & Awakening | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P1** | `sector_04` | Apex Vault I: Cryo Matrix | `SEC-04` | Cryo-Docking & Awakening | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P1** | `sector_07` | Laser Synchronization Maze | `SEC-07` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P1** | `sector_08` | Quantum Inversion Matrix | `SEC-08` | Engineering Core & Heavy Cargo | 100% | 35% | 93% | 100% | 100% | **82%** | Procedural | 
| **P1** | `sector_12` | High-Value Vault III: AI Sub-Brain | `SEC-12` | Logistics Grid & Fusion Confinement | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P1** | `sector_15` | Supercharger Sub-Station | `SEC-15` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P1** | `sector_16` | Reactor Core Apex | `SEC-16` | Power Substation & Heavy Stacking Yard | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P1** | `sector_19` | Master Access Antechamber | `SEC-19` | Citadel Bastion & Overmind Sanctum | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P1** | `sector_20` | Overmind Sanctum Core | `SEC-20` | Citadel Bastion & Overmind Sanctum | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_05` | Dual Relay Chamber | `SEC-05` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_06` | Stacking Stepper Pit | `SEC-06` | Engineering Core & Heavy Cargo | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_09` | Freight Receiving Dock | `SEC-09` | Logistics Grid & Fusion Confinement | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_10` | Deep Cryo Warehouse | `SEC-10` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_11` | Hazardous Waste Sump | `SEC-11` | Logistics Grid & Fusion Confinement | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_13` | Plasma Generator Hub | `SEC-13` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_14` | High Voltage Transformer | `SEC-14` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_17` | Drone Sentinel Perimeter | `SEC-17` | Citadel Bastion & Overmind Sanctum | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_18` | Interceptor Bastion | `SEC-18` | Citadel Bastion & Overmind Sanctum | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P2** | `sector_21` | Cargo Intake & Weigh Station | `CRG-21` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_22` | Hydraulic Lift Shaft | `CRG-22` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_23` | Sub-Zero Stacking Bay | `CRG-23` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_24` | Container Crane Gantry | `CRG-24` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_28` | Plasma Distribution Junction | `ENG-28` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_29` | High Voltage Stepping Conduits | `ENG-29` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P2** | `sector_30` | Laser Reflection Relay Chamber | `ENG-30` | Logistics Grid & Fusion Confinement | 100% | 35% | 93% | 100% | 100% | **82%** | Procedural | 
| **P2** | `sector_31` | Electromagnetic Elevator Core | `ENG-31` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_27` | Cargo Chute Bypass (SHORTCUT) | `SCT-B-CHUTE` | Engineering Core & Heavy Cargo | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_34` | High-Energy Service Conduit (SHORTCUT) | `SCT-C-VENT` | Logistics Grid & Fusion Confinement | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_35` | Cargo Stacking Testing Facility | `STK-01-TEST` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_36` | Dual-Mass Hydraulic Crucible | `STK-02-MASS` | Power Substation & Heavy Stacking Yard | 100% | 35% | 93% | 100% | 100% | **82%** | Procedural | 
| **P3** | `sector_37` | High-Bay Vertical Stepper | `STK-03-STEP` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_38` | Laser Interception Gantry | `STK-04-OPTI` | Power Substation & Heavy Stacking Yard | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_39` | Magnetic Freight Balancer | `STK-05-MAG` | Power Substation & Heavy Stacking Yard | 100% | 35% | 90% | 100% | 100% | **81%** | Procedural | 
| **P3** | `sector_40` | Cryo-Crate Logistics Sorter | `STK-06-CRYO` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_41` | Pneumatic Column Press | `STK-07-PRESS` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_42` | Overhead Concourse Mezzanine | `STK-08-CATW` | Power Substation & Heavy Stacking Yard | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_43` | Dual-Beam Deflection Vault | `STK-09-DEFL` | Power Substation & Heavy Stacking Yard | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P3** | `sector_44` | Apex Stacking Colosseum | `STK-10-COLOS` | Power Substation & Heavy Stacking Yard | 100% | 35% | 90% | 100% | 100% | **81%** | Procedural | 
| **P3** | `sector_50` | High-Catwalk Express (SHORTCUT) | `SCT-01-EXP` | Cryo-Docking & Awakening | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_51` | Ventilation Bypass (SHORTCUT) | `SCT-02-VENT` | Cryo-Docking & Awakening | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P3** | `sector_52` | Service Elevator Maintenance (SHORTCUT) | `SCT-03-ELEV` | Cryo-Docking & Awakening | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P4** | `sector_25` | Cryo-Storage Apex Vault | `CRG-25` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_26` | Sub-Deck Maintenance Vent (SECRET) | `SEC-B-VENT` | Engineering Core & Heavy Cargo | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_32` | The Reactor Core Heart | `ENG-32` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_33` | Overcharged Capacitor Cache (SECRET) | `SEC-C-CACHE` | Logistics Grid & Fusion Confinement | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_45` | Sub-Vault Maintenance Nook (SECRET) | `SEC-A-NOOK` | Decommissioned Catacombs & Secret Vaults | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_46` | Cryo-Depot Hidden Catacomb (SECRET) | `SEC-B-CATA` | Decommissioned Catacombs & Secret Vaults | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_47` | Decommissioned Drone Foundry (SECRET) | `SEC-C-DRON` | Decommissioned Catacombs & Secret Vaults | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 
| **P4** | `sector_48` | Plasma Conductor Void (SECRET) | `SEC-D-VOID` | Decommissioned Catacombs & Secret Vaults | 100% | 35% | 85% | 100% | 100% | **80%** | Procedural | 
| **P4** | `sector_49` | Archival Vault Zero (SECRET) | `SEC-E-ARCH` | Decommissioned Catacombs & Secret Vaults | 100% | 35% | 100% | 100% | 100% | **84%** | Procedural | 

---

## 5. Detailed Room Asset Requirements by Priority Tier

### Tier 1: P1 - Central Station Hub (12 Rooms)

#### `sector_00`: Orbital Transit Grand Nexus (NEX-00)
- **Sector & Biome**: Nexus: Central Transit Hub — *Orbital Central Transit Nexus*
- **Dimensions**: 14m x 14m | **Category**: `vertical`
- **Production Rationale**: Grand Nexus atrium connecting 6 major sectors. High recurrence transit area.
- **Completion Metrics**: Overall: **82%** | Gameplay: 100% | Visual: 35% | Puzzle: 93% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `grand_nexus_terrazzo_plate`, `rotary_lift_perimeter_tile`, `transit_arterial_marking_tile`, `fragment_dais_inlay_tile`
- **Walls Required**: `monolithic_station_keystone_wall`, `dual_lift_channel_bulkhead`, `atrium_observation_glazing`
- **Props Required**: `grand_fragment_receptacle_altar`, `dual_elevator_counterweight_tower`, `station_hologram_projector_plinth`, `mezzanine_guardrail_mesh`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`, `continuous_vertical_lift_platform`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `receptacle_quantum_resonance_beam`, `holographic_station_spin_display`, `lift_shaft_energy_ring`, `nexus_core_ambient_gleam`

#### `sector_01`: Cryo-Dock Awakening (SEC-01)
- **Sector & Biome**: Alpha: Docking Bay — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `tutorial`
- **Production Rationale**: Initial player onboarding, core jump/push mechanics introduction, visual first impression.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_02`: Jump Calibration Bay (SEC-02)
- **Sector & Biome**: Alpha: Docking Bay — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `tutorial`
- **Production Rationale**: Initial player onboarding, core jump/push mechanics introduction, visual first impression.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `keycard_blue_tier1_clearance`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_03`: Crate Logistics Lab (SEC-03)
- **Sector & Biome**: Alpha: Docking Bay — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `tutorial`
- **Production Rationale**: Initial player onboarding, core jump/push mechanics introduction, visual first impression.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `biometric_keycard_reader_panel`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_04`: Apex Vault I: Cryo Matrix (SEC-04)
- **Sector & Biome**: Alpha: Docking Bay — *Cryo-Docking & Awakening*
- **Dimensions**: 11m x 11m | **Category**: `tutorial`
- **Production Rationale**: Initial player onboarding, core jump/push mechanics introduction, visual first impression.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_i__cryo_matrix`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_07`: Laser Synchronization Maze (SEC-07)
- **Sector & Biome**: Beta: Engineering Core — *Engineering Core & Heavy Cargo*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: Houses mandatory keycards (Red/Green) and core Nexus Fragments (II, III, IV).
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `keycard_red_tier2_clearance`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_08`: Quantum Inversion Matrix (SEC-08)
- **Sector & Biome**: Beta: Engineering Core — *Engineering Core & Heavy Cargo*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: Houses mandatory keycards (Red/Green) and core Nexus Fragments (II, III, IV).
- **Completion Metrics**: Overall: **82%** | Gameplay: 100% | Visual: 35% | Puzzle: 93% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `inter_room_transit_elevator_chassis`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_ii__fusion_core`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_12`: High-Value Vault III: AI Sub-Brain (SEC-12)
- **Sector & Biome**: Gamma: Cargo & Logistics — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 11m x 11m | **Category**: `storage`
- **Production Rationale**: Houses mandatory keycards (Red/Green) and core Nexus Fragments (II, III, IV).
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_iii__cybernetic_overmind`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_15`: Supercharger Sub-Station (SEC-15)
- **Sector & Biome**: Delta: Power & Dynamos — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `energy`
- **Production Rationale**: Houses mandatory keycards (Red/Green) and core Nexus Fragments (II, III, IV).
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `biometric_keycard_reader_panel`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `keycard_green_tier3_clearance`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_16`: Reactor Core Apex (SEC-16)
- **Sector & Biome**: Delta: Power & Dynamos — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `energy`
- **Production Rationale**: Houses mandatory keycards (Red/Green) and core Nexus Fragments (II, III, IV).
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_iv__graviton_dynamo`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_19`: Master Access Antechamber (SEC-19)
- **Sector & Biome**: Omega: Citadel Bastion — *Citadel Bastion & Overmind Sanctum*
- **Dimensions**: 12m x 12m | **Category**: `security`
- **Production Rationale**: Overmind Sanctum climax, boss encounter visual centerpiece, and victory portal.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `obsidian_alloy_chitin_tile`, `bioluminescent_neural_vein_tile`, `security_grid_perimeter_tile`, `bastion_throne_dais_tile`
- **Walls Required**: `overmind_neural_lattice_wall`, `kinetic_blast_armor_slab`, `turret_housing_bulkhead`
- **Props Required**: `ai_sub_node_obelisk`, `drone_charging_dock_cradle`, `security_sentry_mount`, `neural_server_column`, `biomorphic_data_tendril`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `biometric_keycard_reader_panel`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_v__chrono_resonance`
- **VFX Required**: `neural_pulse_data_stream`, `red_alert_strobe_sweep`, `forcefield_shimmer_hex`, `overmind_singularity_distortion`

#### `sector_20`: Overmind Sanctum Core (SEC-20)
- **Sector & Biome**: Omega: Citadel Bastion — *Citadel Bastion & Overmind Sanctum*
- **Dimensions**: 14m x 14m | **Category**: `security`
- **Production Rationale**: Overmind Sanctum climax, boss encounter visual centerpiece, and victory portal.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `obsidian_alloy_chitin_tile`, `bioluminescent_neural_vein_tile`, `security_grid_perimeter_tile`, `bastion_throne_dais_tile`
- **Walls Required**: `overmind_neural_lattice_wall`, `kinetic_blast_armor_slab`, `turret_housing_bulkhead`
- **Props Required**: `ai_sub_node_obelisk`, `drone_charging_dock_cradle`, `security_sentry_mount`, `neural_server_column`, `biomorphic_data_tendril`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `quantum_reunification_exit_portal_altar`
- **Enemies Required**: `patrol_drone_sentinel_mk1`, `interceptor_scout_drone_rapid`, `heavy_bastion_enforcer_drone`, `overmind_central_core_boss`
- **Collectibles Required**: None
- **VFX Required**: `neural_pulse_data_stream`, `red_alert_strobe_sweep`, `forcefield_shimmer_hex`, `overmind_singularity_distortion`

### Tier 2: P2 - Primary Sector Mainline (17 Rooms)

#### `sector_05`: Dual Relay Chamber (SEC-05)
- **Sector & Biome**: Beta: Engineering Core — *Engineering Core & Heavy Cargo*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `multi_relay_lock_indicator_display`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_06`: Stacking Stepper Pit (SEC-06)
- **Sector & Biome**: Beta: Engineering Core — *Engineering Core & Heavy Cargo*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `multi_relay_lock_indicator_display`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_09`: Freight Receiving Dock (SEC-09)
- **Sector & Biome**: Gamma: Cargo & Logistics — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 12m x 12m | **Category**: `storage`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `inter_room_transit_elevator_chassis`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_10`: Deep Cryo Warehouse (SEC-10)
- **Sector & Biome**: Gamma: Cargo & Logistics — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 11m x 11m | **Category**: `storage`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_11`: Hazardous Waste Sump (SEC-11)
- **Sector & Biome**: Gamma: Cargo & Logistics — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 12m x 12m | **Category**: `storage`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `multi_relay_lock_indicator_display`
- **Enemies Required**: `patrol_drone_sentinel_mk1`, `interceptor_scout_drone_rapid`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_13`: Plasma Generator Hub (SEC-13)
- **Sector & Biome**: Delta: Power & Dynamos — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `energy`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_14`: High Voltage Transformer (SEC-14)
- **Sector & Biome**: Delta: Power & Dynamos — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 11m x 11m | **Category**: `energy`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_17`: Drone Sentinel Perimeter (SEC-17)
- **Sector & Biome**: Omega: Citadel Bastion — *Citadel Bastion & Overmind Sanctum*
- **Dimensions**: 12m x 12m | **Category**: `security`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `obsidian_alloy_chitin_tile`, `bioluminescent_neural_vein_tile`, `security_grid_perimeter_tile`, `bastion_throne_dais_tile`
- **Walls Required**: `overmind_neural_lattice_wall`, `kinetic_blast_armor_slab`, `turret_housing_bulkhead`
- **Props Required**: `ai_sub_node_obelisk`, `drone_charging_dock_cradle`, `security_sentry_mount`, `neural_server_column`, `biomorphic_data_tendril`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `neural_pulse_data_stream`, `red_alert_strobe_sweep`, `forcefield_shimmer_hex`, `overmind_singularity_distortion`

#### `sector_18`: Interceptor Bastion (SEC-18)
- **Sector & Biome**: Omega: Citadel Bastion — *Citadel Bastion & Overmind Sanctum*
- **Dimensions**: 12m x 12m | **Category**: `security`
- **Production Rationale**: Core quadrant spine connecting key engineering, logistics, and citadel defense zones.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `obsidian_alloy_chitin_tile`, `bioluminescent_neural_vein_tile`, `security_grid_perimeter_tile`, `bastion_throne_dais_tile`
- **Walls Required**: `overmind_neural_lattice_wall`, `kinetic_blast_armor_slab`, `turret_housing_bulkhead`
- **Props Required**: `ai_sub_node_obelisk`, `drone_charging_dock_cradle`, `security_sentry_mount`, `neural_server_column`, `biomorphic_data_tendril`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `multi_relay_lock_indicator_display`
- **Enemies Required**: `patrol_drone_sentinel_mk1`, `interceptor_scout_drone_rapid`, `heavy_bastion_enforcer_drone`
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `neural_pulse_data_stream`, `red_alert_strobe_sweep`, `forcefield_shimmer_hex`, `overmind_singularity_distortion`

#### `sector_21`: Cargo Intake & Weigh Station (CRG-21)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 12m x 12m | **Category**: `storage`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_22`: Hydraulic Lift Shaft (CRG-22)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 10m x 12m | **Category**: `vertical`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `continuous_vertical_lift_platform`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_23`: Sub-Zero Stacking Bay (CRG-23)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_24`: Container Crane Gantry (CRG-24)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 13m x 13m | **Category**: `vertical`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_28`: Plasma Distribution Junction (ENG-28)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 12m x 12m | **Category**: `energy`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_29`: High Voltage Stepping Conduits (ENG-29)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 10m x 13m | **Category**: `vertical`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_30`: Laser Reflection Relay Chamber (ENG-30)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **82%** | Gameplay: 100% | Visual: 35% | Puzzle: 93% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nano_repair_medkit_capsule`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_31`: Electromagnetic Elevator Core (ENG-31)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 13m x 13m | **Category**: `vertical`
- **Production Rationale**: Major branch exploration wings housing large-scale platforming and confinement puzzles.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`, `continuous_vertical_lift_platform`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

### Tier 3: P3 - Transit Shortcuts & Bypasses (15 Rooms)

#### `sector_27`: Cargo Chute Bypass (SHORTCUT) (SCT-B-CHUTE)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 9m x 9m | **Category**: `vertical`
- **Production Rationale**: Rapid inter-wing conduits and lift shafts unlocked after circuit reactivation.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_34`: High-Energy Service Conduit (SHORTCUT) (SCT-C-VENT)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 9m x 9m | **Category**: `vertical`
- **Production Rationale**: Rapid inter-wing conduits and lift shafts unlocked after circuit reactivation.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_35`: Cargo Stacking Testing Facility (STK-01-TEST)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_36`: Dual-Mass Hydraulic Crucible (STK-02-MASS)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **82%** | Gameplay: 100% | Visual: 35% | Puzzle: 93% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `keycard_blue_tier1_clearance`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_37`: High-Bay Vertical Stepper (STK-03-STEP)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_nexus_core_shard_theta`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_38`: Laser Interception Gantry (STK-04-OPTI)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_39`: Magnetic Freight Balancer (STK-05-MAG)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 13m x 13m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **81%** | Gameplay: 100% | Visual: 35% | Puzzle: 90% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_40`: Cryo-Crate Logistics Sorter (STK-06-CRYO)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_41`: Pneumatic Column Press (STK-07-PRESS)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 12m x 12m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_nexus_fragment_iota`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_42`: Overhead Concourse Mezzanine (STK-08-CATW)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 13m x 13m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_43`: Dual-Beam Deflection Vault (STK-09-DEFL)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 13m x 13m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_44`: Apex Stacking Colosseum (STK-10-COLOS)
- **Sector & Biome**: Delta: Heavy Cargo & Stacking Yards — *Power Substation & Heavy Stacking Yard*
- **Dimensions**: 14m x 14m | **Category**: `puzzle`
- **Production Rationale**: 10-room advanced vertical puzzle sequence for hardcore spatial problem-solving.
- **Completion Metrics**: Overall: **81%** | Gameplay: 100% | Visual: 35% | Puzzle: 90% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `inductive_copper_bus_tile`, `high_voltage_isolation_tile`, `heavy_crush_tested_paver`, `hydraulic_press_bed_tile`
- **Walls Required**: `dielectric_ceramic_wall`, `inductive_transformer_housing`, `blast_mitigation_ribbed_wall`
- **Props Required**: `tesla_insulator_stack`, `step_down_transformer_housing`, `stacking_alignment_guide_post`, `heavy_lifting_winch`, `fuse_breaker_assembly`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_grand_nexus_fragment_omega`
- **VFX Required**: `dielectric_glow_halo`, `ground_current_spark`, `hydraulic_press_impact_dust`, `transformer_hum_vibration_ring`

#### `sector_50`: High-Catwalk Express (SHORTCUT) (SCT-01-EXP)
- **Sector & Biome**: Alpha: Station Shortcuts — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `vertical`
- **Production Rationale**: Rapid inter-wing conduits and lift shafts unlocked after circuit reactivation.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_51`: Ventilation Bypass (SHORTCUT) (SCT-02-VENT)
- **Sector & Biome**: Alpha: Station Shortcuts — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `vertical`
- **Production Rationale**: Rapid inter-wing conduits and lift shafts unlocked after circuit reactivation.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

#### `sector_52`: Service Elevator Maintenance (SHORTCUT) (SCT-03-ELEV)
- **Sector & Biome**: Alpha: Station Shortcuts — *Cryo-Docking & Awakening*
- **Dimensions**: 10m x 10m | **Category**: `vertical`
- **Production Rationale**: Rapid inter-wing conduits and lift shafts unlocked after circuit reactivation.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `cryo_deck_composite_tile`, `docking_bay_marking_tile`, `sub_atmospheric_grate`, `frost_rim_tile`
- **Walls Required**: `pressurized_dock_bulkhead`, `insulated_cryo_wall`, `observation_reinforced_glass`
- **Props Required**: `cryo_stasis_pod_dormant`, `docking_clamp_hydraulic`, `decontamination_vent_nozzle`, `guidance_marking_stencils`, `diagnostic_console_pedestal`
- **Puzzle Objects Required**: `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`
- **VFX Required**: `cryo_condensation_fog`, `pressurization_steam_burst`, `docking_bay_beacon_pulse`, `floor_vent_sub_vapor`

### Tier 4: P4 - Secret Vaults & Optional Reward Nooks (9 Rooms)

#### `sector_25`: Cryo-Storage Apex Vault (CRG-25)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 12m x 12m | **Category**: `storage`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `manual_toggle_breaker_switch`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_i__cryo_stasis_shard`, `nano_repair_medkit_capsule`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_26`: Sub-Deck Maintenance Vent (SECRET) (SEC-B-VENT)
- **Sector & Biome**: Beta: Cargo & Cryo Vaults — *Engineering Core & Heavy Cargo*
- **Dimensions**: 8m x 8m | **Category**: `puzzle`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `diamond_tread_steel_plate`, `heavy_gantry_mesh_tile`, `hydraulic_pit_rim_tile`, `reinforced_strut_tile`
- **Walls Required**: `heavy_riveted_hull_wall`, `conduit_junction_rack_wall`, `coolant_manifold_wall`
- **Props Required**: `overhead_crane_rail_segment`, `hydraulic_piston_housing`, `coolant_reservoir_tank`, `high_tonnage_cargo_pallet`, `cable_spool_industrial`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `keycard_blue_tier1_clearance`, `plasma_energy_cell_canister`
- **VFX Required**: `coolant_leak_drip`, `hydraulic_steam_exhaust`, `circuit_short_spark`, `gantry_motion_dust`

#### `sector_32`: The Reactor Core Heart (ENG-32)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 14m x 14m | **Category**: `energy`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `pressure_plate_weight_sensitive`, `automated_hydraulic_bulkhead_door`, `hazard_laser_emitter_pylon`, `laser_beam_energy_barrier`, `refractive_ceramic_deflector_surface`
- **Enemies Required**: `patrol_drone_sentinel_mk1`, `interceptor_scout_drone_rapid`
- **Collectibles Required**: `nexus_fragment_nexus_fragment_ii__fusion_core_torus`, `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_33`: Overcharged Capacitor Cache (SECRET) (SEC-C-CACHE)
- **Sector & Biome**: Gamma: Reactor Core — *Logistics Grid & Fusion Confinement*
- **Dimensions**: 8m x 8m | **Category**: `energy`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `conveyor_track_deck_tile`, `magnetic_suspension_tile`, `reactor_trench_thermal_tile`, `lead_shielding_tile`
- **Walls Required**: `magnetic_containment_wall`, `radiation_baffle_wall`, `high_frequency_emitter_bulkhead`
- **Props Required**: `magnetic_stabilizer_pylon`, `automated_sorting_chute`, `radiation_warning_placard`, `coolant_conduit_loop`, `cargo_scanner_arch`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `keycard_red_tier2_clearance`, `plasma_energy_cell_canister`
- **VFX Required**: `plasma_arc_microburst`, `magnetic_field_heat_shimmer`, `radiation_ion_glimmer`, `reactor_core_ambient_corona`

#### `sector_45`: Sub-Vault Maintenance Nook (SECRET) (SEC-A-NOOK)
- **Sector & Biome**: Secrets: Hidden Chambers — *Decommissioned Catacombs & Secret Vaults*
- **Dimensions**: 9m x 9m | **Category**: `puzzle`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `weathered_grate_floor_tile`, `exposed_structural_rib_tile`, `dust_blanketed_subfloor_tile`
- **Walls Required**: `unshielded_hull_plating`, `collapsed_duct_framing`, `corroded_conduit_recess`
- **Props Required**: `abandoned_maintenance_cart`, `disconnected_cable_nest`, `makeshift_stepping_catwalk`, `ancient_zenith_crest_plinth`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_nexus_fragment_epsilon`, `plasma_energy_cell_canister`
- **VFX Required**: `thick_ambient_spore_dust`, `hanging_wire_short_flicker`, `relic_gold_glow_halo`

#### `sector_46`: Cryo-Depot Hidden Catacomb (SECRET) (SEC-B-CATA)
- **Sector & Biome**: Secrets: Hidden Chambers — *Decommissioned Catacombs & Secret Vaults*
- **Dimensions**: 10m x 10m | **Category**: `storage`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `weathered_grate_floor_tile`, `exposed_structural_rib_tile`, `dust_blanketed_subfloor_tile`
- **Walls Required**: `unshielded_hull_plating`, `collapsed_duct_framing`, `corroded_conduit_recess`
- **Props Required**: `abandoned_maintenance_cart`, `disconnected_cable_nest`, `makeshift_stepping_catwalk`, `ancient_zenith_crest_plinth`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_nexus_shard_zeta`, `plasma_energy_cell_canister`
- **VFX Required**: `thick_ambient_spore_dust`, `hanging_wire_short_flicker`, `relic_gold_glow_halo`

#### `sector_47`: Decommissioned Drone Foundry (SECRET) (SEC-C-DRON)
- **Sector & Biome**: Secrets: Hidden Chambers — *Decommissioned Catacombs & Secret Vaults*
- **Dimensions**: 11m x 11m | **Category**: `security`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `weathered_grate_floor_tile`, `exposed_structural_rib_tile`, `dust_blanketed_subfloor_tile`
- **Walls Required**: `unshielded_hull_plating`, `collapsed_duct_framing`, `corroded_conduit_recess`
- **Props Required**: `abandoned_maintenance_cart`, `disconnected_cable_nest`, `makeshift_stepping_catwalk`, `ancient_zenith_crest_plinth`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_nexus_core_shard_eta`, `plasma_energy_cell_canister`
- **VFX Required**: `thick_ambient_spore_dust`, `hanging_wire_short_flicker`, `relic_gold_glow_halo`

#### `sector_48`: Plasma Conductor Void (SECRET) (SEC-D-VOID)
- **Sector & Biome**: Secrets: Hidden Chambers — *Decommissioned Catacombs & Secret Vaults*
- **Dimensions**: 10m x 10m | **Category**: `energy`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **80%** | Gameplay: 100% | Visual: 35% | Puzzle: 85% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `weathered_grate_floor_tile`, `exposed_structural_rib_tile`, `dust_blanketed_subfloor_tile`
- **Walls Required**: `unshielded_hull_plating`, `collapsed_duct_framing`, `corroded_conduit_recess`
- **Props Required**: `abandoned_maintenance_cart`, `disconnected_cable_nest`, `makeshift_stepping_catwalk`, `ancient_zenith_crest_plinth`
- **Puzzle Objects Required**: `movable_crate_composite_standard`, `stackable_crate_locking_lip`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `plasma_energy_cell_canister`, `nexus_fragment_nexus_shard_lambda`
- **VFX Required**: `thick_ambient_spore_dust`, `hanging_wire_short_flicker`, `relic_gold_glow_halo`

#### `sector_49`: Archival Vault Zero (SECRET) (SEC-E-ARCH)
- **Sector & Biome**: Secrets: Hidden Chambers — *Decommissioned Catacombs & Secret Vaults*
- **Dimensions**: 11m x 11m | **Category**: `puzzle`
- **Production Rationale**: Degree-1 hidden chambers requiring box-stacking stunts to discover optional shards and master crests.
- **Completion Metrics**: Overall: **84%** | Gameplay: 100% | Visual: 35% | Puzzle: 100% | Enemy: 100% | Collectible: 100%
- **Tiles Required**: `weathered_grate_floor_tile`, `exposed_structural_rib_tile`, `dust_blanketed_subfloor_tile`
- **Walls Required**: `unshielded_hull_plating`, `collapsed_duct_framing`, `corroded_conduit_recess`
- **Props Required**: `abandoned_maintenance_cart`, `disconnected_cable_nest`, `makeshift_stepping_catwalk`, `ancient_zenith_crest_plinth`
- **Puzzle Objects Required**: `interactive_data_terminal`, `automated_hydraulic_bulkhead_door`
- **Enemies Required**: None (Safe / Puzzle Area)
- **Collectibles Required**: `nexus_fragment_zenith_master_crest`, `plasma_energy_cell_canister`
- **VFX Required**: `thick_ambient_spore_dust`, `hanging_wire_short_flicker`, `relic_gold_glow_halo`

