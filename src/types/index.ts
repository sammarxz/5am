export type Habit = {
    id: string;
    title: string;
  };
  
  export type Mode = 'NORMAL' | 'INSERT' | 'MENU';
  
  export interface ModalProps {
    show: boolean;
    onClose?: () => void;
  }
  
  export interface HabitListProps {
    habits: Habit[];
    selectedIndex: number;
    completedHabits: string[];
  }
  
  export interface StatusLineProps {
    mode: Mode;
  }
  
  export interface MenuModalProps extends ModalProps {
    habits: Habit[];
    selectedIndex: number;
    onSelect: (habit: Habit) => void;
  }
  
  export interface CreateHabitModalProps extends ModalProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
  }
  
  export interface AboutModalProps extends ModalProps {}
  
  export interface HelpModalProps extends ModalProps {}
  