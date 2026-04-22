import { createAhu, createTerminalDevice } from "../components";
import { createSampleDuctNetwork } from "./examples";
import { DuctNetworkGraph } from "./graph";
import { createNode } from "./nodes";

describe("DuctNetworkGraph", () => {
  it("creates a small traversable network from the AHU to all terminals", () => {
    const graph = createSampleDuctNetwork();

    expect(graph.getNodes()).toHaveLength(4);
    expect(graph.getEdges()).toHaveLength(3);
    expect(graph.getTerminals()).toHaveLength(2);
    expect(graph.getReachableTerminalIdsFromAhu()).toEqual([
      "terminal-room-a",
      "terminal-room-b"
    ]);
    expect(graph.getTerminalPathsFromAhu()).toEqual([
      {
        terminalId: "terminal-room-a",
        nodePath: ["node-ahu", "node-main", "node-room-a"]
      },
      {
        terminalId: "terminal-room-b",
        nodePath: ["node-ahu", "node-main", "node-room-b"]
      }
    ]);
  });

  it("returns reachable nodes with breadth-first traversal", () => {
    const graph = createSampleDuctNetwork();

    expect(graph.getReachableNodeIds("node-ahu")).toEqual([
      "node-ahu",
      "node-main",
      "node-room-a",
      "node-room-b"
    ]);
  });

  it("rejects multiple endpoint components on the same node", () => {
    const graph = new DuctNetworkGraph();

    graph.addNode(
      createNode({
        id: "node-1",
        kind: "endpoint",
        position: { x: 0, y: 0, z: 0 }
      })
    );

    graph.addComponent(
      createAhu({
        id: "ahu-1",
        nodeId: "node-1"
      })
    );

    expect(() =>
      graph.addComponent(
        createTerminalDevice({
          id: "terminal-1",
          nodeId: "node-1",
          terminalType: "supply",
          designFlowRateLps: 120
        })
      )
    ).toThrow(/already has endpoint component/i);
  });
});

