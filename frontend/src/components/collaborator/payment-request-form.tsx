"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
  useCreatePaymentRequest,
  useUpdatePaymentRequest,
  useUploadPaymentRequestFile,
} from "@/hooks/collaborator/use-payment-requests";
import { usePaymentRequestTypes } from "@/hooks/useAutocomplete";

// Schema de validação
const paymentRequestSchema = z.object({
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  value: z
    .number({ required_error: "O valor é obrigatório" })
    .min(0.01, "O valor deve ser maior que zero"),
  paymentRequestTypeId: z.number({
    required_error: "O tipo de pagamento é obrigatório",
  }),
  requestDate: z.date({
    required_error: "A data da solicitação é obrigatória",
  }),
});

type PaymentRequestFormValues = z.infer<typeof paymentRequestSchema>;

interface PaymentRequestFormProps {
  paymentRequestId?: number;
  initialData?: PaymentRequestFormValues;
  onSuccess?: () => void;
}

export function PaymentRequestForm({
  paymentRequestId,
  initialData,
  onSuccess,
}: PaymentRequestFormProps) {
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const createPaymentRequest = useCreatePaymentRequest();
  const updatePaymentRequest = useUpdatePaymentRequest();
  const uploadFile = useUploadPaymentRequestFile();

  const isSubmitting =
    createPaymentRequest.isPending ||
    updatePaymentRequest.isPending ||
    uploadFile.isPending;

  // Formulário
  const form = useForm<PaymentRequestFormValues>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: initialData || {
      description: "",
      value: 0,
      paymentRequestTypeId: 0,
      requestDate: new Date(),
    },
  });

  // Buscar tipos de pagamento
  const { data: paymentRequestTypes, isLoading: isLoadingTypes } =
    usePaymentRequestTypes();

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

  const onSubmit = async (data: PaymentRequestFormValues) => {
    try {
      // Formatear data para o backend (formato YYYY-MM-DD)
      const formattedData = {
        ...data,
        requestDate: data.requestDate.toISOString().split("T")[0],
      };

      if (paymentRequestId) {
        // Atualizar solicitação existente
        await updatePaymentRequest.mutateAsync({
          id: paymentRequestId,
          data: formattedData,
        });

        // Upload do arquivo se fornecido
        if (file) {
          await uploadFile.mutateAsync({
            id: paymentRequestId,
            file,
          });
        }
      } else {
        // Criar nova solicitação
        const result = await createPaymentRequest.mutateAsync(formattedData);

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
      console.error("Erro ao processar solicitação:", error);
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
                          placeholder="Descreva o motivo da solicitação de pagamento"
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
                    name="paymentRequestTypeId"
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
                              paymentRequestTypes?.map((type) => (
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

                  <FormField
                    control={form.control}
                    name="requestDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Solicitação</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                            placeholder="Selecione a data da solicitação"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Data em que a despesa foi realizada
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    Anexe um comprovante para sua solicitação (opcional)
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
                        {paymentRequestId ? "Atualizar" : "Enviar Solicitação"}
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
