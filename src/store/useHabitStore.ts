import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit } from '../types';

interface DayProgress {
  date: string;
  completedHabits: number;
  totalHabits: number;
}

interface HabitState {
  habitChain: Habit[];
  availableHabits: Habit[];
  completedHabits: string[];
  lastResetDate: string;
  history: DayProgress[];
  addHabit: (habit: Habit) => void;
  deleteHabit: (index: number) => void;
  toggleHabit: (habitId: string) => void;
  addCustomHabit: (title: string) => Habit;
  removeAvailableHabit: (habitId: string) => void;
  checkAndResetDay: () => void;
  updateTodayHistory: () => void;
}

const defaultHabits: Habit[] = [
  { id: 'hydrate', title: 'Hydrate' },
  { id: 'meditate', title: 'Meditate' },
  { id: 'exercise', title: 'Exercise' },
  { id: 'read', title: 'Read' },
];

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habitChain: [{ id: 'wakeup', title: 'Wake up Neo' }],
      availableHabits: defaultHabits,
      completedHabits: [],
      lastResetDate: new Date().toDateString(),
      history: [],

      // Função auxiliar para atualizar o histórico do dia atual
      updateTodayHistory: () => {
        set(state => {
          const currentDate = new Date().toDateString();
          const currentProgress: DayProgress = {
            date: currentDate,
            completedHabits: state.completedHabits.length,
            totalHabits: state.habitChain.length
          };

          // Remove a entrada antiga do dia atual (se existir) e adiciona a nova
          const updatedHistory = state.history.filter(day => day.date !== currentDate);
          return {
            ...state,
            history: [currentProgress, ...updatedHistory].slice(0, 365)
          };
        });
      },

      addHabit: (habit: Habit) => {
        if (!habit?.id) return;
        
        const { habitChain } = get();
        const isAlreadyInChain = habitChain.some(h => h.id === habit.id);
        
        if (isAlreadyInChain) return;

        set(state => ({
          habitChain: [...state.habitChain, habit],
          availableHabits: state.availableHabits.filter(h => h.id !== habit.id)
        }));

        // Atualiza o histórico após adicionar o hábito
        get().updateTodayHistory();
      },

      deleteHabit: (index: number) => {
        const { habitChain } = get();
        
        if (index < 0 || index >= habitChain.length) return;
        if (index === 0) return; // Prevent deleting wake-up habit

        const habitToDelete = habitChain[index];
        if (!habitToDelete) return;

        set(state => {
          const newState = { ...state };
          newState.availableHabits = [...state.availableHabits, habitToDelete];
          newState.habitChain = state.habitChain.filter((_, i) => i !== index);
          newState.completedHabits = state.completedHabits.filter(
            id => id !== habitToDelete.id
          );
          
          return newState;
        });

        // Atualiza o histórico após deletar o hábito
        get().updateTodayHistory();
      },

      toggleHabit: (habitId: string) => {
        if (!habitId) return;
        
        get().checkAndResetDay();
        
        set(state => {
          const newCompletedHabits = state.completedHabits.includes(habitId)
            ? state.completedHabits.filter(id => id !== habitId)
            : [...state.completedHabits, habitId];

          return {
            ...state,
            completedHabits: newCompletedHabits,
          };
        });

        // Atualiza o histórico após alternar o hábito
        get().updateTodayHistory();
      },

      addCustomHabit: (title: string) => {
        if (!title.trim()) throw new Error('Title is required');

        const newHabit: Habit = {
          id: `custom-${Date.now()}`,
          title: title.trim()
        };

        set(state => ({
          availableHabits: [...state.availableHabits, newHabit]
        }));

        return newHabit;
      },

      removeAvailableHabit: (habitId: string) => {
        if (!habitId || !habitId.startsWith('custom-')) return;

        set(state => ({
          availableHabits: state.availableHabits.filter(h => h.id !== habitId),
          habitChain: state.habitChain.filter(h => h.id !== habitId),
          completedHabits: state.completedHabits.filter(id => id !== habitId)
        }));

        // Atualiza o histórico após remover o hábito disponível (se estiver na chain)
        if (get().habitChain.some(h => h.id === habitId)) {
          get().updateTodayHistory();
        }
      },

      checkAndResetDay: () => {
        const currentDate = new Date().toDateString();
        const { lastResetDate, habitChain, completedHabits } = get();

        if (currentDate !== lastResetDate) {
          // Save progress before resetting
          const progress: DayProgress = {
            date: lastResetDate,
            completedHabits: completedHabits.length,
            totalHabits: habitChain.length
          };

          set(state => ({
            completedHabits: [],
            lastResetDate: currentDate,
            habitChain: [{ id: 'wakeup', title: 'Wake up Neo' }],
            availableHabits: defaultHabits,
            history: [progress, ...state.history].slice(0, 365)
          }));
        }
      },
    }),
    {
      name: '5am-protocol-habits',
      version: 2,
    }
  )
);