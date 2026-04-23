import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import InvoiceDetail from "../../components/InvoiceDetail";
import InvoiceDrawer from "../../components/InvoiceDrawer";
import Layout from "../../components/Layout";
import { normalizeInvoice } from "../../lib/invoiceUtils";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    let active = true;
    async function loadInvoice() {
      setLoading(true);
      try {
        const response = await fetch(`/api/invoices/${id}`);
        if (!response.ok) {
          router.replace("/");
          return;
        }
        const data = await response.json();
        if (active) setInvoice(normalizeInvoice(data));
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInvoice();
    return () => {
      active = false;
    };
  }, [id, router]);

  async function handleMarkPaid() {
    if (!invoice) return;
    const response = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...invoice, status: "paid" }),
    });

    if (!response.ok) return;
    const data = await response.json();
    setInvoice(normalizeInvoice(data));
  }

  async function handleDelete() {
    if (!invoice) return;
    await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
    router.push("/");
  }

  async function handleSaved(data) {
    setInvoice(normalizeInvoice(data));
    setDrawerOpen(false);
  }

  return (
    <Layout>
      <main className="page-shell">
        {loading ? (
          <div className="loading-state">Loading invoice...</div>
        ) : invoice ? (
          <InvoiceDetail
            invoice={invoice}
            onEdit={() => setDrawerOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onMarkPaid={handleMarkPaid}
          />
        ) : null}
      </main>

      <InvoiceDrawer
        open={drawerOpen}
        initialInvoice={invoice}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        invoiceId={invoice?.id}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
