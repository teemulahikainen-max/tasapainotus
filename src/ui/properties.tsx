import type { NetworkComponent } from "../components";
import type { DuctNode } from "../core/nodes";

interface PropertiesProps {
  selectedComponent: NetworkComponent | null;
  selectedNode: DuctNode | null;
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

export function Properties({
  selectedComponent,
  selectedNode,
  onNodeLabelChange,
  onComponentLabelChange,
  onAhuSystemTypeChange,
  onTerminalFlowRateChange,
  onTerminalTypeChange,
  onDuctDiameterChange,
  onDuctLocalLossChange
}: PropertiesProps) {
  return (
    <section className="sidebar-section" aria-label="Properties">
      <div className="sidebar-section-header">
        <p className="section-kicker">Selection</p>
        <h3>Properties</h3>
      </div>

      {!selectedComponent && !selectedNode ? (
        <p className="sidebar-empty">
          Select a node or component to inspect and edit its properties.
        </p>
      ) : null}

      {selectedNode ? (
        <div className="property-group">
          <label className="property-field">
            <span>Node label</span>
            <input
              type="text"
              value={selectedNode.metadata.label ?? ""}
              onChange={(event) => onNodeLabelChange(event.target.value)}
            />
          </label>
          <div className="property-meta">
            <span>Node ID</span>
            <strong>{selectedNode.id}</strong>
          </div>
          <div className="property-meta">
            <span>Position</span>
            <strong>
              {selectedNode.position.x.toFixed(1)} m, {selectedNode.position.y.toFixed(1)} m
            </strong>
          </div>
        </div>
      ) : null}

      {selectedComponent?.type === "ahu" ? (
        <div className="property-group">
          <label className="property-field">
            <span>Label</span>
            <input
              type="text"
              value={selectedComponent.metadata.label}
              onChange={(event) => onComponentLabelChange(event.target.value)}
            />
          </label>
          <label className="property-field">
            <span>System type</span>
            <select
              value={selectedComponent.metadata.systemType}
              onChange={(event) =>
                onAhuSystemTypeChange(
                  event.target.value as "supply" | "exhaust" | "mixed"
                )
              }
            >
              <option value="supply">Supply</option>
              <option value="exhaust">Exhaust</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
        </div>
      ) : null}

      {selectedComponent?.type === "terminal" ? (
        <div className="property-group">
          <label className="property-field">
            <span>Label</span>
            <input
              type="text"
              value={selectedComponent.metadata.label}
              onChange={(event) => onComponentLabelChange(event.target.value)}
            />
          </label>
          <label className="property-field">
            <span>Terminal type</span>
            <select
              value={selectedComponent.metadata.terminalType}
              onChange={(event) =>
                onTerminalTypeChange(
                  event.target.value as
                    | "supply"
                    | "exhaust"
                    | "outdoor"
                    | "exhaustAir"
                )
              }
            >
              <option value="supply">Supply</option>
              <option value="exhaust">Exhaust</option>
              <option value="outdoor">Outdoor</option>
              <option value="exhaustAir">Exhaust air</option>
            </select>
          </label>
          <label className="property-field">
            <span>Design flow (L/s)</span>
            <input
              type="number"
              min="1"
              step="10"
              value={selectedComponent.flow.designFlowRateLps ?? 0}
              onChange={(event) =>
                onTerminalFlowRateChange(Number(event.target.value))
              }
            />
          </label>
        </div>
      ) : null}

      {selectedComponent?.type === "ductSegment" ? (
        <div className="property-group">
          <label className="property-field">
            <span>Label</span>
            <input
              type="text"
              value={selectedComponent.metadata.label ?? ""}
              onChange={(event) => onComponentLabelChange(event.target.value)}
            />
          </label>
          <label className="property-field">
            <span>Diameter (mm)</span>
            <input
              type="number"
              min="80"
              step="10"
              value={selectedComponent.geometry.diameterMm}
              onChange={(event) =>
                onDuctDiameterChange(Number(event.target.value))
              }
            />
          </label>
          <label className="property-field">
            <span>Local loss coefficient</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={selectedComponent.metadata.localLossCoefficient}
              onChange={(event) =>
                onDuctLocalLossChange(Number(event.target.value))
              }
            />
          </label>
          <div className="property-meta">
            <span>Length</span>
            <strong>{selectedComponent.geometry.lengthMeters.toFixed(2)} m</strong>
          </div>
        </div>
      ) : null}
    </section>
  );
}

