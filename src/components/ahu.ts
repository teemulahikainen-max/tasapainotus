import type { NodeId } from "../core/nodes";
import {
  assertNonEmptyId,
  assertPositiveNumber,
  createFlowData,
  type EndpointComponent
} from "./base";

export type AhuSystemType = "supply" | "exhaust" | "mixed";

export interface AhuGeometry {
  widthMeters: number;
  depthMeters: number;
  heightMeters: number;
}

export interface AhuMetadata {
  label: string;
  systemType: AhuSystemType;
}

export interface CreateAhuInput {
  id: string;
  nodeId: NodeId;
  label?: string;
  systemType?: AhuSystemType;
  geometry?: Partial<AhuGeometry>;
}

export type AhuComponent = EndpointComponent<"ahu", AhuGeometry, AhuMetadata>;

const DEFAULT_AHU_GEOMETRY: AhuGeometry = {
  widthMeters: 2.2,
  depthMeters: 1.2,
  heightMeters: 1.6
};

export function createAhu(input: CreateAhuInput): AhuComponent {
  assertNonEmptyId(input.id, "AHU id");
  assertNonEmptyId(input.nodeId, "AHU node id");

  const geometry: AhuGeometry = {
    ...DEFAULT_AHU_GEOMETRY,
    ...(input.geometry ?? {})
  };

  assertPositiveNumber(geometry.widthMeters, "AHU widthMeters");
  assertPositiveNumber(geometry.depthMeters, "AHU depthMeters");
  assertPositiveNumber(geometry.heightMeters, "AHU heightMeters");

  return {
    id: input.id,
    type: "ahu",
    nodeIds: [input.nodeId],
    geometry,
    flow: createFlowData(),
    pressureLossPa: null,
    metadata: {
      label: input.label ?? input.id,
      systemType: input.systemType ?? "supply"
    }
  };
}

