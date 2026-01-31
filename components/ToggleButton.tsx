"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const ToggleButton = () => {
  // Gunakan fungsi inisialisasi agar pengecekan DOM hanya jalan sekali di awal
  const [isDark, setIsDark] = useState(() => {
    // Cek apakah kita di browser (bukan server)
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDarkState = !isDark;

    if (newDarkState) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newDarkState);
  };

  return (
    <Button
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden bg-primary/0 hover:bg-primary/10  text-foreground"
    >
      <Sun
        className={`text-muted-foreground h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />

      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ToggleButton;
