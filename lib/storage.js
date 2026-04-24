// In-memory storage for API (data persists during deployment, resets on restart)
// Client-side uses localStorage for browser persistence
import initialData from "../data/invoices.json";

let invoiceStore = [...initialData];

// Load initial data from environment or use empty array
export function initializeStorage() {
  invoiceStore = [...initialData];
}

export async function getInvoices() {
  return [...invoiceStore];
}

export async function saveInvoices(invoices) {
  invoiceStore = Array.isArray(invoices) ? [...invoices] : [];
  return invoiceStore;
}

export async function addInvoice(invoice) {
  invoiceStore.push(invoice);
  return invoice;
}

export async function updateInvoice(id, updates) {
  const idx = invoiceStore.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  invoiceStore[idx] = { ...invoiceStore[idx], ...updates };
  return invoiceStore[idx];
}

export async function deleteInvoice(id) {
  const idx = invoiceStore.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  invoiceStore.splice(idx, 1);
  return true;
}

export async function findInvoice(id) {
  return invoiceStore.find((i) => i.id === id) || null;
}
