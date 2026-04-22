import { createAhu, createDuctSegment, createTerminalDevice } from "../components";
import { createSampleDuctNetwork } from "../core/examples";
import { DuctNetworkGraph } from "../core/graph";
import { createNode } from "../core/nodes";
import { analyzeDuctRoutes } from "./routes";

describe("analyzeRouteBalancing", () => {
  it("compares parallel branches and suggests added resistance for lighter branches", () => {
    const analysis = analyzeDuctRoutes(createSampleDuctNetwork());

    expect(analysis.balancing.branchGroups).toEqual([
      expect.objectContaining({
        nodeId: "node-main",
        nodeLabel: "Main branch junction",
        branchCount: 2,
        terminalCount: 2,
        requiresBalancing: true,
        imbalancePa: expect.closeTo(0.083737, 6),
        branches: [
          expect.objectContaining({
            branchNodeId: "node-room-b",
            branchLabel: "Room B diffuser",
            downstreamPressureLossPa: expect.closeTo(2.009689, 6),
            suggestedAdditionalLossPa: 0
          }),
          expect.objectContaining({
            branchNodeId: "node-room-a",
            branchLabel: "Room A diffuser",
            downstreamPressureLossPa: expect.closeTo(1.925952, 6),
            suggestedAdditionalLossPa: expect.closeTo(0.083737, 6)
          })
        ]
      })
    ]);
    expect(analysis.balancing.maxPressureDifferencePa).toBeCloseTo(0.083737, 6);
  });

  it("keeps equal branches within tolerance", () => {
    const analysis = analyzeDuctRoutes(createBalancedNetwork());

    expect(analysis.balancing.branchGroups).toHaveLength(1);
    expect(analysis.balancing.branchGroups[0]?.requiresBalancing).toBe(false);
    expect(analysis.balancing.maxPressureDifferencePa).toBeCloseTo(0, 6);
  });
});

function createBalancedNetwork(): DuctNetworkGraph {
  const graph = new DuctNetworkGraph();

  graph.addNode(
    createNode({
      id: "node-ahu",
      kind: "endpoint",
      position: { x: 0, y: 0, z: 0 }
    })
  );
  graph.addNode(
    createNode({
      id: "node-split",
      position: { x: 2, y: 0, z: 0 }
    })
  );
  graph.addNode(
    createNode({
      id: "node-left",
      kind: "endpoint",
      position: { x: 4, y: 1, z: 0 }
    })
  );
  graph.addNode(
    createNode({
      id: "node-right",
      kind: "endpoint",
      position: { x: 4, y: -1, z: 0 }
    })
  );

  graph.addComponent(
    createAhu({
      id: "ahu-1",
      nodeId: "node-ahu",
      label: "Balanced AHU"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-main",
      startNodeId: "node-ahu",
      endNodeId: "node-split",
      diameterMm: 315,
      lengthMeters: 2,
      label: "Balanced main"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-left",
      startNodeId: "node-split",
      endNodeId: "node-left",
      diameterMm: 250,
      lengthMeters: 2.2,
      label: "Left branch"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-right",
      startNodeId: "node-split",
      endNodeId: "node-right",
      diameterMm: 250,
      lengthMeters: 2.2,
      label: "Right branch"
    })
  );
  graph.addComponent(
    createTerminalDevice({
      id: "terminal-left",
      nodeId: "node-left",
      terminalType: "supply",
      designFlowRateLps: 150,
      label: "Left diffuser"
    })
  );
  graph.addComponent(
    createTerminalDevice({
      id: "terminal-right",
      nodeId: "node-right",
      terminalType: "supply",
      designFlowRateLps: 150,
      label: "Right diffuser"
    })
  );

  return graph;
}
