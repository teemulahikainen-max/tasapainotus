# Tasapainotus Specification

## Product Summary

Tasapainotus is a browser-based HVAC duct design and analysis tool focused on fast network editing, transparent engineering calculations, and clear route-level results.

## Version 1 Goals

Version 1 must support:

* 2D duct network editing in the browser
* 10 cm snapping for fast layout work
* AHU and terminal placement
* Standard round ducts and basic fittings
* Pressure-loss calculations using Darcy-Weisbach
* Friction factor calculation using Swamee-Jain
* Local loss handling with k-values
* Path traversal from AHU to terminals
* Critical-path identification
* Balancing-oriented route comparison
* Read-only 3D visualization

## Non-Goals for Version 1

Version 1 does not include:

* IFC or BIM export
* full 3D editing
* manufacturer product databases
* automatic optimization
* advanced rectangular duct workflows
* collision detection
* advanced multi-floor logic

## Engineering Rules

The application must follow these rules:

* Geometry represents a valid duct network graph
* Components always connect through nodes
* Calculation steps stay transparent and reproducible
* UI favors speed and clarity over detailed CAD-like modeling
* Calculation, geometry, and UI code remain separated

## Initial Technical Direction

Phase 1 uses:

* React for the application shell
* TypeScript for source code
* Vite for development and build tooling
* Vitest for automated tests

## Phase Boundaries

Development proceeds one phase at a time.

Before UI or 3D features expand, the project must first establish:

* the core graph-based data model
* the engineering calculation engine

