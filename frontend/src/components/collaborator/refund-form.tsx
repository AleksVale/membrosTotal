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
  useCreateRefund,
  useRefundTypes,
  useUpdateRefund,
  useUploadRefundFile,
} from "@/hooks/collaborator/use-refunds";

// Schema de validação
const refundSchema = z.object({
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  value: z
    .number({ required_error: "O valor é obrigatório" })
    .min(0.01, "O valor deve ser maior que zero"),
  refundTypeId: z.number({
    required_error: "O tipo de reembolso é obrigatório",
  }),
  refundDate: z.date({
    required_error: "A data do reembolso é obrigatória",
  }),
});

type RefundFormValues = z.infer<typeof refundSchema>;

interface RefundType {
  id: number;
  label: string;
}

interface RefundFormProps {
  refundId?: number;
  initialData?: RefundFormValues;
  onSuccess?: () => void;
}

export function RefundForm({
  refundId,
  initialData,
  onSuccess,
}: RefundFormProps) {
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const createRefund = useCreateRefund();
  const updateRefund = useUpdateRefund();
  const uploadFile = useUploadRefundFile();

  const isSubmitting =
    createRefund.isPending || updateRefund.isPending || uploadFile.isPending;

  // Formulário
  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: initialData || {
      description: "",
      value: 0,
      refundTypeId: 0,
      refundDate: new Date(),
    },
  });

  // Buscar tipos de reembolso
  const { data: refundTypes, isLoading: isLoadingTypes } = useRefundTypes();

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

  const onSubmit = async (data: RefundFormValues) => {
    try {
      // Formatar data para o backend (formato YYYY-MM-DD)
      const formattedData = {
        ...data,
        refundDate: data.refundDate.toISOString().split("T")[0],
      };

      if (refundId) {
        // Atualizar solicitação existente
        await updateRefund.mutateAsync({
          id: refundId,
          data: formattedData,
        });

        // Upload do arquivo se fornecido
        if (file) {
          await uploadFile.mutateAsync({
            id: refundId,
            file,
          });
        }
      } else {
        // Criar nova solicitação
        const result = await createRefund.mutateAsync(formattedData);

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
                          placeholder="Descreva o motivo do reembolso"
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
                    name="refundTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Reembolso</FormLabel>
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
                              refundTypes?.map((type: RefundType) => (
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
                  name="refundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Gasto</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          placeholder="Selecione a data do gasto"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Data em que o gasto foi realizado
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
                    Anexe um comprovante para seu reembolso (obrigatório)
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
                        {refundId ? "Atualizar" : "Enviar Solicitação"}
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
