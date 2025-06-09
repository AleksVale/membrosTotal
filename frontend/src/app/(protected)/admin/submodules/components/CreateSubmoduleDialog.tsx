"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Loader2 } from "lucide-react";
import { useCreateSubmodule } from "../hooks/useSubmoduleMutations";

const submoduleSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  moduleId: z.number({ required_error: "Módulo é obrigatório" }),
  order: z.number().min(1, "Ordem deve ser maior que 0"),
});

type SubmoduleFormData = z.infer<typeof submoduleSchema>;

interface Module {
  id: number;
  title: string;
  training?: {
    title: string;
  };
}

interface CreateSubmoduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultModuleId?: number;
}

export function CreateSubmoduleDialog({
  open,
  onOpenChange,
  defaultModuleId,
}: CreateSubmoduleDialogProps) {
  const createSubmodule = useCreateSubmodule();

  const form = useForm<SubmoduleFormData>({
    resolver: zodResolver(submoduleSchema),
    defaultValues: {
      title: "",
      description: "",
      moduleId: defaultModuleId,
      order: 1,
    },
  });

  // Buscar módulos para o select
  const { data: modules, isLoading: isLoadingModules } = useQuery<Module[]>({
    queryKey: QueryKeys.modules.autocomplete,
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=modules");
      return response.data.modules || [];
    },
    staleTime: 300000, // 5 minutes
  });

  const onSubmit = async (data: SubmoduleFormData) => {
    try {
      await createSubmodule.mutateAsync(data);

      // Resetar form e fechar modal
      form.reset();
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!createSubmodule.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        form.reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Submódulo</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo submódulo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    {" "}
                    <Input
                      placeholder="Digite o título do submódulo"
                      {...field}
                      disabled={createSubmodule.isPending}
                    />
                  </FormControl>
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
                    {" "}
                    <Textarea
                      placeholder="Digite a descrição do submódulo"
                      rows={3}
                      {...field}
                      disabled={createSubmodule.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>{" "}
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={createSubmodule.isPending || isLoadingModules}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um módulo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modules?.map((module) => (
                        <SelectItem
                          key={module.id}
                          value={module.id.toString()}
                        >
                          {module.title}
                          {module.training && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({module.training.title})
                            </span>
                          )}
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
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    {" "}
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={createSubmodule.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createSubmodule.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createSubmodule.isPending}>
                {createSubmodule.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Criar Submódulo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
