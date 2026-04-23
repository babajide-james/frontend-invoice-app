import React from "react";
import FormField from "./FormField";
import { formatCurrency } from "../lib/invoiceUtils";

export default function LineItemRow({
  item,
  index,
  errors,
  onChange,
  onRemove,
  disableRemove,
}) {
  return (
    <div className="line-item">
      <FormField
        label="Item Name"
        id={`item-name-${index}`}
        error={errors[`items.${index}.name`]}
        className="line-item__name"
      >
        <input
          id={`item-name-${index}`}
          type="text"
          value={item.name}
          onChange={(event) => onChange(index, "name", event.target.value)}
        />
      </FormField>

      <FormField
        label="Qty."
        id={`item-qty-${index}`}
        error={errors[`items.${index}.quantity`]}
      >
        <input
          id={`item-qty-${index}`}
          type="number"
          min="0"
          value={item.quantity}
          onChange={(event) => onChange(index, "quantity", event.target.value)}
        />
      </FormField>

      <FormField
        label="Price"
        id={`item-price-${index}`}
        error={errors[`items.${index}.price`]}
      >
        <input
          id={`item-price-${index}`}
          type="number"
          min="0"
          step="0.01"
          value={item.price}
          onChange={(event) => onChange(index, "price", event.target.value)}
        />
      </FormField>

      <div className="form-field">
        <div className="form-field__header">
          <span>Total</span>
        </div>
        <div className="line-item__total">{formatCurrency(item.total)}</div>
      </div>

      <button
        type="button"
        className="line-item__remove"
        onClick={() => onRemove(index)}
        disabled={disableRemove}
        aria-label={`Remove item ${index + 1}`}
      >
        <svg viewBox="0 0 13 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11.25 2.75h-2.5l-.714-.896A1.25 1.25 0 0 0 7.06 1.375H5.94a1.25 1.25 0 0 0-.976.479L4.25 2.75h-2.5a.75.75 0 0 0 0 1.5h.51l.645 9.03a1.5 1.5 0 0 0 1.496 1.395h4.198a1.5 1.5 0 0 0 1.496-1.394l.645-9.03h.51a.75.75 0 0 0 0-1.5Z"
          />
        </svg>
      </button>
    </div>
  );
}
