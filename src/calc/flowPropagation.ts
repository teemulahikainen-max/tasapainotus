import type { NetworkEdge } from "../core/edges";
import { DuctNetworkGraph } from "../core/graph";
import type { NodeId } from "../core/nodes";

export interface FlowPropagationResult {
  systemFlowRateLps: number;
  nodeFlowRateLpsById: Record<string, number>;
  componentFlowRateLpsById: Record<string, number>;
}

export function propagateTerminalFlows(
  graph: DuctNetworkGraph
): FlowPropagationResult {
  const ahu = graph.getAhu();

  if (!ahu) {
    throw new Error("Cannot propagate terminal flows without an AHU.");
  }

  const ahuNodeId = ahu.nodeIds[0];
  const adjacency = createAdjacencyMap(graph.getEdges());
  const terminalFlowByNodeId = new Map<NodeId, number>();

  for (const terminal of graph.getTerminals()) {
    const terminalFlowRateLps = terminal.flow.designFlowRateLps ?? 0;
    const terminalNodeId = terminal.nodeIds[0];

    if (graph.findNodePath(ahuNodeId, terminalNodeId) === null) {
      throw new Error(
        `Terminal "${terminal.id}" is not connected to the AHU.`
      );
    }

    terminalFlowByNodeId.set(
      terminalNodeId,
      (terminalFlowByNodeId.get(terminalNodeId) ?? 0) + terminalFlowRateLps
    );
  }

  const nodeFlowRateLpsById = new Map<string, number>();
  const componentFlowRateLpsById = new Map<string, number>();

  const systemFlowRateLps = sumFlowsFromNode(
    ahuNodeId,
    null,
    adjacency,
    terminalFlowByNodeId,
    nodeFlowRateLpsById,
    componentFlowRateLpsById,
    new Set<NodeId>()
  );

  return {
    systemFlowRateLps,
    nodeFlowRateLpsById: Object.fromEntries(nodeFlowRateLpsById.entries()),
    componentFlowRateLpsById: Object.fromEntries(
      componentFlowRateLpsById.entries()
    )
  };
}

function createAdjacencyMap(
  edges: NetworkEdge[]
): Map<NodeId, NetworkEdge[]> {
  const adjacency = new Map<NodeId, NetworkEdge[]>();

  for (const edge of edges) {
    if (!adjacency.has(edge.fromNodeId)) {
      adjacency.set(edge.fromNodeId, []);
    }

    if (!adjacency.has(edge.toNodeId)) {
      adjacency.set(edge.toNodeId, []);
    }

    adjacency.get(edge.fromNodeId)?.push(edge);
    adjacency.get(edge.toNodeId)?.push(edge);
  }

  return adjacency;
}

function sumFlowsFromNode(
  nodeId: NodeId,
  parentNodeId: NodeId | null,
  adjacency: Map<NodeId, NetworkEdge[]>,
  terminalFlowByNodeId: Map<NodeId, number>,
  nodeFlowRateLpsById: Map<string, number>,
  componentFlowRateLpsById: Map<string, number>,
  visited: Set<NodeId>
): number {
  visited.add(nodeId);

  let totalFlowRateLps = terminalFlowByNodeId.get(nodeId) ?? 0;

  for (const edge of adjacency.get(nodeId) ?? []) {
    const neighborNodeId =
      edge.fromNodeId === nodeId ? edge.toNodeId : edge.fromNodeId;

    if (neighborNodeId === parentNodeId) {
      continue;
    }

    if (visited.has(neighborNodeId)) {
      throw new Error(
        "Flow propagation currently supports tree-shaped duct networks only."
      );
    }

    const childFlowRateLps = sumFlowsFromNode(
      neighborNodeId,
      nodeId,
      adjacency,
      terminalFlowByNodeId,
      nodeFlowRateLpsById,
      componentFlowRateLpsById,
      visited
    );

    componentFlowRateLpsById.set(edge.componentId, childFlowRateLps);
    totalFlowRateLps += childFlowRateLps;
  }

  nodeFlowRateLpsById.set(nodeId, totalFlowRateLps);

  return totalFlowRateLps;
}

