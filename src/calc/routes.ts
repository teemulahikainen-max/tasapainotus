import type { NetworkComponent, TerminalDeviceComponent } from "../components";
import { DuctNetworkGraph, type TerminalPath } from "../core/graph";
import {
  analyzeDuctNetworkPerformance,
  getComponentPerformanceResult,
  type ComponentPerformanceResult,
  type NetworkPerformanceAnalysis,
  type NetworkPerformanceOptions
} from "./networkPerformance";
import {
  analyzeRouteBalancing,
  type BalancingAnalysisResult,
  type BalancingOptions
} from "./balancing";

export interface RouteComponentBreakdownItem {
  componentId: string;
  componentType: NetworkComponent["type"];
  pressureLossPa: number;
  result: ComponentPerformanceResult;
}

export interface TerminalRouteResult {
  terminalId: string;
  terminalLabel: string;
  nodePath: string[];
  componentIds: string[];
  componentBreakdown: RouteComponentBreakdownItem[];
  totalPressureLossPa: number;
}

export interface RouteAnalysisResult {
  networkPerformance: NetworkPerformanceAnalysis;
  routes: TerminalRouteResult[];
  criticalPath: TerminalRouteResult | null;
  balancing: BalancingAnalysisResult;
}

export function analyzeDuctRoutes(
  graph: DuctNetworkGraph,
  options: NetworkPerformanceOptions & BalancingOptions = {}
): RouteAnalysisResult {
  const ahu = graph.getAhu();

  if (!ahu) {
    throw new Error("Cannot analyze routes without an AHU.");
  }

  const networkPerformance = analyzeDuctNetworkPerformance(graph, options);
  const terminalById = new Map(
    graph.getTerminals().map((terminal) => [terminal.id, terminal])
  );
  const routeComponentIdLookup = createRouteComponentIdLookup(graph);
  const routes = graph.getTerminalPathsFromAhu().map((terminalPath) =>
    createTerminalRouteResult(
      terminalPath,
      ahu.id,
      terminalById,
      routeComponentIdLookup,
      networkPerformance
    )
  );
  const criticalPath =
    routes.reduce<TerminalRouteResult | null>((currentWorst, candidate) => {
      if (!currentWorst) {
        return candidate;
      }

      return candidate.totalPressureLossPa > currentWorst.totalPressureLossPa
        ? candidate
        : currentWorst;
    }, null) ?? null;

  return {
    networkPerformance,
    routes,
    criticalPath,
    balancing: analyzeRouteBalancing(graph, routes, options)
  };
}

function createTerminalRouteResult(
  terminalPath: TerminalPath,
  ahuId: string,
  terminalById: Map<string, TerminalDeviceComponent>,
  routeComponentIdLookup: Map<string, string>,
  networkPerformance: NetworkPerformanceAnalysis
): TerminalRouteResult {
  const terminal = terminalById.get(terminalPath.terminalId);

  if (!terminal) {
    throw new Error(`Unknown terminal "${terminalPath.terminalId}" in route.`);
  }

  const inlineComponentIds = deriveInlineComponentIdsForPath(
    terminalPath.nodePath,
    routeComponentIdLookup
  );
  const componentIds = [ahuId, ...inlineComponentIds, terminal.id];
  const componentBreakdown = componentIds.map((componentId) => {
    const result = getComponentPerformanceResult(networkPerformance, componentId);

    return {
      componentId,
      componentType: result.componentType,
      pressureLossPa: result.totalPressureLossPa,
      result
    };
  });

  return {
    terminalId: terminal.id,
    terminalLabel: terminal.metadata.label,
    nodePath: terminalPath.nodePath,
    componentIds,
    componentBreakdown,
    totalPressureLossPa: componentBreakdown.reduce(
      (sum, item) => sum + item.pressureLossPa,
      0
    )
  };
}

function deriveInlineComponentIdsForPath(
  nodePath: string[],
  routeComponentIdLookup: Map<string, string>
): string[] {
  const componentIds: string[] = [];

  for (let index = 0; index < nodePath.length - 1; index += 1) {
    const fromNodeId = nodePath[index];
    const toNodeId = nodePath[index + 1];
    const key = createNodePairKey(fromNodeId, toNodeId);
    const componentId = routeComponentIdLookup.get(key);

    if (!componentId) {
      throw new Error(
        `No inline component found between nodes "${fromNodeId}" and "${toNodeId}".`
      );
    }

    componentIds.push(componentId);
  }

  return componentIds;
}

function createRouteComponentIdLookup(
  graph: DuctNetworkGraph
): Map<string, string> {
  const lookup = new Map<string, string>();

  for (const edge of graph.getEdges()) {
    lookup.set(
      createNodePairKey(edge.fromNodeId, edge.toNodeId),
      edge.componentId
    );
  }

  return lookup;
}

function createNodePairKey(nodeA: string, nodeB: string): string {
  return [nodeA, nodeB].sort().join("::");
}
