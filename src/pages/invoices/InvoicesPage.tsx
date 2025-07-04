
import Layout from "@/components/Layout";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoiceDetails } from "@/components/invoices/InvoiceDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceStats } from "@/components/invoices/components/InvoiceStats";
import { InvoiceFilters } from "@/components/invoices/components/InvoiceFilters";
import { InvoicesList } from "@/components/invoices/components/InvoicesList";
import { useInvoices } from "@/hooks/invoices/useInvoices";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesPage() {
  const {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    showNewInvoice,
    setShowNewInvoice,
    selectedInvoice,
    setSelectedInvoice,
    filteredInvoices,
    addInvoice,
    updateInvoice,
    locationState,
    isLoading
  } = useInvoices();

  const handleSaveInvoice = (invoice: any) => {
    if (selectedInvoice) {
      updateInvoice(invoice);
    } else {
      addInvoice(invoice);
    }
  };

  const handleRecordPayment = (updatedInvoice: any) => {
    updateInvoice(updatedInvoice);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Statistics Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          
          {/* Search and Filter Skeleton */}
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Table Skeleton */}
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-2">
              Manage your client invoices and payments
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowNewInvoice(true)}>
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Statistics Cards */}
        <InvoiceStats invoices={filteredInvoices} />

        {/* Search and Filter Bar */}
        <InvoiceFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Invoices List */}
        <InvoicesList 
          invoices={filteredInvoices}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onViewDetails={setSelectedInvoice}
          onRecordPayment={handleRecordPayment}
        />
      </div>

      {/* Modals */}
      <InvoiceForm 
        open={showNewInvoice} 
        onClose={() => setShowNewInvoice(false)} 
        onSave={handleSaveInvoice}
        editingInvoice={selectedInvoice}
      />
      
      <InvoiceDetails
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onEdit={() => {
          setShowNewInvoice(true);
        }}
      />
    </Layout>
  );
}
