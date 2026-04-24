import {
  getInvoices,
  saveInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  findInvoice,
} from "./storage";

export async function readInvoices() {
  try {
    return await getInvoices();
  } catch (err) {
    console.error("Error reading invoices:", err);
    return [];
  }
}

export async function writeInvoices(data) {
  try {
    return await saveInvoices(data);
  } catch (err) {
    console.error("Error writing invoices:", err);
    throw err;
  }
}

// Helper functions for common operations
export async function addNewInvoice(invoice) {
  return await addInvoice(invoice);
}

export async function updateExistingInvoice(id, updates) {
  return await updateInvoice(id, updates);
}

export async function deleteExistingInvoice(id) {
  return await deleteInvoice(id);
}

export async function getInvoiceById(id) {
  return await findInvoice(id);
}
