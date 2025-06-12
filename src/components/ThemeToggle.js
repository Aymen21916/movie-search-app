import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaAdjust } from 'react-icons/fa';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system');

  // Initialize theme on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <FaSun className="text-yellow-500" />;
    if (theme === 'dark') return <FaMoon className="text-blue-300" />;
    return <FaAdjust className="text-gray-500" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      <span className="mr-2">{getThemeIcon()}</span>
      <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
        {getThemeLabel()}
      </span>
    </button>
  );
}