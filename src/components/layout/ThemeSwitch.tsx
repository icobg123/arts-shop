"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeSwitchSkeleton } from "./ThemeSwitchSkeleton";
import { Moon, Sun } from "lucide-react";
import { ICON_SIZE } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ThemeSwitchSkeleton />;
  }

  const isLightTheme = resolvedTheme === "light";

  const handleThemeToggle = () => {
    setTheme(isLightTheme ? "night" : "light");
  };

  return (
    <label
      className={cn(`btn swap btn-circle swap-rotate btn-ghost`, className)}
    >
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        checked={!isLightTheme}
        onChange={handleThemeToggle}
        aria-label="Toggle theme"
      />

      {/* sun icon - shown in dark mode */}
      <Sun size={ICON_SIZE} className="swap-off" />

      {/* moon icon - shown in light mode */}
      <Moon size={ICON_SIZE} className="swap-on" />
    </label>
  );
}
