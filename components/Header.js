import React from "react";
import FilterMenu from "./FilterMenu";
import { getInvoiceCountLabel } from "../lib/invoiceUtils";

export default function Header({
  invoiceCount,
  selectedStatuses,
  onToggleStatus,
  onNewInvoice,
}) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-header__title">Invoices</h1>
        <p className="page-header__subtitle">{getInvoiceCountLabel(invoiceCount)}</p>
      </div>

      <div className="page-header__actions">
        <FilterMenu
          selectedStatuses={selectedStatuses}
          onChange={onToggleStatus}
        />
        <button type="button" className="button button--primary" onClick={onNewInvoice}>
          <span className="button__icon" aria-hidden="true">+</span>
          <span>
            <span className="button__mobile-copy">New</span>
            <span className="button__desktop-copy">New Invoice</span>
          </span>
        </button>
      </div>
    </header>
  );
}
