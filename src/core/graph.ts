import type { AhuComponent, NetworkComponent, TerminalDeviceComponent } from "../components";
import { isEndpointComponent, isInlineComponent } from "../components";
import { createEdgeFromInlineComponent, getOppositeNodeId, type NetworkEdge } from "./edges";
import type { DuctNode, NodeId } from "./nodes";

export interface TerminalPath {
  terminalId: string;
  nodePath: NodeId[];
}

export class DuctNetworkGraph {
  private readonly nodes = new Map<NodeId, DuctNode>();
  private readonly components = new Map<string, NetworkComponent>();
  private readonly edges = new Map<string, NetworkEdge>();
  private readonly nodeComponentIds = new Map<NodeId, Set<string>>();

  addNode(node: DuctNode): DuctNode {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node "${node.id}" already exists.`);
    }

    this.nodes.set(node.id, node);
    this.nodeComponentIds.set(node.id, new Set());

    return node;
  }

  addComponent<T extends NetworkComponent>(component: T): T {
    if (this.components.has(component.id)) {
      throw new Error(`Component "${component.id}" already exists.`);
    }

    this.assertNodesExist(component.nodeIds);
    this.assertComponentShape(component);
    this.assertEndpointRules(component);

    this.components.set(component.id, component);

    for (const nodeId of component.nodeIds) {
      this.nodeComponentIds.get(nodeId)?.add(component.id);
    }

    if (isInlineComponent(component)) {
      const edge = createEdgeFromInlineComponent(component);
      this.edges.set(edge.id, edge);
    }

    return component;
  }

  getNodes(): DuctNode[] {
    return [...this.nodes.values()];
  }

  getComponents(): NetworkComponent[] {
    return [...this.components.values()];
  }

  getEdges(): NetworkEdge[] {
    return [...this.edges.values()];
  }

  getNode(nodeId: NodeId): DuctNode {
    const node = this.nodes.get(nodeId);

    if (!node) {
      throw new Error(`Unknown node "${nodeId}".`);
    }

    return node;
  }

  getComponent(componentId: string): NetworkComponent {
    const component = this.components.get(componentId);

    if (!component) {
      throw new Error(`Unknown component "${componentId}".`);
    }

    return component;
  }

  getConnectedComponents(nodeId: NodeId): NetworkComponent[] {
    this.getNode(nodeId);

    return [...(this.nodeComponentIds.get(nodeId) ?? new Set<string>())].map(
      (componentId) => this.getComponent(componentId)
    );
  }

  getAdjacentNodeIds(nodeId: NodeId): NodeId[] {
    this.getNode(nodeId);

    const adjacent = new Set<NodeId>();

    for (const edge of this.edges.values()) {
      const opposite = getOppositeNodeId(edge, nodeId);

      if (opposite) {
        adjacent.add(opposite);
      }
    }

    return [...adjacent];
  }

  getReachableNodeIds(startNodeId: NodeId): NodeId[] {
    this.getNode(startNodeId);

    const queue: NodeId[] = [startNodeId];
    const visited = new Set<NodeId>([startNodeId]);

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;

      for (const neighborNodeId of this.getAdjacentNodeIds(currentNodeId)) {
        if (!visited.has(neighborNodeId)) {
          visited.add(neighborNodeId);
          queue.push(neighborNodeId);
        }
      }
    }

    return [...visited];
  }

  findNodePath(startNodeId: NodeId, endNodeId: NodeId): NodeId[] | null {
    this.getNode(startNodeId);
    this.getNode(endNodeId);

    if (startNodeId === endNodeId) {
      return [startNodeId];
    }

    const queue: NodeId[] = [startNodeId];
    const previousNodeIds = new Map<NodeId, NodeId | null>([[startNodeId, null]]);

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;

      for (const neighborNodeId of this.getAdjacentNodeIds(currentNodeId)) {
        if (previousNodeIds.has(neighborNodeId)) {
          continue;
        }

        previousNodeIds.set(neighborNodeId, currentNodeId);

        if (neighborNodeId === endNodeId) {
          return this.reconstructPath(previousNodeIds, endNodeId);
        }

        queue.push(neighborNodeId);
      }
    }

    return null;
  }

  getAhu(): AhuComponent | null {
    return (
      this.getComponents().find(
        (component): component is AhuComponent => component.type === "ahu"
      ) ?? null
    );
  }

  getTerminals(): TerminalDeviceComponent[] {
    return this.getComponents().filter(
      (component): component is TerminalDeviceComponent =>
        component.type === "terminal"
    );
  }

  getReachableTerminalIdsFromAhu(): string[] {
    return this.getTerminalPathsFromAhu().map((terminalPath) => terminalPath.terminalId);
  }

  getTerminalPathsFromAhu(): TerminalPath[] {
    const ahu = this.getAhu();

    if (!ahu) {
      return [];
    }

    const ahuNodeId = ahu.nodeIds[0];

    return this.getTerminals()
      .map((terminal) => ({
        terminalId: terminal.id,
        nodePath: this.findNodePath(ahuNodeId, terminal.nodeIds[0])
      }))
      .filter((terminalPath): terminalPath is TerminalPath => terminalPath.nodePath !== null);
  }

  private assertNodesExist(nodeIds: readonly NodeId[]): void {
    for (const nodeId of nodeIds) {
      if (!this.nodes.has(nodeId)) {
        throw new Error(`Component references unknown node "${nodeId}".`);
      }
    }
  }

  private assertComponentShape(component: NetworkComponent): void {
    const componentId = component.id;

    if (component.type === "ahu" || component.type === "terminal") {
      if (!isEndpointComponent(component)) {
        throw new Error(`Component "${componentId}" must attach to exactly one node.`);
      }

      return;
    }

    if (!isInlineComponent(component)) {
      throw new Error(`Component "${componentId}" must connect exactly two nodes.`);
    }

    if (component.nodeIds[0] === component.nodeIds[1]) {
      throw new Error(`Component "${componentId}" cannot connect the same node twice.`);
    }
  }

  private assertEndpointRules(component: NetworkComponent): void {
    if (!isEndpointComponent(component)) {
      return;
    }

    if (component.type === "ahu" && this.getAhu()) {
      throw new Error("Graph already contains an AHU component.");
    }

    const [nodeId] = component.nodeIds;
    const existingEndpointComponent = this.getConnectedComponents(nodeId).find(
      (candidate) => isEndpointComponent(candidate)
    );

    if (existingEndpointComponent) {
      throw new Error(
        `Node "${nodeId}" already has endpoint component "${existingEndpointComponent.id}".`
      );
    }
  }

  private reconstructPath(
    previousNodeIds: Map<NodeId, NodeId | null>,
    endNodeId: NodeId
  ): NodeId[] {
    const path: NodeId[] = [];
    let currentNodeId: NodeId | null = endNodeId;

    while (currentNodeId) {
      path.unshift(currentNodeId);
      currentNodeId = previousNodeIds.get(currentNodeId) ?? null;
    }

    return path;
  }
}
