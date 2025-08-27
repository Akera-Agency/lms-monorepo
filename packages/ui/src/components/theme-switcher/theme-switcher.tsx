import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`
        relative h-10 w-10 rounded-full cursor-pointer
        bg-gradient-to-b from-orange-100 to-orange-300
        dark:from-gray-700 dark:to-gray-900
        transition-colors duration-500
        hover:scale-110 active:scale-95
        transform-gpu
        shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-primary/25
      `}
    >
      {theme === 'light' ? (
        <Sun
          key="sun"
          className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            h-5 w-5 text-orange-600
            transition-transform duration-500
            animate-[spin_0.5s_linear]
          "
        />
      ) : (
        <Moon
          key="moon"
          className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            h-4 w-4 text-primary
            transition-transform duration-500
            animate-[spin_0.5s_linear]
          "
        />
      )}

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeSwitcher;
