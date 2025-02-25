import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useHabitStore } from "../../store/useHabitStore";
import { MenuModalProps } from "../../types";
import { Modal } from "../ui/Modal";

export function MenuModal({
  show,
  onClose,
  selectedIndex,
}: Omit<MenuModalProps, "habits" | "onSelect">) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    availableHabits,
    habitChain,
    addHabit,
    addCustomHabit,
    removeAvailableHabit,
  } = useHabitStore();
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!show) {
      setSearchQuery("");
    }
  }, [show]);

  useEffect(() => {
    if (selectedItemRef.current && listRef.current) {
      const list = listRef.current;
      const item = selectedItemRef.current;

      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const listTop = list.scrollTop;
      const listBottom = listTop + list.offsetHeight;

      if (itemTop < listTop) {
        list.scrollTop = itemTop;
      } else if (itemBottom > listBottom) {
        list.scrollTop = itemBottom - list.offsetHeight;
      }
    }
  }, [selectedIndex]);

  // Handle delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;

      const filteredHabits = availableHabits.filter(
        (habit) =>
          !habitChain.some((h) => h.id === habit.id) &&
          habit.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const input = inputRef.current;
      const isTyping =
        input?.value &&
        input === document.activeElement &&
        input.value.length > 0;

      if (e.key === "d" && !isTyping && selectedIndex < filteredHabits.length) {
        e.preventDefault();
        const selectedHabit = filteredHabits[selectedIndex];
        if (selectedHabit && selectedHabit.id.startsWith("custom-")) {
          removeAvailableHabit(selectedHabit.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    show,
    selectedIndex,
    availableHabits,
    habitChain,
    searchQuery,
    removeAvailableHabit,
  ]);

  const filteredHabits = availableHabits.filter(
    (habit) =>
      !habitChain.some((h) => h.id === habit.id) &&
      habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHabitSelect = (index: number) => {
    if (index === filteredHabits.length) {
      addCustomHabit(searchQuery);
    } else {
      addHabit(filteredHabits[index]);
    }
    onClose?.();
  };

  const handleRemoveHabit = (habitId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeAvailableHabit(habitId);
  };

  const showCreateOption = searchQuery.trim().length > 0;
  const totalItems = filteredHabits.length + (showCreateOption ? 1 : 0);

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Add New Habit"
      description="Search existing habits or create a new one"
    >
      <div className="mb-4">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search or type new habit name..."
          className="w-full bg-black border border-green-500/30 rounded p-2 
                   focus:border-green-500 focus:outline-none font-mono
                   placeholder:text-green-500/30"
          aria-label="Search habits"
          autoFocus
        />
      </div>

      <ScrollArea.Root className="h-[300px]">
        <ScrollArea.Viewport ref={listRef} className="h-full">
          <div
            role="listbox"
            aria-label="Available habits"
            className="space-y-0"
          >
            {filteredHabits.map((habit, index) => (
              <button
                key={habit.id}
                ref={selectedIndex === index ? selectedItemRef : null}
                onClick={() => handleHabitSelect(index)}
                className={`w-full p-2 text-left transition-colors ${
                  selectedIndex === index
                    ? "bg-green-500/10"
                    : "hover:bg-green-500/5"
                }`}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{habit.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-70">Add</span>
                    {habit.id.startsWith("custom-") && (
                      <button
                        onClick={(e) => handleRemoveHabit(habit.id, e)}
                        className="p-1 hover:bg-green-500/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        title="Delete habit"
                        aria-label={`Delete ${habit.title}`}
                      >
                        <Trash2 className="w-4 h-4 opacity-70" />
                      </button>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {showCreateOption && (
              <button
                ref={
                  selectedIndex === filteredHabits.length
                    ? selectedItemRef
                    : null
                }
                onClick={() => handleHabitSelect(filteredHabits.length)}
                className={`w-full p-2 text-left transition-colors ${
                  selectedIndex === filteredHabits.length
                    ? "bg-green-500/10"
                    : "hover:bg-green-500/5"
                }`}
                role="option"
                aria-selected={selectedIndex === filteredHabits.length}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Create "{searchQuery}"</span>
                  <span className="text-sm opacity-70">Create New</span>
                </div>
              </button>
            )}

            {totalItems === 0 && (
              <p className="text-center text-green-500/50 py-4" role="status">
                Type to search or create a new habit
              </p>
            )}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out hover:bg-green-500/10 data-[orientation=vertical]:w-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-green-500/30 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <div className="border-t border-green-500/30 mt-4 pt-4">
        <p className="text-sm text-green-500/50 text-center">
          Use ↑/↓ to navigate, ENTER to select, 'd' to delete custom habits
        </p>
      </div>
    </Modal>
  );
}
