import React from "react";
import { canMarkAsPaid } from "../lib/invoiceUtils";

export default function InvoiceActions({ invoice, onEdit, onDelete, onMarkPaid }) {
  return (
    <div className="detail-actions">
      <button type="button" className="button button--soft" onClick={onEdit}>
        Edit
      </button>
      <button type="button" className="button button--danger" onClick={onDelete}>
        Delete
      </button>
      {canMarkAsPaid(invoice) && (
        <button type="button" className="button button--primary" onClick={onMarkPaid}>
          Mark as Paid
        </button>
      )}
    </div>
  );
}
