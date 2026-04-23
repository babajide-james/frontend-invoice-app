import React, { useEffect, useRef, useState } from "react";
import { STATUS_OPTIONS } from "../lib/constants";

export default function FilterMenu({ selectedStatuses, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedText =
    selectedStatuses.length === 0
      ? "All"
      : selectedStatuses.length === 1
        ? STATUS_OPTIONS.find(({ value }) => value === selectedStatuses[0])?.label
        : `${selectedStatuses.length} selected`;

  return (
    <div className="filter-menu" ref={rootRef}>
      <button
        type="button"
        className="filter-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="filter-menu__label">
          Filter {selectedText === "All" ? "by status" : `: ${selectedText}`}
        </span>
        <svg viewBox="0 0 10 7" aria-hidden="true">
          <path
            d="M1 1.25 5 5.25l4-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {open && (
        <div className="filter-menu__panel" role="menu" aria-label="Invoice status filters">
          {STATUS_OPTIONS.map((option) => {
            const checked = selectedStatuses.includes(option.value);
            return (
              <label key={option.value} className="filter-menu__option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
