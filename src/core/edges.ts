import type { InlineComponent } from "../components";
import type { NodeId } from "./nodes";

export type EdgeId = string;

export interface NetworkEdge {
  id: EdgeId;
  componentId: string;
  fromNodeId: NodeId;
  toNodeId: NodeId;
}

export function createEdgeFromInlineComponent(
  component: InlineComponent<string, object, object>
): NetworkEdge {
  const [fromNodeId, toNodeId] = component.nodeIds;

  return {
    id: `edge:${component.id}`,
    componentId: component.id,
    fromNodeId,
    toNodeId
  };
}

export function getOppositeNodeId(
  edge: NetworkEdge,
  nodeId: NodeId
): NodeId | null {
  if (edge.fromNodeId === nodeId) {
    return edge.toNodeId;
  }

  if (edge.toNodeId === nodeId) {
    return edge.fromNodeId;
  }

  return null;
}

