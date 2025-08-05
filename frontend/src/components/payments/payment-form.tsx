"use client";

import { Button } from "@/components/ui/button";
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
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import {
  AutocompleteItem,
  UserAutocompleteItem,
} from "@/shared/types/autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { CurrencyInput } from "../ui/currency-input";
import { DatePicker } from "../ui/date-picker";

const paymentSchema = z.object({
  value: z.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  expertId: z.number().min(1, "Especialista é obrigatório"),
  paymentTypeId: z.number().min(1, "Tipo de pagamento é obrigatório"),
  paymentDate: z.date({
    required_error: "A data do pagamento é obrigatória",
  }),
  file: z.instanceof(File).optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  initialData?: PaymentFormValues;
  paymentId?: number;
}

const fetchAutocomplete = async (
  fields: string[]
): Promise<AutocompleteResponse> => {
  const response = await http.get<AutocompleteResponse>(
    `/autocomplete?fields=${fields.join(",")}`
  );
  return response.data;
};

export function PaymentForm({
  initialData,
  paymentId,
}: Readonly<PaymentFormProps>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: autocompleteData, isLoading } = useQuery<AutocompleteResponse>({
    queryKey: QueryKeys.autocomplete.fields(["users", "paymentTypes"]),
    queryFn: () => fetchAutocomplete(["users", "paymentTypes"]),
    staleTime: 5 * 60 * 1000,
  });

  const experts: UserAutocompleteItem[] = autocompleteData?.users || [];
  const paymentTypes: AutocompleteItem[] = autocompleteData?.paymentTypes || [];

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      value: 0,
      description: "",
      expertId: 0,
      paymentTypeId: 0,
      paymentDate: new Date(),
    },
  });
  const fileRef = form.register("file");

  // Modify the onSubmit function to handle file upload
  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true);
    try {
      let paymentResponse;

      // First create/update the payment without the file
      const paymentData = {
        value: data.value,
        description: data.description,
        expertId: data.expertId,
        paymentTypeId: data.paymentTypeId,
        paymentDate: data.paymentDate.toISOString().split("T")[0],
      };

      if (paymentId) {
        paymentResponse = await http.patch(
          `/payment-admin/${paymentId}`,
          paymentData
        );

        if (data.file && data.file instanceof FileList && data.file[0]) {
          const formData = new FormData();
          formData.append("file", data.file[0]);
          await http.post(`/payment-admin/${paymentId}/file`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        toast.success("Pagamento atualizado com sucesso");
      } else {
        paymentResponse = await http.post("/payment-admin", paymentData);

        if (
          data.file &&
          data.file instanceof FileList &&
          data.file[0] &&
          paymentResponse?.data?.id
        ) {
          const formData = new FormData();
          formData.append("file", data.file[0]);
          await http.post(
            `/payment-admin/${paymentResponse.data.id}/file`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }

        toast.success("Pagamento criado com sucesso");
      }

      router.push("/admin/payments");
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
      toast.error("Não foi possível salvar o pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={(value) => field.onChange(value || 0)}
                    placeholder="Valor"
                  />
                </FormControl>
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
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoading
                            ? "Carregando..."
                            : "Selecione o tipo de pagamento"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.label || type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialista</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoading ? "Carregando..." : "Selecione o especialista"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id.toString()}>
                      {expert.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Pagamento</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                  placeholder="Selecione a data do pagamento"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Data em que o pagamento foi realizado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Comprovante de Pagamento</FormLabel>
              <FormControl>
                <Input
                  {...fileRef}
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || isLoading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
