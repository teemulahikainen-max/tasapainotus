# HVAC Duct Design Tool – Development Plan

## 1. Purpose

The goal is to build a **browser-based HVAC duct design and analysis tool** that allows fast drawing of duct networks and supports:

* Placement of main components (AHU, terminals)
* Fast duct routing with snapping
* Standard duct sizes and fittings
* Pressure loss calculation (Darcy–Weisbach)
* Friction factor using Swamee–Jain
* Identification of the **critical (most demanding) path**
* Support for duct system balancing

The focus is on:

* **speed of use**
* **clarity of results**
* **engineering correctness**

---

## 2. Scope (Version 1)

### Included in V1

* Browser-based application (no installation required)
* 2D drawing with mouse
* Grid snapping (10 cm)
* Basic 3D visualization (read-only)
* Air Handling Unit (AHU) as main component
* Terminal devices (supply, exhaust, outdoor, exhaust air)
* Round duct sizes (standardized)
* Basic fittings:

  * straight duct
  * elbow
  * tee
  * reducer (optional in v1 if needed)
* Flow distribution from terminals to AHU
* Pressure loss calculations:

  * Darcy–Weisbach
  * Swamee–Jain friction factor
  * Local losses using ζ-values (k-values)
* Route detection:

  * all paths from AHU to terminals
  * identification of **critical path**
* Display of results per:

  * component
  * route

---

### Not included in V1

* IFC/BIM export
* Full 3D editing
* Manufacturer databases
* Automatic optimization algorithms
* Advanced rectangular duct systems (optional later)
* Collision detection
* Multi-floor advanced logic (basic Z allowed later)

---

## 3. Core Design Principles

1. The system is **not a drawing tool**, but a **network editor**
2. All geometry must map to a **valid duct network graph**
3. Each component must:

   * connect to nodes
   * contain engineering data
4. Calculation must be:

   * transparent
   * reproducible
5. UI must support **fast workflow over precision modeling**

---

## 4. System Architecture

### 4.1 Core Layers

* **Data Model (core)**
* **Calculation Engine**
* **Geometry / Drawing**
* **UI**
* **Visualization (3D)**

---

### 4.2 Folder Structure

```text
src/
  core/
    graph.ts
    nodes.ts
    edges.ts
    snapping.ts
    geometry.ts
  components/
    ahu.ts
    duct.ts
    elbow.ts
    tee.ts
    terminal.ts
    reducer.ts
  calc/
    reynolds.ts
    swameeJain.ts
    darcyWeisbach.ts
    localLoss.ts
    routes.ts
    balancing.ts
  data/
    ductSizes.json
    terminals.json
    fittings.json
  ui/
    canvas2d.ts
    controls.ts
    sidebar.ts
    properties.ts
  view3d/
    scene.ts
    renderer.ts
    camera.ts
```

---

## 5. Development Phases

---

### Phase 1 – Project Setup

**Goal:** Create working development environment

Tasks:

* Initialize repository
* Setup TypeScript project
* Setup basic React UI
* Add testing framework (Vitest or Jest)
* Create folder structure
* Add base documentation

Acceptance Criteria:

* Project runs locally
* Tests can be executed
* Basic UI renders

---

### Phase 2 – Core Data Model

**Goal:** Create duct network structure

Tasks:

* Define Node
* Define Edge
* Define Component base type
* Implement:

  * AHU
  * DuctSegment
  * TerminalDevice
* Implement connection logic
* Ensure valid graph structure

Acceptance Criteria:

* Can create a small duct network in code
* Components connect correctly
* Graph is traversable

---

### Phase 3 – Calculation Engine

**Goal:** Implement all engineering calculations

Tasks:

* Reynolds number
* Swamee–Jain friction factor
* Darcy–Weisbach pressure loss
* Hydraulic diameter
* Local losses (ζ)
* Flow propagation from terminals

Acceptance Criteria:

* Unit tests validate formulas
* Results match reference calculations
* Each component returns:

  * pressure loss
  * velocity
  * Reynolds

---

### Phase 4 – Route Analysis

**Goal:** Identify system behavior

Tasks:

* Traverse all paths from AHU to terminals
* Calculate total pressure loss per route
* Identify critical path
* Return detailed breakdown

Acceptance Criteria:

* Correct path detection in branched network
* Correct identification of worst-case path

---

### Phase 5 – 2D Drawing System

**Goal:** Enable fast user input

Tasks:

* Implement SVG or Canvas-based editor
* Grid (10 cm)
* Snap-to-grid
* Mouse-based drawing:

  * straight ducts
  * auto node creation
* Component placement:

  * AHU
  * terminals
* Selection and deletion tools

Acceptance Criteria:

* User can draw network quickly
* Snap works consistently
* Geometry matches data model

---

### Phase 6 – 3D Visualization

**Goal:** Visual feedback

Tasks:

* Render ducts using Three.js
* Render AHU as box
* Render terminals as markers
* Add orbit camera
* Sync with 2D model

Acceptance Criteria:

* 3D updates when model changes
* No editing in 3D (view only)

---

### Phase 7 – Balancing Support

**Goal:** Support engineering workflow

Tasks:

* Compare parallel branches
* Show pressure differences
* Highlight imbalance
* Suggest balancing need

Acceptance Criteria:

* User can identify imbalance visually
* Critical path clearly highlighted

---

## 6. Data Definitions

Each component must include:

* id
* type
* connected nodes
* geometry data
* flow data
* pressure loss
* metadata (e.g. size, k-value)

---

## 7. Calculation Formulas

### Reynolds Number

Re = (ρ * v * D) / μ

### Swamee–Jain

f = 0.25 / [log10( (ε / 3.7D) + (5.74 / Re^0.9) )]^2

### Darcy–Weisbach

Δp = f * (L / D) * (ρ * v² / 2)

### Local Loss

Δp = ζ * (ρ * v² / 2)

---

## 8. Development Rules (IMPORTANT)

Codex / developer must follow:

* Implement **one phase at a time**
* Do not modify unrelated files
* Always read:

  * docs/spec.md
  * docs/development-plan.md
* Separate:

  * calculation
  * geometry
  * UI
* Always include unit tests for calculations
* Keep code simple and readable
* Avoid over-engineering

---

## 9. First Task for Codex

Start with:

**Phase 1 – Project Setup**

Then proceed to:

**Phase 2 – Core Data Model**

Do NOT implement UI or 3D before:

* data model
* calculation engine

---

## 10. Future Extensions (V2+)

* Rectangular ducts
* Manufacturer libraries
* Automatic balancing
* Export (CSV, PDF)
* IFC/BIM integration
* Multi-floor support

---

END OF DOCUMENT
