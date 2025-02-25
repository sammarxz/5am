import { Mode } from "../types";

interface StatusLineProps {
  mode: Mode;
}

export function StatusLine({ mode }: StatusLineProps) {
  const getStatusLine = () => {
    switch (mode) {
      case "NORMAL":
        return "-- NORMAL --";
      case "INSERT":
        return "-- INSERT --";
      case "MENU":
        return "-- MENU --";
      default:
        return "";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-black">
      <div className="mx-auto max-w-2xl px-4 py-1 flex justify-between font-mono">
        <div>{getStatusLine()}</div>
        <div className="flex gap-4">
          <span>j/k: move</span>
          <span>i: insert</span>
          <span>n: menu</span>
          <span>SPACE: toggle</span>
          <span>D: delete</span>
          <span>a: about</span>
          <span>?: help</span>
        </div>
      </div>
    </div>
  );
}
