"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePayment,
  usePaymentTypes,
  useUpdatePayment,
  useUploadPaymentFile,
} from "@/hooks/collaborator/use-payments";
import { format } from "date-fns";

// Schema de validação
const paymentSchema = z.object({
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  value: z
    .number({ required_error: "O valor é obrigatório" })
    .min(0.01, "O valor deve ser maior que zero"),
  paymentTypeId: z.number({
    required_error: "O tipo de pagamento é obrigatório",
  }),
  paymentDate: z.string().min(1, "A data é obrigatória"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentType {
  id: number;
  label: string;
}

interface PaymentFormProps {
  paymentId?: number;
  initialData?: PaymentFormValues;
  onSuccess?: () => void;
}

export function PaymentForm({
  paymentId,
  initialData,
  onSuccess,
}: PaymentFormProps) {
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const uploadFile = useUploadPaymentFile();

  const isSubmitting =
    createPayment.isPending || updatePayment.isPending || uploadFile.isPending;

  // Formulário
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      description: "",
      value: 0,
      paymentTypeId: 0,
      paymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Buscar tipos de pagamento
  const { data: paymentTypes, isLoading: isLoadingTypes } = usePaymentTypes();

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      if (paymentId) {
        // Atualizar pagamento existente
        await updatePayment.mutateAsync({
          id: paymentId,
          data,
        });

        // Upload do arquivo se fornecido
        if (file) {
          await uploadFile.mutateAsync({
            id: paymentId,
            file,
          });
        }
      } else {
        // Criar novo pagamento
        const result = await createPayment.mutateAsync(data);

        // Upload do arquivo se fornecido
        if (file && result.id) {
          await uploadFile.mutateAsync({
            id: result.id,
            file,
          });
        }
      }

      // Resetar form
      form.reset();
      setFile(null);

      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o motivo do pagamento"
                          className="min-h-[120px]"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isSubmitting}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>Valor em reais (R$)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pagamento</FormLabel>
                        <Select
                          disabled={isSubmitting || isLoadingTypes}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingTypes ? (
                              <SelectItem value="loading" disabled>
                                Carregando...
                              </SelectItem>
                            ) : (
                              paymentTypes?.map((type: PaymentType) => (
                                <SelectItem
                                  key={type.id}
                                  value={type.id.toString()}
                                >
                                  {type.label}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Pagamento</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormDescription>
                        Data em que o pagamento foi realizado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Comprovante</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                      accept="image/*,.pdf"
                    />
                  </FormControl>
                  <FormDescription>
                    Anexe um comprovante para seu pagamento (obrigatório)
                  </FormDescription>
                </FormItem>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {paymentId ? "Atualizar" : "Registrar Pagamento"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
