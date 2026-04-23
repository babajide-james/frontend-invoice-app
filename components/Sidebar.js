import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-logo" aria-hidden="true">
        <div className="app-logo__shape">
          <span className="app-logo__shape-top" />
          <span className="app-logo__shape-bottom" />
        </div>
      </div>

      <div className="app-sidebar__footer">
        <ThemeToggle />
        <div className="app-avatar" aria-label="User profile">
          <span>HD</span>
        </div>
      </div>
    </aside>
  );
}
