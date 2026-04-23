import React, { useEffect, useRef } from "react";

export default function DeleteConfirmModal({ invoiceId, open, onClose, onConfirm }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-shell" role="presentation">
      <div className="modal-shell__backdrop" onClick={onClose} />
      <div
        className="modal-shell__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete invoice #{invoiceId}? This action cannot
          be undone.
        </p>
        <div className="modal-shell__actions">
          <button type="button" className="button button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
