import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-logo" aria-hidden="true">
        <img src="/logo.jpg" alt="Logo" className="app-logo__img" />
      </div>

      <div className="app-sidebar__footer">
        <ThemeToggle />
        <div className="app-avatar" aria-label="User profile">
          <img src="/me.jpg" alt="User" className="app-avatar__img" />
        </div>
      </div>
    </aside>
  );
}
