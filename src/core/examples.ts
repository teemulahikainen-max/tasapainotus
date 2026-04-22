import { createAhu, createDuctSegment, createTerminalDevice } from "../components";
import { DuctNetworkGraph } from "./graph";
import { createNode } from "./nodes";

export function createSampleDuctNetwork(): DuctNetworkGraph {
  const graph = new DuctNetworkGraph();

  graph.addNode(
    createNode({
      id: "node-ahu",
      kind: "endpoint",
      position: { x: 0, y: 0, z: 0 },
      metadata: { label: "AHU connection" }
    })
  );
  graph.addNode(
    createNode({
      id: "node-main",
      position: { x: 2, y: 0, z: 0 },
      metadata: { label: "Main branch junction" }
    })
  );
  graph.addNode(
    createNode({
      id: "node-room-a",
      kind: "endpoint",
      position: { x: 4, y: 1.5, z: 0 },
      metadata: { label: "Room A terminal connection" }
    })
  );
  graph.addNode(
    createNode({
      id: "node-room-b",
      kind: "endpoint",
      position: { x: 4, y: -1.5, z: 0 },
      metadata: { label: "Room B terminal connection" }
    })
  );

  graph.addComponent(
    createAhu({
      id: "ahu-1",
      nodeId: "node-ahu",
      label: "Main AHU"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-main",
      startNodeId: "node-ahu",
      endNodeId: "node-main",
      diameterMm: 400,
      lengthMeters: 2,
      designFlowRateLps: 400,
      label: "Main trunk"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-branch-a",
      startNodeId: "node-main",
      endNodeId: "node-room-a",
      diameterMm: 250,
      lengthMeters: 2.3,
      designFlowRateLps: 200,
      label: "Room A branch"
    })
  );
  graph.addComponent(
    createDuctSegment({
      id: "duct-branch-b",
      startNodeId: "node-main",
      endNodeId: "node-room-b",
      diameterMm: 250,
      lengthMeters: 2.4,
      designFlowRateLps: 200,
      label: "Room B branch"
    })
  );
  graph.addComponent(
    createTerminalDevice({
      id: "terminal-room-a",
      nodeId: "node-room-a",
      terminalType: "supply",
      designFlowRateLps: 200,
      label: "Room A diffuser"
    })
  );
  graph.addComponent(
    createTerminalDevice({
      id: "terminal-room-b",
      nodeId: "node-room-b",
      terminalType: "supply",
      designFlowRateLps: 200,
      label: "Room B diffuser"
    })
  );

  return graph;
}
