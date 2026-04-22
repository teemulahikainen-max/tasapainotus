import { clonePoint3D, type Point3D } from "./geometry";

export const GRID_STEP_METERS = 0.1;

export function snapValueToGrid(
  value: number,
  gridStepMeters = GRID_STEP_METERS
): number {
  return Math.round(value / gridStepMeters) * gridStepMeters;
}

export function snapPointToGrid(
  point: Point3D,
  gridStepMeters = GRID_STEP_METERS
): Point3D {
  return clonePoint3D({
    x: snapValueToGrid(point.x, gridStepMeters),
    y: snapValueToGrid(point.y, gridStepMeters),
    z: snapValueToGrid(point.z, gridStepMeters)
  });
}

export function createPointKey(point: Point3D): string {
  return `${point.x.toFixed(4)}:${point.y.toFixed(4)}:${point.z.toFixed(4)}`;
}

