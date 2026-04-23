const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createInvoiceId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterPart = Array.from(
    { length: 2 },
    () => letters[Math.floor(Math.random() * letters.length)],
  ).join("");
  const numberPart = Math.floor(1000 + Math.random() * 9000);
  return `${letterPart}${numberPart}`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatDisplayDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function addDays(dateString, days) {
  const next = new Date(dateString);
  next.setDate(next.getDate() + Number(days || 0));
  return next.toISOString().slice(0, 10);
}

export function calculateItemTotal(item) {
  const quantity = Number(item.quantity || 0);
  const price = Number(item.price || 0);
  return Number((quantity * price).toFixed(2));
}

export function calculateInvoiceTotal(items = []) {
  return Number(
    items.reduce((sum, item) => sum + calculateItemTotal(item), 0).toFixed(2),
  );
}

export function getEmptyItem() {
  return {
    name: "",
    quantity: 1,
    price: 0,
    total: 0,
  };
}

export function getEmptyInvoice() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "",
    createdAt: today,
    paymentTerms: 30,
    paymentDue: addDays(today, 30),
    description: "",
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [getEmptyItem()],
    total: 0,
  };
}

export function normalizeInvoice(rawInvoice) {
  const fallback = getEmptyInvoice();
  const createdAt = rawInvoice?.createdAt || fallback.createdAt;
  const paymentTerms = Number(rawInvoice?.paymentTerms ?? fallback.paymentTerms);
  const items = Array.isArray(rawInvoice?.items) && rawInvoice.items.length
    ? rawInvoice.items.map((item) => ({
        name: item.name || "",
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        total: calculateItemTotal(item),
      }))
    : [getEmptyItem()];

  return {
    ...fallback,
    ...rawInvoice,
    createdAt,
    paymentTerms,
    paymentDue: rawInvoice?.paymentDue || addDays(createdAt, paymentTerms),
    senderAddress: {
      ...fallback.senderAddress,
      ...(rawInvoice?.senderAddress || {}),
    },
    clientAddress: {
      ...fallback.clientAddress,
      ...(rawInvoice?.clientAddress || {}),
    },
    items,
    total: calculateInvoiceTotal(items),
  };
}

function validateAddress(address, prefix, errors, draftMode) {
  const requiredFields = ["street", "city", "postCode", "country"];
  requiredFields.forEach((field) => {
    const key = `${prefix}.${field}`;
    if (!draftMode && !String(address?.[field] || "").trim()) {
      errors[key] = "Required";
    }
  });
}

export function validateInvoice(invoice, { draftMode = false } = {}) {
  const errors = {};
  const normalized = normalizeInvoice(invoice);

  if (!draftMode && !normalized.description.trim()) {
    errors.description = "Project description is required";
  }

  if (!draftMode && !normalized.clientName.trim()) {
    errors.clientName = "Client's name is required";
  }

  if (!draftMode && !normalized.clientEmail.trim()) {
    errors.clientEmail = "Client's email is required";
  }

  if (
    normalized.clientEmail.trim() &&
    !EMAIL_REGEX.test(normalized.clientEmail.trim())
  ) {
    errors.clientEmail = "Please enter a valid email";
  }

  if (!draftMode && !normalized.createdAt) {
    errors.createdAt = "Invoice date is required";
  }

  if (!draftMode && !normalized.paymentTerms) {
    errors.paymentTerms = "Payment terms are required";
  }

  validateAddress(normalized.senderAddress, "senderAddress", errors, draftMode);
  validateAddress(normalized.clientAddress, "clientAddress", errors, draftMode);

  const nonEmptyItems = normalized.items.filter(
    (item) =>
      item.name.trim() || Number(item.quantity) > 0 || Number(item.price) > 0,
  );

  if (!draftMode && nonEmptyItems.length === 0) {
    errors.items = "An invoice must have at least one item";
  }

  normalized.items.forEach((item, index) => {
    const base = `items.${index}`;
    const hasData =
      item.name.trim() || Number(item.quantity) > 0 || Number(item.price) > 0;

    if (!draftMode || hasData) {
      if (!item.name.trim()) {
        errors[`${base}.name`] = "Item name is required";
      }
      if (Number(item.quantity) <= 0) {
        errors[`${base}.quantity`] = "Qty must be greater than 0";
      }
      if (Number(item.price) <= 0) {
        errors[`${base}.price`] = "Price must be greater than 0";
      }
    }
  });

  return errors;
}

export function prepareInvoicePayload(values, status) {
  const createdAt = values.createdAt || new Date().toISOString().slice(0, 10);
  const paymentTerms = Number(values.paymentTerms || 30);
  const cleanedItems = (values.items || [])
    .map((item) => ({
      name: String(item.name || "").trim(),
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
    }))
    .filter(
      (item) =>
        item.name || Number(item.quantity) > 0 || Number(item.price) > 0,
    )
    .map((item) => ({
      ...item,
      total: calculateItemTotal(item),
    }));

  return {
    ...values,
    createdAt,
    paymentTerms,
    paymentDue: addDays(createdAt, paymentTerms),
    status,
    items: cleanedItems,
    total: calculateInvoiceTotal(cleanedItems),
  };
}

export function getInvoiceCountLabel(count) {
  if (count === 0) return "No invoices";
  if (count === 1) return "There is 1 total invoice";
  return `There are ${count} total invoices`;
}

export function canMarkAsPaid(invoice) {
  return invoice?.status === "pending";
}
