import { readInvoices, writeInvoices } from "../../../lib/data";
import {
  normalizeInvoice,
  prepareInvoicePayload,
  validateInvoice,
} from "../../../lib/invoiceUtils";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const invoices = await readInvoices();
    const idx = invoices.findIndex((i) => i.id === id);

    if (req.method === "GET") {
      const inv = invoices.find((i) => i.id === id);
      if (!inv) return res.status(404).json({ error: "not found" });
      return res.status(200).json(inv);
    }

    if (req.method === "PUT") {
      if (idx === -1) return res.status(404).json({ error: "not found" });
      const currentInvoice = normalizeInvoice(invoices[idx]);
      const merged = normalizeInvoice({
        ...currentInvoice,
        ...(req.body || {}),
      });

      if (merged.status === "paid" && currentInvoice.status !== "pending") {
        return res.status(400).json({
          error: "Only pending invoices can be marked as paid",
        });
      }

      if (currentInvoice.status === "paid" && merged.status !== "paid") {
        return res.status(400).json({
          error: "Paid invoices cannot be moved back",
        });
      }

      const draftMode = merged.status === "draft";
      const errors = validateInvoice(merged, { draftMode });
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: "Validation failed", fields: errors });
      }

      const updated = {
        ...currentInvoice,
        ...prepareInvoicePayload(merged, merged.status),
        id: currentInvoice.id,
      };

      invoices[idx] = updated;
      await writeInvoices(invoices);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      if (idx === -1) return res.status(404).json({ error: "not found" });
      invoices.splice(idx, 1);
      await writeInvoices(invoices);
      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}
