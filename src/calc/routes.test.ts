import { createSampleDuctNetwork } from "../core/examples";
import { analyzeDuctRoutes } from "./routes";

describe("analyzeDuctRoutes", () => {
  it("returns a route breakdown for each terminal and identifies the critical path", () => {
    const analysis = analyzeDuctRoutes(createSampleDuctNetwork());

    expect(analysis.routes).toHaveLength(2);

    expect(analysis.routes).toEqual([
      expect.objectContaining({
        terminalId: "terminal-room-a",
        terminalLabel: "Room A diffuser",
        nodePath: ["node-ahu", "node-main", "node-room-a"],
        componentIds: ["ahu-1", "duct-main", "duct-branch-a", "terminal-room-a"],
        totalPressureLossPa: expect.closeTo(2.5238484296309914, 10)
      }),
      expect.objectContaining({
        terminalId: "terminal-room-b",
        terminalLabel: "Room B diffuser",
        nodePath: ["node-ahu", "node-main", "node-room-b"],
        componentIds: ["ahu-1", "duct-main", "duct-branch-b", "terminal-room-b"],
        totalPressureLossPa: expect.closeTo(2.607585465234198, 10)
      })
    ]);

    expect(analysis.criticalPath).toEqual(
      expect.objectContaining({
        terminalId: "terminal-room-b",
        totalPressureLossPa: expect.closeTo(2.607585465234198, 10)
      })
    );
    expect(analysis.networkPerformance.systemFlowRateLps).toBe(400);
    expect(analysis.balancing.branchGroups).toHaveLength(1);
  });

  it("keeps component-level pressure loss values in the route breakdown", () => {
    const analysis = analyzeDuctRoutes(createSampleDuctNetwork());
    const route = analysis.routes[0];

    expect(route.componentBreakdown).toEqual([
      expect.objectContaining({
        componentId: "ahu-1",
        componentType: "ahu",
        pressureLossPa: 0
      }),
      expect.objectContaining({
        componentId: "duct-main",
        componentType: "ductSegment",
        pressureLossPa: expect.closeTo(0.5978966107572442, 10)
      }),
      expect.objectContaining({
        componentId: "duct-branch-a",
        componentType: "ductSegment",
        pressureLossPa: expect.closeTo(1.9259518188737474, 10)
      }),
      expect.objectContaining({
        componentId: "terminal-room-a",
        componentType: "terminal",
        pressureLossPa: 0
      })
    ]);
  });
});
