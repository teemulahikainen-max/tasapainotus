import { analyzeDuctRoutes } from "../calc";
import {
  beginDuctDraft,
  buildGraphFromEditorDocument,
  completeDuctDraft,
  createInitialEditorDocument,
  deleteSelection,
  placeComponentAtPoint
} from "./editorState";

describe("editorState", () => {
  it("creates a drawable network that maps cleanly to the graph model", () => {
    let document = createInitialEditorDocument();

    document = placeComponentAtPoint(document, "ahu", { x: 1, y: 2, z: 0 }).document;
    document = placeComponentAtPoint(document, "supplyTerminal", { x: 5, y: 2, z: 0 }).document;

    const draft = beginDuctDraft(document, { x: 1, y: 2, z: 0 });
    document = completeDuctDraft(document, draft, { x: 5, y: 2, z: 0 }).document;

    const graph = buildGraphFromEditorDocument(document);
    const routeAnalysis = analyzeDuctRoutes(graph);

    expect(graph.getNodes()).toHaveLength(2);
    expect(graph.getEdges()).toHaveLength(1);
    expect(routeAnalysis.routes).toHaveLength(1);
    expect(routeAnalysis.criticalPath?.terminalId).toBe("terminal-4");
  });

  it("deletes components and prunes isolated nodes", () => {
    let document = createInitialEditorDocument();

    const ahuResult = placeComponentAtPoint(document, "ahu", { x: 1, y: 1, z: 0 });
    document = ahuResult.document;

    document = deleteSelection(document, {
      kind: "component",
      id: "ahu-2"
    });

    expect(document.components).toHaveLength(0);
    expect(document.nodes).toHaveLength(0);
  });
});
