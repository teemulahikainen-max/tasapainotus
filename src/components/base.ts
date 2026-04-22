import type { NodeId } from "../core/nodes";

export type ComponentId = string;

export interface FlowData {
  designFlowRateLps: number | null;
  actualFlowRateLps: number | null;
}

export interface BaseComponent<
  TType extends string,
  TGeometry extends object,
  TMetadata extends object
> {
  id: ComponentId;
  type: TType;
  nodeIds: readonly NodeId[];
  geometry: TGeometry;
  flow: FlowData;
  pressureLossPa: number | null;
  metadata: TMetadata;
}

export interface EndpointComponent<
  TType extends string,
  TGeometry extends object,
  TMetadata extends object
> extends BaseComponent<TType, TGeometry, TMetadata> {
  nodeIds: readonly [NodeId];
}

export interface InlineComponent<
  TType extends string,
  TGeometry extends object,
  TMetadata extends object
> extends BaseComponent<TType, TGeometry, TMetadata> {
  nodeIds: readonly [NodeId, NodeId];
}

type AnyComponent = BaseComponent<string, object, object>;

export function isEndpointComponent(
  component: AnyComponent
): component is EndpointComponent<string, object, object> {
  return component.nodeIds.length === 1;
}

export function isInlineComponent(
  component: AnyComponent
): component is InlineComponent<string, object, object> {
  return component.nodeIds.length === 2;
}

export function createFlowData(
  designFlowRateLps: number | null = null,
  actualFlowRateLps: number | null = null
): FlowData {
  return {
    designFlowRateLps,
    actualFlowRateLps
  };
}

export function assertNonEmptyId(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} is required.`);
  }
}

export function assertPositiveNumber(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

export function assertNonNegativeNumber(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }
}
