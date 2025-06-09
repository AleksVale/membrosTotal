"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
import http from "@/lib/http";
import { getImageUrl } from "@/lib/image-utils";
import { Autocomplete } from "@/services/autocomplete.service";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const submoduleSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  moduleId: z.number({ required_error: "Módulo é obrigatório" }),
  order: z.number().min(1, "Ordem deve ser maior que 0"),
});

export type SubmoduleFormData = z.infer<typeof submoduleSchema>;

interface SubmoduleFormProps {
  onSubmit: (data: SubmoduleFormData, file?: File) => void;
  onCancel: () => void;
  defaultValues?: Partial<SubmoduleFormData> & { thumbnail?: string };
  isSubmitting?: boolean;
  submitText?: string;
}

export function SubmoduleForm({
  onSubmit,
  onCancel,
  defaultValues = {},
  isSubmitting = false,
  submitText = "Salvar",
}: SubmoduleFormProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultValues?.thumbnail ? getImageUrl(defaultValues.thumbnail) : null
  );

  const form = useForm<SubmoduleFormData>({
    resolver: zodResolver(submoduleSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      ...defaultValues,
    },
  });

  // Reset form when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      const resetValues = {
        title: "",
        description: "",
        order: 1,
        ...defaultValues,
      };
      form.reset(resetValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const { data: modules, isLoading: isLoadingModules } = useQuery<
    Autocomplete[]
  >({
    queryKey: QueryKeys.modules.autocomplete,
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=modules");
      return response.data.modules || [];
    },
    staleTime: 300000, // 5 minutes
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
    async (values: SubmoduleFormData) => {
      try {
        await onSubmit(values, thumbnail || undefined);
      } catch (error) {
        console.error("Erro ao salvar submódulo:", error);
      }
    },
    [onSubmit, thumbnail]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={onCancel}>
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
                {submitText}
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
                disabled={isSubmitting}
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
                            placeholder="Título do submódulo"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Nome do submódulo que será exibido para os alunos.
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
                            placeholder="Descreva o submódulo"
                            className="min-h-[120px]"
                            rows={4}
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição sobre o conteúdo do submódulo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="moduleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Módulo</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                            disabled={isSubmitting || isLoadingModules}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um módulo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {modules?.map((module) => (
                                <SelectItem
                                  key={module.id}
                                  value={module.id.toString()}
                                >
                                  {module.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Módulo ao qual este submódulo pertence.
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
                              min="1"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Ordem de exibição do submódulo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
