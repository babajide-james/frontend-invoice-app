// Client-side localStorage utilities for invoice persistence

const STORAGE_KEY = "invoices_app_data";

export function getStoredInvoices() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading from localStorage:", err);
    return [];
  }
}

export function saveStoredInvoices(invoices) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error("Error writing to localStorage:", err);
  }
}

export function clearStoredInvoices() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
}

export function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
}

export function saveStoredTheme(theme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("theme", theme);
  } catch (err) {
    console.error("Error saving theme:", err);
  }
}
