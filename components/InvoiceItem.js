import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDisplayDate } from "../lib/invoiceUtils";

export default function InvoiceItem({ invoice }) {
  return (
    <Link href={`/invoice/${invoice.id}`} className="invoice-card">
      <div className="invoice-card__identity">
        <strong>
          <span>#</span>
          {invoice.id}
        </strong>
        <span className="invoice-card__date">
          Due {formatDisplayDate(invoice.paymentDue)}
        </span>
      </div>

      <div className="invoice-card__client">{invoice.clientName || "Unnamed Client"}</div>

      <div className="invoice-card__amount">{formatCurrency(invoice.total)}</div>

      <div className="invoice-card__status">
        <StatusBadge status={invoice.status} />
        <svg viewBox="0 0 7 10" aria-hidden="true">
          <path
            d="M1 1.25 4.75 5 1 8.75"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </Link>
  );
}
