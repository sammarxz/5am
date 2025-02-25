import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

import { Mode } from "./types";
import { useHabitStore } from "./store/useHabitStore";
import { useKeyboard } from "./hooks/useKeyboard";
import { HabitList } from "./components/HabitList";
import {
  AboutModal,
  HelpModal,
  MenuModal,
  ProgressModal,
} from "./components/modals";

import CRTEffect from "./components/CRTEffect";

export default function App() {
  const [mode, setMode] = useState<Mode>("NORMAL");
  const [selectedHabitIndex, setSelectedHabitIndex] = useState(0);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const { habitChain, completedHabits, checkAndResetDay } = useHabitStore();

  useEffect(() => {
    checkAndResetDay();
    const handleFocus = () => checkAndResetDay();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkAndResetDay]);

  useKeyboard({
    mode,
    setMode,
    selectedHabitIndex,
    setSelectedHabitIndex,
    selectedMenuIndex,
    setSelectedMenuIndex,
    showHelpModal,
    setShowHelpModal,
    showAboutModal,
    setShowAboutModal,
    showProgressModal,
    setShowProgressModal,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <CRTEffect>
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-green-500 font-mono text-lg">
        <div className="mx-auto w-full max-w-sm px-4">
          <header className="flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-6 h-6" />
              <span>5:AM Protocol</span>
            </div>
            <p>{currentDate}</p>
            <p>Press ? for help</p>
          </header>

          <HabitList
            habits={habitChain}
            selectedIndex={selectedHabitIndex}
            completedHabits={completedHabits}
          />

          {/* Modals */}
          <MenuModal
            show={mode === "MENU"}
            onClose={() => setMode("NORMAL")}
            selectedIndex={selectedMenuIndex}
          />

          <HelpModal
            show={showHelpModal}
            onClose={() => setShowHelpModal(false)}
          />

          <AboutModal
            show={showAboutModal}
            onClose={() => setShowAboutModal(false)}
          />

          <ProgressModal
            show={showProgressModal}
            onClose={() => setShowProgressModal(false)}
          />
        </div>
      </div>
    </CRTEffect>
  );
}
