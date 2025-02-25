import { Habit } from "../types";

interface HabitListProps {
  habits: Habit[];
  selectedIndex: number;
  completedHabits: string[];
}

export function HabitList({
  habits,
  selectedIndex,
  completedHabits,
}: HabitListProps) {
  return (
    <div className="space-y-1">
      {habits.map((habit, index) => (
        <div
          key={habit.id}
          className={`flex items-center p-1 transition-colors ${
            selectedIndex === index ? "bg-blink" : ""
          }`}
        >
          <span className="w-6 text-left pl-1 text-green-500/50">
            {index + 1}
          </span>
          <span className="mr-2">
            {completedHabits.includes(habit.id) ? "✓" : " "}
          </span>
          <span>{habit.title}</span>
        </div>
      ))}
    </div>
  );
}
