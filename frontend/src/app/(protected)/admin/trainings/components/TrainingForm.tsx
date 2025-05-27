"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Componentes
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-utils";

// Esquema de validação
export const trainingSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  tutor: z
    .string()
    .min(3, "O nome do tutor deve ter pelo menos 3 caracteres")
    .max(100, "O nome do tutor deve ter no máximo 100 caracteres"),
  order: z.number().int().min(0, "A ordem deve ser um número positivo"),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

// Tipo derivado do esquema
export type TrainingFormValues = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  initialData?: TrainingFormValues & { id?: number; thumbnail?: string };
  onSubmit: (values: TrainingFormValues, file?: File) => Promise<void>;
  isSubmitting: boolean;
}

export function TrainingForm({
  initialData,
  onSubmit,
  isSubmitting,
}: TrainingFormProps) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail ? getImageUrl(initialData.thumbnail) : null
  );

  // Configuração do formulário
  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tutor: "",
      order: 0,
      status: "DRAFT",
    },
  });

  // Handler para arquivo de thumbnail
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnail(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit do formulário
  const handleSubmit = useCallback(
    async (values: TrainingFormValues) => {
      try {
        await onSubmit(values, thumbnail || undefined);
      } catch (error) {
        console.error("Erro ao salvar treinamento:", error);
      }
    },
    [onSubmit, thumbnail]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Treinamento
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna esquerda - Imagem */}
          <Card>
            <CardContent className="p-6">
              <FormLabel className="block mb-2">Thumbnail</FormLabel>

              <div className="relative aspect-video mb-4 bg-muted/30 rounded-md overflow-hidden">
                {thumbnailPreview ? (
                  <Image
                    src={thumbnailPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Sem imagem</p>
                  </div>
                )}
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <FormDescription className="mt-2">
                Recomendado: 16:9, máximo 2MB
              </FormDescription>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título do treinamento"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nome do treinamento que será exibido para os alunos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o treinamento"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição sobre o conteúdo do treinamento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="tutor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professor/Tutor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do professor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ordem</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Rascunho</SelectItem>
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                            <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Rascunhos não são visíveis para os alunos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
