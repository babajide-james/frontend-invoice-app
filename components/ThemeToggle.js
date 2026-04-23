import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm7.25-4.25a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5ZM6.25 12a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Zm9.396-5.646a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 1 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 0-1.061Zm-8.353 8.353a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 0-1.061Zm9.414 1.06a.75.75 0 1 1 1.06 1.061l-1.06 1.06a.75.75 0 0 1-1.061-1.06l1.06-1.06ZM8.354 6.354a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM12 16.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V17a.75.75 0 0 1 .75-.75Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M14.53 3.47a.75.75 0 0 1 .822.168 8.25 8.25 0 1 0 5.01 9.927.75.75 0 0 1 1.205-.364.75.75 0 0 1 .228.75 9.75 9.75 0 1 1-7.098-11.2.75.75 0 0 1 .167.719.75.75 0 0 1-.334.43Z"
          />
        </svg>
      )}
    </button>
  );
}
