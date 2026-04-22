import type { NodeId } from "../core/nodes";
import {
  assertNonEmptyId,
  assertPositiveNumber,
  createFlowData,
  type EndpointComponent
} from "./base";

export type TerminalDeviceType =
  | "supply"
  | "exhaust"
  | "outdoor"
  | "exhaustAir";

export interface TerminalGeometry {
  markerSizeMeters: number;
}

export interface TerminalMetadata {
  label: string;
  terminalType: TerminalDeviceType;
}

export interface CreateTerminalDeviceInput {
  id: string;
  nodeId: NodeId;
  terminalType: TerminalDeviceType;
  designFlowRateLps: number;
  label?: string;
  markerSizeMeters?: number;
}

export type TerminalDeviceComponent = EndpointComponent<
  "terminal",
  TerminalGeometry,
  TerminalMetadata
>;

export function createTerminalDevice(
  input: CreateTerminalDeviceInput
): TerminalDeviceComponent {
  assertNonEmptyId(input.id, "Terminal id");
  assertNonEmptyId(input.nodeId, "Terminal node id");
  assertPositiveNumber(input.designFlowRateLps, "Terminal designFlowRateLps");
  assertPositiveNumber(
    input.markerSizeMeters ?? 0.4,
    "Terminal markerSizeMeters"
  );

  return {
    id: input.id,
    type: "terminal",
    nodeIds: [input.nodeId],
    geometry: {
      markerSizeMeters: input.markerSizeMeters ?? 0.4
    },
    flow: createFlowData(input.designFlowRateLps, input.designFlowRateLps),
    pressureLossPa: null,
    metadata: {
      label: input.label ?? input.id,
      terminalType: input.terminalType
    }
  };
}

