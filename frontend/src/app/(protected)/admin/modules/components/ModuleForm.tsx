"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Componentes
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
import http from "@/lib/http";
import { getImageUrl } from "@/lib/image-utils";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

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
export type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  defaultValues?: ModuleFormData & { id?: number; thumbnail?: string };
  onSubmit: (data: ModuleFormData, file?: File) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

interface Training {
  id: number;
  title: string;
}

export function ModuleForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "Salvar Módulo",
}: ModuleFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Buscar treinamentos disponíveis
  const { data: trainingsData, isError: trainingsError } = useQuery<{
    data: Training[];
  }>({
    queryKey: QueryKeys.trainings.all,
    queryFn: async () => {
      try {
        const response = await http.get("/training-admin?per_page=100");
        console.log("Trainings response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar trainings:", error);
        throw error;
      }
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          order: defaultValues.order,
          trainingId: defaultValues.trainingId,
        }
      : {
          title: "",
          description: "",
          order: 0,
          trainingId: 0,
        },
  });

  // Configurar preview da imagem atual
  useEffect(() => {
    if (defaultValues?.thumbnail) {
      setPreviewUrl(getImageUrl(defaultValues.thumbnail));
    }
  }, [defaultValues?.thumbnail]);

  // Handler para seleção de arquivo
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    []
  );

  // Handler para remover arquivo
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl && !defaultValues?.thumbnail) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(
      defaultValues?.thumbnail ? getImageUrl(defaultValues.thumbnail) : null
    );
  }, [previewUrl, defaultValues?.thumbnail]);

  // Handler para envio do formulário
  const handleSubmit = async (data: ModuleFormData) => {
    await onSubmit(data, selectedFile || undefined);
  };

  const trainings = Array.isArray(trainingsData?.data)
    ? trainingsData.data
    : [];

  if (trainingsError) {
    console.error("Erro ao carregar treinamentos");
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Card principal com informações do módulo */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título do módulo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Treinamento */}
                <FormField
                  control={form.control}
                  name="trainingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento*</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(trainings) && trainings.length > 0 ? (
                            trainings.map((training) => (
                              <SelectItem
                                key={training.id}
                                value={training.id.toString()}
                              >
                                {training.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              Nenhum treinamento disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a descrição do módulo"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Uma descrição clara do que será abordado neste módulo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ordem */}
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      A ordem de exibição do módulo no treinamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Card para upload de thumbnail */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Thumbnail do Módulo</h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma imagem para representar este módulo
                  </p>
                </div>

                {previewUrl && (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={previewUrl}
                      alt="Preview da thumbnail"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("thumbnail-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {previewUrl ? "Alterar Imagem" : "Selecionar Imagem"}
                  </Button>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Arquivo selecionado: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              <Save className="h-4 w-4 mr-2" />
              {submitText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
