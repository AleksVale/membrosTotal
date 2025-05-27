"use client";

import { useCallback, useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-utils";
import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

// Esquema de validação
export const moduleSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  order: z.number().int().min(0, "A ordem deve ser um número positivo"),
  trainingId: z.number().int().positive("O treinamento é obrigatório"),
});

// Tipo derivado do esquema
export type ModuleFormValues = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  initialData?: ModuleFormValues & { id?: number; thumbnail?: string };
  trainingId: number;
  onSubmit: (values: ModuleFormValues, file?: File) => Promise<void>;
  isSubmitting: boolean;
}

export function ModuleForm({
  initialData,
  trainingId,
  onSubmit,
  isSubmitting,
}: ModuleFormProps) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail ? getImageUrl(initialData.thumbnail) : null
  );

  // Buscar dados do treinamento pai
  const { data: trainingData } = useQuery<{ training: { title: string } }>({
    queryKey: QueryKeys.trainings.detail(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}`);
      return response.data;
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
    enabled: !!trainingId,
  });

  // Configuração do formulário
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      order: 0,
      trainingId: trainingId,
    },
  });

  // Atualizar o trainingId quando o parâmetro mudar
  useEffect(() => {
    if (trainingId && !initialData) {
      form.setValue("trainingId", trainingId);
    }
  }, [trainingId, form, initialData]);

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
    async (values: ModuleFormValues) => {
      try {
        await onSubmit(values, thumbnail || undefined);
      } catch (error) {
        console.error("Erro ao salvar módulo:", error);
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
                Salvar Módulo
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
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      Treinamento:{" "}
                      <span className="font-medium text-foreground">
                        {trainingData?.training?.title || "Carregando..."}
                      </span>
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="trainingId"
                    render={({ field }) => (
                      <input type="hidden" {...field} value={trainingId} />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do módulo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nome do módulo que será exibido para os alunos.
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
                            placeholder="Descreva o módulo"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição sobre o conteúdo do módulo.
                        </FormDescription>
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
                        <FormDescription>
                          Ordem de exibição do módulo.
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
