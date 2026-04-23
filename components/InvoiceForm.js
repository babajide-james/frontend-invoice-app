import React, { useEffect, useMemo, useState } from "react";
import FormField from "./FormField";
import LineItemRow from "./LineItemRow";
import {
  addDays,
  calculateInvoiceTotal,
  calculateItemTotal,
  getEmptyInvoice,
  getEmptyItem,
  normalizeInvoice,
  prepareInvoicePayload,
  validateInvoice,
} from "../lib/invoiceUtils";
import { PAYMENT_TERMS_OPTIONS } from "../lib/constants";

function DrawerFooter({
  currentStatus,
  isEditing,
  onDiscard,
  onSaveDraft,
  onSavePending,
}) {
  return (
    <div className="drawer-footer">
      <button type="button" className="button button--ghost" onClick={onDiscard}>
        {isEditing ? "Cancel" : "Discard"}
      </button>
      <div className="drawer-footer__cluster">
        {currentStatus !== "paid" && (
          <button type="button" className="button button--soft-dark" onClick={onSaveDraft}>
            Save as Draft
          </button>
        )}
        <button type="button" className="button button--primary" onClick={onSavePending}>
          {isEditing ? "Save Changes" : "Save & Send"}
        </button>
      </div>
    </div>
  );
}

export default function InvoiceForm({
  open,
  initialInvoice,
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(initialInvoice?.id);
  const [form, setForm] = useState(getEmptyInvoice());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initialInvoice ? normalizeInvoice(initialInvoice) : getEmptyInvoice());
    setErrors({});
  }, [open, initialInvoice]);

  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const title = useMemo(() => {
    if (!isEditing) return "New Invoice";
    return (
      <>
        Edit <span>#</span>
        {initialInvoice.id}
      </>
    );
  }, [initialInvoice, isEditing]);

  function syncInvoice(nextInvoice) {
    const items = nextInvoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      total: calculateItemTotal(item),
    }));

    return {
      ...nextInvoice,
      paymentDue: addDays(nextInvoice.createdAt, nextInvoice.paymentTerms),
      items,
      total: calculateInvoiceTotal(items),
    };
  }

  function updateField(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "createdAt" || name === "paymentTerms") {
        return syncInvoice(next);
      }
      return next;
    });
  }

  function updateAddress(section, field, value) {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updateItem(index, field, value) {
    setForm((current) => {
      const items = current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "name" ? value : Number(value),
            }
          : item,
      );
      return syncInvoice({ ...current, items });
    });
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, getEmptyItem()],
    }));
  }

  function removeItem(index) {
    setForm((current) => ({
      ...syncInvoice({
        ...current,
        items:
          current.items.length === 1
            ? current.items
            : current.items.filter((_, itemIndex) => itemIndex !== index),
      }),
    }));
  }

  async function submit(status) {
    const payload = prepareInvoicePayload(form, status);
    const nextErrors = validateInvoice(payload, { draftMode: status === "draft" });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const endpoint = isEditing ? `/api/invoices/${initialInvoice.id}` : "/api/invoices";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, status }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.fields || {});
        return;
      }

      onSaved(data);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="drawer-shell" role="presentation">
      <div className="drawer-shell__backdrop" onClick={onClose} />
      <section className="drawer-shell__panel" aria-label="Invoice form">
        <div className="drawer-shell__content">
          <h2 className="drawer-shell__title">{title}</h2>

          <form
            className="invoice-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <section className="invoice-form__group">
              <h3>Bill From</h3>
              <div className="invoice-form__grid invoice-form__grid--address">
                <FormField
                  id="sender-street"
                  label="Street Address"
                  error={errors["senderAddress.street"]}
                  className="invoice-form__span-full"
                >
                  <input
                    id="sender-street"
                    type="text"
                    value={form.senderAddress.street}
                    onChange={(event) =>
                      updateAddress("senderAddress", "street", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  id="sender-city"
                  label="City"
                  error={errors["senderAddress.city"]}
                >
                  <input
                    id="sender-city"
                    type="text"
                    value={form.senderAddress.city}
                    onChange={(event) =>
                      updateAddress("senderAddress", "city", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  id="sender-postcode"
                  label="Post Code"
                  error={errors["senderAddress.postCode"]}
                >
                  <input
                    id="sender-postcode"
                    type="text"
                    value={form.senderAddress.postCode}
                    onChange={(event) =>
                      updateAddress("senderAddress", "postCode", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  id="sender-country"
                  label="Country"
                  error={errors["senderAddress.country"]}
                >
                  <input
                    id="sender-country"
                    type="text"
                    value={form.senderAddress.country}
                    onChange={(event) =>
                      updateAddress("senderAddress", "country", event.target.value)
                    }
                  />
                </FormField>
              </div>
            </section>

            <section className="invoice-form__group">
              <h3>Bill To</h3>
              <div className="invoice-form__grid invoice-form__grid--client">
                <FormField
                  id="client-name"
                  label="Client's Name"
                  error={errors.clientName}
                  className="invoice-form__span-full"
                >
                  <input
                    id="client-name"
                    type="text"
                    value={form.clientName}
                    onChange={(event) => updateField("clientName", event.target.value)}
                  />
                </FormField>

                <FormField
                  id="client-email"
                  label="Client's Email"
                  error={errors.clientEmail}
                  className="invoice-form__span-full"
                >
                  <input
                    id="client-email"
                    type="email"
                    value={form.clientEmail}
                    onChange={(event) => updateField("clientEmail", event.target.value)}
                  />
                </FormField>

                <FormField
                  id="client-street"
                  label="Street Address"
                  error={errors["clientAddress.street"]}
                  className="invoice-form__span-full"
                >
                  <input
                    id="client-street"
                    type="text"
                    value={form.clientAddress.street}
                    onChange={(event) =>
                      updateAddress("clientAddress", "street", event.target.value)
                    }
                  />
                </FormField>

                <FormField id="client-city" label="City" error={errors["clientAddress.city"]}>
                  <input
                    id="client-city"
                    type="text"
                    value={form.clientAddress.city}
                    onChange={(event) =>
                      updateAddress("clientAddress", "city", event.target.value)
                    }
                  />
                </FormField>

                <FormField
                  id="client-postcode"
                  label="Post Code"
                  error={errors["clientAddress.postCode"]}
                >
                  <input
                    id="client-postcode"
                    type="text"
                    value={form.clientAddress.postCode}
                    onChange={(event) =>
                      updateAddress("clientAddress", "postCode", event.target.value)
                    }
                  />
                </FormField>

                <FormField
                  id="client-country"
                  label="Country"
                  error={errors["clientAddress.country"]}
                >
                  <input
                    id="client-country"
                    type="text"
                    value={form.clientAddress.country}
                    onChange={(event) =>
                      updateAddress("clientAddress", "country", event.target.value)
                    }
                  />
                </FormField>

                <FormField id="invoice-date" label="Invoice Date" error={errors.createdAt}>
                  <input
                    id="invoice-date"
                    type="date"
                    value={form.createdAt}
                    onChange={(event) => updateField("createdAt", event.target.value)}
                  />
                </FormField>

                <FormField
                  id="payment-terms"
                  label="Payment Terms"
                  error={errors.paymentTerms}
                >
                  <select
                    id="payment-terms"
                    value={form.paymentTerms}
                    onChange={(event) => updateField("paymentTerms", Number(event.target.value))}
                  >
                    {PAYMENT_TERMS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  id="project-description"
                  label="Project Description"
                  error={errors.description}
                  className="invoice-form__span-full"
                >
                  <input
                    id="project-description"
                    type="text"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </FormField>
              </div>
            </section>

            <section className="invoice-form__group">
              <h3>Item List</h3>
              {errors.items ? <p className="invoice-form__group-error">{errors.items}</p> : null}
              <div className="invoice-form__items">
                {form.items.map((item, index) => (
                  <LineItemRow
                    key={`item-${index}`}
                    item={item}
                    index={index}
                    errors={errors}
                    onChange={updateItem}
                    onRemove={removeItem}
                    disableRemove={form.items.length === 1}
                  />
                ))}
              </div>

              <button type="button" className="button button--full" onClick={addItem}>
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        <DrawerFooter
          currentStatus={form.status}
          isEditing={isEditing}
          onDiscard={onClose}
          onSaveDraft={() => submit("draft")}
          onSavePending={() => submit(form.status === "paid" ? "paid" : "pending")}
        />

        {submitting ? <div className="drawer-shell__loading">Saving...</div> : null}
      </section>
    </div>
  );
}
