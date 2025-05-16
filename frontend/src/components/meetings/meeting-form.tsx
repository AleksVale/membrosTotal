"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Badge } from "@/components/ui/badge";
import http from "@/lib/http";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";

const meetingSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  link: z.string().url("Link deve ser uma URL válida"),
  meetingDate: z.string().min(1, "Data é obrigatória"),
  users: z.array(z.number()).min(1, "Selecione pelo menos um participante"),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface MeetingFormProps {
  initialData?: MeetingFormValues;
  meetingId?: number;
}

interface User {
  id: number;
  firstName: string;
  name?: string;
  lastName: string;
}

export function MeetingForm({
  initialData,
  meetingId,
}: Readonly<MeetingFormProps>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<number[]>(
    initialData?.users || []
  );

  // Buscar usuários usando React Query
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users-for-meetings"],
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=users");
      return response.data.users.map((user: User) => ({
        id: user.id,
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName:
          user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar/editar reunião
  const mutation = useMutation({
    mutationFn: async (data: MeetingFormValues) => {
      if (meetingId) {
        return http.patch(`/meetings/${meetingId}`, data);
      } else {
        return http.post("/meetings", data);
      }
    },
    onSuccess: () => {
      toast.success(
        meetingId
          ? "Reunião atualizada com sucesso"
          : "Reunião criada com sucesso"
      );
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      router.push("/admin/meetings");
    },
    onError: () => {
      toast.error("Não foi possível salvar a reunião");
    },
  });

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      link: "",
      meetingDate: "",
      users: [],
    },
  });

  // Atualizar o valor do campo users quando selectedUsers muda
  useEffect(() => {
    if (selectedUsers.length > 0) {
      form.setValue("users", selectedUsers);
    }
  }, [selectedUsers, form]);

  // Inicializar selectedUsers com valores iniciais
  useEffect(() => {
    if (initialData?.users?.length) {
      setSelectedUsers(initialData.users);
    }
  }, [initialData]);

  const onSubmit = (data: MeetingFormValues) => {
    mutation.mutate(data);
  };

  const handleAddUser = (userId: string) => {
    const id = parseInt(userId);
    if (!selectedUsers.includes(id)) {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const getUserName = (userId: number) => {
    const user = users.find((u: User) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `Usuário ${userId}`;
  };

  const isLoading = loadingUsers || mutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título da reunião" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link da Reunião</FormLabel>
                <FormControl>
                  <Input placeholder="https://meet.google.com/..." {...field} />
                </FormControl>
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
                <Textarea
                  placeholder="Descreva o objetivo da reunião"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="meetingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="users"
            render={() => (
              <FormItem>
                <FormLabel>Participantes</FormLabel>
                <Select onValueChange={handleAddUser}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os participantes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingUsers ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Carregando...</span>
                      </div>
                    ) : (
                      users.map((user: User) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => (
                    <Badge
                      key={userId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getUserName(userId)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveUser(userId)}
                      />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
