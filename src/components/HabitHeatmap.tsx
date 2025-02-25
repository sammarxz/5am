interface HabitHeatmapProps {
  history: Array<{
    date: string;
    completedHabits: number;
    totalHabits: number;
  }>;
}

function getWeeksArray(history: HabitHeatmapProps["history"]) {
  const weeks: Array<typeof history> = [];
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentWeek: typeof history = [];
  let currentDate = new Date(sortedHistory[0]?.date || new Date());
  const endDate = new Date();

  while (currentDate <= endDate) {
    const dateStr = currentDate.toDateString();
    const dayData = sortedHistory.find((d) => d.date === dateStr) || {
      date: dateStr,
      completedHabits: 0,
      totalHabits: 0,
    };

    currentWeek.push(dayData);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getColor(completed: number, total: number) {
  if (total === 0) return "bg-green-500/5";
  const percentage = completed / total;
  if (percentage === 0) return "bg-green-500/5";
  if (percentage <= 0.25) return "bg-green-500/20";
  if (percentage <= 0.5) return "bg-green-500/40";
  if (percentage <= 0.75) return "bg-green-500/60";
  return "bg-green-500/80";
}

export function HabitHeatmap({ history }: HabitHeatmapProps) {
  const weeks = getWeeksArray(history);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="w-full min-w-0">
      <div className="flex gap-1">
        {/* Mês labels */}
        <div className="w-6 shrink-0">
          {monthNames.map((month, i) => (
            <div
              key={month}
              className="h-4 text-xs text-green-500/50"
              style={{ display: i % 2 === 0 ? "block" : "none" }}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Grid de células */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1 min-w-fit">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => {
                  const date = new Date(day.date);
                  return (
                    <div
                      key={day.date}
                      className={`w-4 h-4 rounded-sm ${getColor(
                        day.completedHabits,
                        day.totalHabits
                      )}`}
                      title={`${date.toLocaleDateString()}: ${
                        day.completedHabits
                      }/${day.totalHabits} habits completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex items-center justify-end gap-2 text-xs">
        <span className="text-green-500/50">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-green-500/5" />
          <div className="w-4 h-4 rounded-sm bg-green-500/20" />
          <div className="w-4 h-4 rounded-sm bg-green-500/40" />
          <div className="w-4 h-4 rounded-sm bg-green-500/60" />
          <div className="w-4 h-4 rounded-sm bg-green-500/80" />
        </div>
        <span className="text-green-500/50">More</span>
      </div>
    </div>
  );
}
