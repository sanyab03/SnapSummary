
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // ensure this is installed

const ThemeSwitcher = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="absolute top-5 right-5">
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
