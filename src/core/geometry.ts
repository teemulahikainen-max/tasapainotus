export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function assertFinitePoint3D(point: Point3D, label = "Point3D"): void {
  const coordinates = Object.entries(point) as Array<[keyof Point3D, number]>;

  for (const [axis, value] of coordinates) {
    if (!Number.isFinite(value)) {
      throw new Error(`${label} coordinate "${axis}" must be a finite number.`);
    }
  }
}

export function clonePoint3D(point: Point3D): Point3D {
  assertFinitePoint3D(point);

  return {
    x: point.x,
    y: point.y,
    z: point.z
  };
}

