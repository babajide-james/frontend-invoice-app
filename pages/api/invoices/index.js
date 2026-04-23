import { readInvoices, writeInvoices } from "../../../lib/data";
import {
  createInvoiceId,
  normalizeInvoice,
  prepareInvoicePayload,
  validateInvoice,
} from "../../../lib/invoiceUtils";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const invoices = await readInvoices();
      return res.status(200).json(invoices);
    }

    if (req.method === "POST") {
      const body = normalizeInvoice(req.body || {});
      const invoices = await readInvoices();
      const status = body.status === "draft" ? "draft" : "pending";
      const errors = validateInvoice(body, { draftMode: status === "draft" });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: "Validation failed", fields: errors });
      }

      const newInvoice = {
        ...prepareInvoicePayload(body, status),
        id: body.id || createInvoiceId(),
      };

      invoices.push(newInvoice);
      await writeInvoices(invoices);
      return res.status(201).json(newInvoice);
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}
