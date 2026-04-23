import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__content">{children}</div>
    </div>
  );
}
