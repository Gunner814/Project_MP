import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTimelineStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-20 right-6 z-[99999] p-3 rounded-lg bg-bg-secondary border-2 border-accent-primary
                 hover:bg-bg-hover hover:scale-110 transition-all duration-200 shadow-2xl group cursor-pointer"
      aria-label="Toggle theme"
      style={{ pointerEvents: 'auto' }}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-accent-warning group-hover:rotate-180 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-accent-primary group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
