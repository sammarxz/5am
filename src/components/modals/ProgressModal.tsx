import { ModalProps } from "../../types";
import { Modal } from "../ui/Modal";
import { HabitHeatmap } from "../HabitHeatmap";
import { useHabitStore } from "../../store/useHabitStore";

export interface ProgressModalProps extends ModalProps {}

export function ProgressModal({ show, onClose }: ProgressModalProps) {
  const { history } = useHabitStore();

  // Calculate completion rate for current month
  const currentMonth = new Date().getMonth();
  const currentMonthHistory = history.filter((day) => {
    const date = new Date(day.date);
    return date.getMonth() === currentMonth;
  });

  // Calcula a taxa total de conclusão de hábitos no mês
  const totalHabitsInMonth = currentMonthHistory.reduce(
    (sum, day) => sum + day.totalHabits,
    0
  );
  const totalCompletedHabits = currentMonthHistory.reduce(
    (sum, day) => sum + day.completedHabits,
    0
  );

  // Calcula a taxa de conclusão como uma porcentagem dos hábitos completados
  const completionRate =
    totalHabitsInMonth > 0
      ? Math.round((totalCompletedHabits / totalHabitsInMonth) * 100)
      : 0;

  // Calcula os dias "perfeitos" (todos os hábitos completados)
  const perfectDays = currentMonthHistory.filter(
    (day) => day.completedHabits === day.totalHabits && day.totalHabits > 0
  ).length;

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Progress Overview"
      description="Your habit completion heatmap"
    >
      <div className="space-y-6">
        <div className="p-4 border border-green-500/30 rounded">
          <h3 className="text-center mb-2">Current Month Progress</h3>
          <p className="text-center text-2xl">
            {completionRate}%{" "}
            <span className="text-sm text-green-500/50">completion rate</span>
          </p>
          <div className="text-center text-sm text-green-500/50 mt-2">
            <p>
              {totalCompletedHabits} habits completed out of{" "}
              {totalHabitsInMonth} total
            </p>
            <p className="mt-1">
              {perfectDays} perfect {perfectDays === 1 ? "day" : "days"} this
              month
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Yearly Overview</h3>
          <HabitHeatmap history={history} />
        </div>

        <div className="text-center text-sm text-green-500/50">
          Each cell represents a day. Darker colors indicate more habits
          completed.
        </div>
      </div>
    </Modal>
  );
}
