import { Modal } from "../ui/Modal";
import { HelpModalProps } from "../../types";

const shortcuts = [
  { key: "↑/↓", description: "Move up/down" },
  { key: "n", description: "Open habit menu" },
  { key: "SPACE", description: "Toggle habit completion" },
  { key: "Shift+D", description: "Delete selected habit" },
  { key: "p", description: "Show progress heatmap" },
  { key: "a", description: "Show about" },
  { key: "ESC", description: "Return to normal mode" },
] as const;

export function HelpModal({ show, onClose }: HelpModalProps) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Keyboard Shortcuts"
      description="List of available keyboard shortcuts for 5AM Protocol"
    >
      <div className="space-y-2" role="list">
        {shortcuts.map(({ key, description }) => (
          <div key={key} className="flex items-center" role="listitem">
            <kbd className="bg-green-500/10 border border-green-500/30 rounded px-2 py-1 min-w-[80px] text-center mr-4">
              {key}
            </kbd>
            <span>{description}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
