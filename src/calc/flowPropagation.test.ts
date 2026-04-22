import {
  createAhu,
  createDuctSegment,
  createTerminalDevice
} from "../components";
import { createSampleDuctNetwork } from "../core/examples";
import { DuctNetworkGraph } from "../core/graph";
import { createNode } from "../core/nodes";
import { propagateTerminalFlows } from "./flowPropagation";

describe("propagateTerminalFlows", () => {
  it("sums terminal flows upstream to each duct segment and the AHU", () => {
    const graph = createSampleDuctNetwork();
    const result = propagateTerminalFlows(graph);

    expect(result.systemFlowRateLps).toBe(400);
    expect(result.nodeFlowRateLpsById).toEqual({
      "node-room-a": 200,
      "node-room-b": 200,
      "node-main": 400,
      "node-ahu": 400
    });
    expect(result.componentFlowRateLpsById).toEqual({
      "duct-branch-a": 200,
      "duct-branch-b": 200,
      "duct-main": 400
    });
  });

  it("rejects cyclic networks because flow direction would be ambiguous", () => {
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
        id: "node-a",
        position: { x: 1, y: 0, z: 0 }
      })
    );
    graph.addNode(
      createNode({
        id: "node-b",
        kind: "endpoint",
        position: { x: 2, y: 0, z: 0 }
      })
    );

    graph.addComponent(
      createAhu({
        id: "ahu-1",
        nodeId: "node-ahu"
      })
    );
    graph.addComponent(
      createDuctSegment({
        id: "duct-1",
        startNodeId: "node-ahu",
        endNodeId: "node-a",
        diameterMm: 315,
        lengthMeters: 1
      })
    );
    graph.addComponent(
      createDuctSegment({
        id: "duct-2",
        startNodeId: "node-a",
        endNodeId: "node-b",
        diameterMm: 250,
        lengthMeters: 1
      })
    );
    graph.addComponent(
      createDuctSegment({
        id: "duct-3",
        startNodeId: "node-b",
        endNodeId: "node-ahu",
        diameterMm: 250,
        lengthMeters: 1
      })
    );
    graph.addComponent(
      createTerminalDevice({
        id: "terminal-1",
        nodeId: "node-b",
        terminalType: "supply",
        designFlowRateLps: 120
      })
    );

    expect(() => propagateTerminalFlows(graph)).toThrow(/tree-shaped/i);
  });
});
