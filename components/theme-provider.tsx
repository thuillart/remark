"use client";

import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import React from "react";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    const isTypingField = (element: HTMLElement) => {
      return (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.isContentEditable
      );
    };

    const isThemeToggleKey = (event: KeyboardEvent) => {
      return (
        event.key.toLowerCase() === "m" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      );
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (!isTypingField(target) && isThemeToggleKey(event)) {
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setTheme, theme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      disableTransitionOnChange
    >
      <ThemeToggle />
      {children}
    </NextThemeProvider>
  );
}
