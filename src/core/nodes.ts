import { assertFinitePoint3D, clonePoint3D, type Point3D } from "./geometry";

export type NodeId = string;
export type NodeKind = "junction" | "endpoint";

export interface NodeMetadata {
  label?: string;
}

export interface DuctNode {
  id: NodeId;
  kind: NodeKind;
  position: Point3D;
  metadata: NodeMetadata;
}

export interface CreateNodeInput {
  id: NodeId;
  position: Point3D;
  kind?: NodeKind;
  metadata?: NodeMetadata;
}

export function createNode(input: CreateNodeInput): DuctNode {
  if (input.id.trim().length === 0) {
    throw new Error("Node id is required.");
  }

  assertFinitePoint3D(input.position, `Node "${input.id}" position`);

  return {
    id: input.id,
    kind: input.kind ?? "junction",
    position: clonePoint3D(input.position),
    metadata: { ...(input.metadata ?? {}) }
  };
}

