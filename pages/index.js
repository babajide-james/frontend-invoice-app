import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import InvoiceDrawer from "../components/InvoiceDrawer";
import InvoiceList from "../components/InvoiceList";
import Layout from "../components/Layout";
import { normalizeInvoice } from "../lib/invoiceUtils";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data.map(normalizeInvoice) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleToggleStatus(status) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  }

  async function handleSaved() {
    setDrawerOpen(false);
    await load();
  }

  const filteredInvoices = useMemo(() => {
    if (selectedStatuses.length === 0) return invoices;
    return invoices.filter((invoice) => selectedStatuses.includes(invoice.status));
  }, [invoices, selectedStatuses]);

  return (
    <Layout>
      <main className="page-shell">
        <Header
          invoiceCount={filteredInvoices.length}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
          onNewInvoice={() => setDrawerOpen(true)}
        />

        <section className="page-content">
          {loading ? (
            <div className="loading-state">Loading invoices...</div>
          ) : (
            <InvoiceList invoices={filteredInvoices} onCreateInvoice={() => setDrawerOpen(true)} />
          )}
        </section>
      </main>

      <InvoiceDrawer
        open={drawerOpen}
        initialInvoice={null}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
      />
    </Layout>
  );
}
