"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";

// Componentes
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";
import http from "@/lib/http";
import { toast } from "react-toastify";

// Interface para o tipo de treinamento
interface Training {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

interface TrainingsResponse {
  data: Training[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

// Esquema de validação
const moduleSchema = z.object({
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

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTrainingId?: number;
}

export function CreateModuleDialog({
  open,
  onOpenChange,
  defaultTrainingId,
}: CreateModuleDialogProps) {
  const queryClient = useQueryClient();

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar treinamentos para o select
  const { data: trainingsData } = useQuery<TrainingsResponse>({
    queryKey: QueryKeys.trainings.all,
    queryFn: async () => {
      const response = await http.get<TrainingsResponse>(
        "/training-admin?per_page=100"
      );
      return response.data;
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Mutação para criar módulo
  const createModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormValues) => {
      const response = await http.post("/training-modules-admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.all,
      });
    },
  });

  // Mutação para fazer upload da thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return http.post(`/training-modules-admin/${id}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // Configuração do formulário
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 0,
      trainingId: defaultTrainingId || 0,
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

  // Handler para envio do formulário
  const handleSubmit = async (values: ModuleFormValues) => {
    setIsSubmitting(true);
    try {
      // Primeiro, criar o módulo
      const result = await createModuleMutation.mutateAsync(values);
      const moduleId = result.data.id;

      // Se tiver arquivo, enviar a thumbnail
      if (thumbnail) {
        await uploadThumbnailMutation.mutateAsync({
          id: moduleId,
          file: thumbnail,
        });
      }

      // Correção: usar o toast.success como função e não como objeto
      toast.success("Módulo criado com sucesso!");

      // Fechar o modal e resetar o form
      onOpenChange(false);
      form.reset();
      setThumbnail(null);
      setThumbnailPreview(null);

      // Opcional: Redirecionar para a página de detalhes do módulo
      // router.push(`/admin/trainings/${values.trainingId}/modules/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      // Correção: usar toast.error como função
      toast.error("Erro ao criar módulo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Módulo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna esquerda - Dados do módulo */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="trainingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento</FormLabel>
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {trainingsData?.data.map((training) => (
                            <SelectItem
                              key={training.id}
                              value={training.id.toString()}
                            >
                              {training.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione a qual treinamento este módulo pertence
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
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

              {/* Coluna direita - Imagem */}
              <div>
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
                      <p className="text-sm text-muted-foreground">
                        Sem imagem
                      </p>
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
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
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
                    Criar Módulo
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
