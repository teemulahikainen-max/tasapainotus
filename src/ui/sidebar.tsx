import type { RouteAnalysisResult } from "../calc";
import type { NetworkComponent } from "../components";
import type { DuctNode } from "../core/nodes";
import { Properties } from "./properties";

interface SidebarProps {
  documentCounts: {
    nodes: number;
    ducts: number;
    terminals: number;
  };
  analysis: RouteAnalysisResult | null;
  analysisError: string | null;
  selectedNode: DuctNode | null;
  selectedComponent: NetworkComponent | null;
  onNodeLabelChange: (value: string) => void;
  onComponentLabelChange: (value: string) => void;
  onAhuSystemTypeChange: (value: "supply" | "exhaust" | "mixed") => void;
  onTerminalFlowRateChange: (value: number) => void;
  onTerminalTypeChange: (
    value: "supply" | "exhaust" | "outdoor" | "exhaustAir"
  ) => void;
  onDuctDiameterChange: (value: number) => void;
  onDuctLocalLossChange: (value: number) => void;
}

export function Sidebar({
  documentCounts,
  analysis,
  analysisError,
  selectedNode,
  selectedComponent,
  onNodeLabelChange,
  onComponentLabelChange,
  onAhuSystemTypeChange,
  onTerminalFlowRateChange,
  onTerminalTypeChange,
  onDuctDiameterChange,
  onDuctLocalLossChange
}: SidebarProps) {
  return (
    <aside className="analysis-sidebar">
      <section className="sidebar-section">
        <div className="sidebar-section-header">
          <p className="section-kicker">Live overview</p>
          <h3>Network status</h3>
        </div>
        <div className="metric-grid">
          <article>
            <span>Nodes</span>
            <strong>{documentCounts.nodes}</strong>
          </article>
          <article>
            <span>Ducts</span>
            <strong>{documentCounts.ducts}</strong>
          </article>
          <article>
            <span>Terminals</span>
            <strong>{documentCounts.terminals}</strong>
          </article>
          <article>
            <span>System flow</span>
            <strong>
              {analysis ? `${analysis.networkPerformance.systemFlowRateLps} L/s` : "N/A"}
            </strong>
          </article>
          <article>
            <span>Balancing groups</span>
            <strong>{analysis ? analysis.balancing.branchGroups.length : "N/A"}</strong>
          </article>
          <article>
            <span>Max imbalance</span>
            <strong>
              {analysis
                ? `${analysis.balancing.maxPressureDifferencePa.toFixed(2)} Pa`
                : "N/A"}
            </strong>
          </article>
        </div>
        {!analysis && !analysisError ? (
          <p className="sidebar-empty">
            Place an AHU, add one or more terminals, then connect them with ducts
            to unlock route analysis.
          </p>
        ) : null}
        {analysisError ? (
          <p className="sidebar-warning">{analysisError}</p>
        ) : null}
      </section>

      <Properties
        selectedNode={selectedNode}
        selectedComponent={selectedComponent}
        onNodeLabelChange={onNodeLabelChange}
        onComponentLabelChange={onComponentLabelChange}
        onAhuSystemTypeChange={onAhuSystemTypeChange}
        onTerminalFlowRateChange={onTerminalFlowRateChange}
        onTerminalTypeChange={onTerminalTypeChange}
        onDuctDiameterChange={onDuctDiameterChange}
        onDuctLocalLossChange={onDuctLocalLossChange}
      />

      <section className="sidebar-section" aria-label="Route analysis">
        <div className="sidebar-section-header">
          <p className="section-kicker">Routes</p>
          <h3>Critical path</h3>
        </div>
        {analysis?.criticalPath ? (
          <article className="critical-card">
            <span>{analysis.criticalPath.terminalLabel}</span>
            <strong>{analysis.criticalPath.totalPressureLossPa.toFixed(2)} Pa</strong>
            <p>{analysis.criticalPath.componentIds.join(" -> ")}</p>
          </article>
        ) : (
          <p className="sidebar-empty">
            Connected terminal routes appear here once the network is analyzable.
          </p>
        )}

        <div className="route-list">
          {analysis?.routes.map((route) => (
            <article
              key={route.terminalId}
              className={
                analysis.criticalPath?.terminalId === route.terminalId
                  ? "route-card is-critical"
                  : "route-card"
              }
            >
              <header>
                <div>
                  <strong>{route.terminalLabel}</strong>
                  <span>{route.nodePath.length - 1} segments</span>
                </div>
                <strong>{route.totalPressureLossPa.toFixed(2)} Pa</strong>
              </header>
              {analysis.criticalPath?.terminalId !== route.terminalId ? (
                <span>
                  {(analysis.criticalPath!.totalPressureLossPa - route.totalPressureLossPa).toFixed(2)}
                  {" "}
                  Pa below critical
                </span>
              ) : (
                <span>Reference route for the highest required pressure</span>
              )}
              <p>{route.componentIds.join(" -> ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sidebar-section" aria-label="Balancing analysis">
        <div className="sidebar-section-header">
          <p className="section-kicker">Balancing</p>
          <h3>Parallel branches</h3>
        </div>
        {analysis ? (
          <>
            <article
              className={
                analysis.balancing.requiresBalancing
                  ? "balance-summary balance-summary-warning"
                  : "balance-summary balance-summary-ok"
              }
            >
              <span>
                {analysis.balancing.requiresBalancing
                  ? "Balancing suggested"
                  : "Branches within tolerance"}
              </span>
              <strong>
                {analysis.balancing.maxPressureDifferencePa.toFixed(2)} Pa
              </strong>
              <p>
                {analysis.balancing.requiresBalancing
                  ? "Lighter branches can be trimmed toward the highest-loss reference branch."
                  : "Current parallel routes are close enough that no added balancing loss is suggested."}
              </p>
            </article>

            {analysis.balancing.branchGroups.length > 0 ? (
              <div className="balance-group-list">
                {analysis.balancing.branchGroups.map((group) => (
                  <article
                    key={group.nodeId}
                    className={
                      group.requiresBalancing
                        ? "balance-group balance-group-warning"
                        : "balance-group"
                    }
                  >
                    <header>
                      <div>
                        <strong>{group.nodeLabel}</strong>
                        <span>
                          {group.branchCount} branches, {group.terminalCount} terminals
                        </span>
                      </div>
                      <strong>{group.imbalancePa.toFixed(2)} Pa</strong>
                    </header>
                    <p>
                      Tolerance {group.tolerancePa.toFixed(2)} Pa, reference{" "}
                      {group.referencePressureLossPa.toFixed(2)} Pa
                    </p>
                    <div className="balance-branch-list">
                      {group.branches.map((branch) => (
                        <div key={branch.branchNodeId} className="balance-branch">
                          <div>
                            <strong>{branch.branchLabel}</strong>
                            <span>
                              {branch.representativeTerminalLabel}
                              {branch.terminalIds.length > 1
                                ? ` (${branch.terminalIds.length} terminals)`
                                : ""}
                            </span>
                          </div>
                          <div className="balance-branch-metrics">
                            <strong>{branch.downstreamPressureLossPa.toFixed(2)} Pa</strong>
                            <span>
                              {branch.suggestedAdditionalLossPa > 0
                                ? `Add ${branch.suggestedAdditionalLossPa.toFixed(2)} Pa`
                                : "Reference"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="sidebar-empty">
                Balancing groups appear when two or more terminal routes split in parallel.
              </p>
            )}
          </>
        ) : (
          <p className="sidebar-empty">
            Balancing checks become available after route analysis is unlocked.
          </p>
        )}
      </section>
    </aside>
  );
}
