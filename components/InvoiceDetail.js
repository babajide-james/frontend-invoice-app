import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import InvoiceActions from "./InvoiceActions";
import { formatCurrency, formatDisplayDate } from "../lib/invoiceUtils";

export default function InvoiceDetail({
  invoice,
  onEdit,
  onDelete,
  onMarkPaid,
}) {
  return (
    <div className="invoice-detail">
      <Link href="/" className="back-link">
        <svg viewBox="0 0 7 10" aria-hidden="true">
          <path
            d="M6 1.25 2.25 5 6 8.75"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        Go back
      </Link>

      <div className="detail-status-bar">
        <div className="detail-status-bar__label">
          <span>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <InvoiceActions
          invoice={invoice}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkPaid={onMarkPaid}
        />
      </div>

      <article className="detail-card">
        <div className="detail-card__heading">
          <div>
            <h1>
              <span>#</span>
              {invoice.id}
            </h1>
            <p>{invoice.description || "No project description"}</p>
          </div>

          <address>
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </div>

        <div className="detail-card__meta">
          <div>
            <span>Invoice Date</span>
            <strong>{formatDisplayDate(invoice.createdAt)}</strong>
          </div>
          <div>
            <span>Payment Due</span>
            <strong>{formatDisplayDate(invoice.paymentDue)}</strong>
          </div>
          <div>
            <span>Bill To</span>
            <strong>{invoice.clientName}</strong>
            <address>
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>
          <div>
            <span>Sent to</span>
            <strong>{invoice.clientEmail}</strong>
          </div>
        </div>

        <section className="detail-card__items">
          <div className="detail-items__head">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          <div className="detail-items__body">
            {invoice.items.map((item, index) => (
              <div className="detail-item-row" key={`${item.name}-${index}`}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <span>{item.quantity}</span>
                <span>{formatCurrency(item.price)}</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))}
          </div>

          <div className="detail-items__total">
            <span>Amount Due</span>
            <strong>{formatCurrency(invoice.total)}</strong>
          </div>
        </section>
      </article>
    </div>
  );
}
