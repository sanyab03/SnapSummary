import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeSwitcher = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.getComputedStyle(document.body).backgroundColor !== "rgb(255, 255, 255)";
  };

  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    const body = document.body;
    if (dark) {
      body.classList.add("for_dark_theme");
      body.classList.remove("for_light_theme");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("for_light_theme");
      body.classList.remove("for_dark_theme");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="absolute top-5 right-5 z-50">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
            className="sr-only"
          />
          <div className="block w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"></div>
          <div
            className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform bg-white shadow-md ${
              dark ? "translate-x-1" : "translate-x-7"
            }`}
          >
            {dark ? (
              <MoonIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <SunIcon className="w-4 h-4 text-orange-500" />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
