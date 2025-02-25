import { useCallback, useEffect } from 'react';
import { Mode } from '../types';
import { useHabitStore } from '../store/useHabitStore';

interface UseKeyboardProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedHabitIndex: number;
  setSelectedHabitIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedMenuIndex: number;
  setSelectedMenuIndex: React.Dispatch<React.SetStateAction<number>>;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;
  showProgressModal: boolean;
  setShowProgressModal: (show: boolean) => void;
}

export function useKeyboard({
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
}: UseKeyboardProps) {
  const { 
    habitChain, 
    availableHabits, 
    addHabit, 
    deleteHabit, 
    toggleHabit, 
    addCustomHabit 
  } = useHabitStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check if any modal is open
      if (showHelpModal || showAboutModal || showProgressModal) {
        if (e.key === 'Escape') {
          setShowHelpModal(false);
          setShowAboutModal(false);
          setShowProgressModal(false);
        }
        return;
      }

      if (mode === 'MENU') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        const searchQuery = searchInput?.value || '';
        const filteredHabits = availableHabits.filter(habit => 
          !habitChain.some(h => h.id === habit.id) &&
          habit.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const showCreateOption = searchQuery.trim().length > 0;
        const totalItems = filteredHabits.length + (showCreateOption ? 1 : 0);

        if (e.key === 'Escape') {
          setMode('NORMAL');
          setSelectedMenuIndex(0);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedMenuIndex(i => Math.min(i + 1, totalItems - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedMenuIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedMenuIndex === filteredHabits.length && showCreateOption) {
            const newHabit = addCustomHabit(searchQuery);
            addHabit(newHabit);
          } else if (selectedMenuIndex < filteredHabits.length) {
            addHabit(filteredHabits[selectedMenuIndex]);
          }
          setMode('NORMAL');
          setSelectedMenuIndex(0);
          if (searchInput) searchInput.value = '';
        }
      } else if (mode === 'NORMAL') {
        if (e.key === '?') {
          setShowHelpModal(true);
        } else if (e.key === 'a') {
          setShowAboutModal(true);
        } else if (e.key === 'p') {
          setShowProgressModal(true);
        } else if (e.key === 'i' || e.key === 'n') {
          e.preventDefault();
          setMode('MENU');
          setSelectedMenuIndex(0);
        } else if (e.key === 'D') {
          e.preventDefault();
          deleteHabit(selectedHabitIndex);
        } else if (e.key === 'ArrowDown') {
          setSelectedHabitIndex(i => Math.min(i + 1, habitChain.length - 1));
        } else if (e.key === 'ArrowUp') {
          setSelectedHabitIndex(i => Math.max(i - 1, 0));
        } else if (e.key === ' ') {
          e.preventDefault();
          const habit = habitChain[selectedHabitIndex];
          if (habit?.id) {
            toggleHabit(habit.id);
          }
        }
      }
    },
    [
      mode,
      habitChain,
      availableHabits,
      selectedHabitIndex,
      selectedMenuIndex,
      showHelpModal,
      showAboutModal,
      showProgressModal,
      setMode,
      setSelectedHabitIndex,
      setSelectedMenuIndex,
      setShowHelpModal,
      setShowAboutModal,
      setShowProgressModal,
      addHabit,
      deleteHabit,
      toggleHabit,
      addCustomHabit,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}