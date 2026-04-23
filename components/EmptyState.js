import React from "react";

export default function EmptyState({ onCreateInvoice }) {
  return (
    <section className="empty-state">
      <div className="empty-state__illustration" aria-hidden="true">
        <div className="empty-state__circle empty-state__circle--one" />
        <div className="empty-state__circle empty-state__circle--two" />
        <div className="empty-state__card" />
      </div>
      <h2>There is nothing here</h2>
      <p>
        Create an invoice by clicking the <strong>New Invoice</strong> button and
        get started.
      </p>
      <button type="button" className="button button--primary" onClick={onCreateInvoice}>
        <span className="button__icon" aria-hidden="true">+</span>
        <span>Create Invoice</span>
      </button>
    </section>
  );
}
