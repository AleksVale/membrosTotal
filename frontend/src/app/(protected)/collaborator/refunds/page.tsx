"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { RefundFilter } from "@/components/collaborator/refund-filter";
import { RefundForm } from "@/components/collaborator/refund-form";
import { RefundList } from "@/components/collaborator/refund-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCollaboratorRefunds } from "@/hooks/collaborator/use-refunds";
import http from "@/lib/http";
import { toast } from "react-toastify";

export default function RefundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Estados
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [perPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Construir parâmetros de consulta
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", perPage.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params;
  }, [page, perPage, filters]);

  // Buscar reembolsos
  const { data, isLoading, isFetching, isError, refetch } =
    useCollaboratorRefunds(buildQueryParams());

  // Atualizar URL quando os parâmetros mudarem
  useEffect(() => {
    const params = buildQueryParams();
    const url = `?${params.toString()}`;
    router.replace(url, { scroll: false });
  }, [buildQueryParams, router]);

  // Manipuladores
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1); // Resetar página ao aplicar filtros
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleDownloadFile = async (id: number) => {
    try {
      const response = await http.get(`/admin/refunds/${id}/file`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comprovante-reembolso-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Erro ao baixar o arquivo");
    }
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reembolsos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Reembolso
        </Button>
      </div>

      <RefundFilter
        onFilter={handleFilter}
        initialFilters={filters}
        onClearFilters={handleClearFilters}
      />

      <RefundList
        refunds={data?.data || []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRefetch={refetch}
        onDownloadFile={handleDownloadFile}
        hasActiveFilters={hasActiveFilters}
        isMobile={isMobile}
        pagination={{
          page,
          perPage,
          totalPages: data?.meta?.last_page || 1,
          totalItems: data?.meta?.total || 0,
          onPageChange: handlePageChange,
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Reembolso</DialogTitle>
          </DialogHeader>
          <RefundForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
