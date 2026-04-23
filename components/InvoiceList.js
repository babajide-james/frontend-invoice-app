import React from "react";
import EmptyState from "./EmptyState";
import InvoiceItem from "./InvoiceItem";

export default function InvoiceList({ invoices, onCreateInvoice }) {
  if (!invoices.length) {
    return <EmptyState onCreateInvoice={onCreateInvoice} />;
  }

  return (
    <section className="invoice-list" aria-label="Invoices">
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </section>
  );
}
