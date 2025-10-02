"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentTypes } from "@/hooks/collaborator/use-payments";

// Schema de validação
const filterSchema = z.object({
  status: z.string().optional(),
  paymentTypeId: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface PaymentFilterProps {
  onFilter: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
  onClearFilters: () => void;
}

export function PaymentFilter({
  onFilter,
  initialFilters,
  onClearFilters,
}: PaymentFilterProps) {
  // Formulário
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: initialFilters?.status || "",
      paymentTypeId: initialFilters?.paymentTypeId || "",
    },
  });

  // Buscar tipos de pagamento
  const { data: paymentTypes, isLoading: isLoadingTypes } = usePaymentTypes();

  const onSubmit = (data: FilterFormValues) => {
    const filters: Record<string, string> = {};

    if (data.status) {
      filters.status = data.status;
    }

    if (data.paymentTypeId) {
      filters.paymentTypeId = data.paymentTypeId;
    }

    onFilter(filters);
  };

  const handleClearFilters = () => {
    form.reset({
      status: "",
      paymentTypeId: "",
    });
    onClearFilters();
  };

  const hasActiveFilters =
    !!form.watch("status") || !!form.watch("paymentTypeId");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Todos os status</SelectItem>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                        <SelectItem value="CANCELLED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingTypes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        {paymentTypes?.map(
                          (type: { id: number; label: string }) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
                              {type.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex items-end space-x-2">
                <Button type="submit">Filtrar</Button>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
