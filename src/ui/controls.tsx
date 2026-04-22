import type { ToolMode } from "./editorState";

interface ToolbarButton {
  tool: ToolMode;
  label: string;
  hint: string;
}

const toolbarButtons: ToolbarButton[] = [
  {
    tool: "select",
    label: "Select",
    hint: "Pick components, nodes, and properties."
  },
  {
    tool: "duct",
    label: "Draw duct",
    hint: "Click two snapped points to create a straight duct."
  },
  {
    tool: "ahu",
    label: "Place AHU",
    hint: "Place the single air handling unit."
  },
  {
    tool: "supplyTerminal",
    label: "Supply",
    hint: "Place a supply terminal."
  },
  {
    tool: "exhaustTerminal",
    label: "Exhaust",
    hint: "Place an exhaust terminal."
  },
  {
    tool: "outdoorTerminal",
    label: "Outdoor",
    hint: "Place an outdoor air terminal."
  },
  {
    tool: "exhaustAirTerminal",
    label: "Exhaust air",
    hint: "Place an exhaust air terminal."
  }
];

interface ControlsProps {
  activeTool: ToolMode;
  hasSelection: boolean;
  ductDraftActive: boolean;
  onSelectTool: (tool: ToolMode) => void;
  onDeleteSelection: () => void;
  onCancelDuctDraft: () => void;
}

export function Controls({
  activeTool,
  hasSelection,
  ductDraftActive,
  onSelectTool,
  onDeleteSelection,
  onCancelDuctDraft
}: ControlsProps) {
  return (
    <section className="tool-panel" aria-label="Editor tools">
      <div className="tool-panel-header">
        <div>
          <p className="section-kicker">Phase 5</p>
          <h2>2D Drawing System</h2>
        </div>
        <div className="tool-panel-actions">
          <button
            className="ghost-button"
            type="button"
            onClick={onDeleteSelection}
            disabled={!hasSelection}
          >
            Delete selection
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={onCancelDuctDraft}
            disabled={!ductDraftActive}
          >
            Cancel duct
          </button>
        </div>
      </div>

      <div className="tool-grid">
        {toolbarButtons.map((button) => (
          <button
            key={button.tool}
            className={
              activeTool === button.tool
                ? "tool-button is-active"
                : "tool-button"
            }
            type="button"
            onClick={() => onSelectTool(button.tool)}
          >
            <strong>{button.label}</strong>
            <span>{button.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

