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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/lib/http";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

// Schema validação alinhado com as expectativas do backend
const userSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .union([
      z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
      z.string().length(0),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  document: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  profileId: z.string().min(1, "Perfil é obrigatório"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface Profile {
  id: number;
  name: string;
  label: string;
}

interface UserFormProps {
  initialData?: UserFormValues;
  userId?: number;
}

export function UserForm({ initialData, userId }: Readonly<UserFormProps>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Buscar perfis com React Query
  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const response = await http.get<{ profiles: Profile[] }>(
        "/autocomplete?fields=profiles"
      );
      return response.data.profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        label: profile.label,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Form com inicialização padrão
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      document: "",
      phone: "",
      birthDate: "",
      profileId: "",
    },
  });

  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await http.get(`/user/${userId}`);
      if (response.data) {
        form.reset({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          password: "", // Não preencher a senha na edição
          document: response.data.document,
          phone: response.data.phone,
          birthDate: response.data.birthDate.split("T")[0], // Formatar data
          profileId: response.data.Profile.id.toString(),
        });
      }
      return response.data;
    },
    refetchOnMount: true,

    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar/atualizar usuário
  const mutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      // Converter profileId para número conforme esperado pela API
      const payload = {
        ...data,
        profileId: parseInt(data.profileId, 10),
      };

      // Remover password se estiver vazio em uma atualização
      if (userId && !payload.password) {
        delete payload.password;
      }

      if (userId) {
        return http.patch(`/user/${userId}`, payload);
      } else {
        return http.post("/user", payload);
      }
    },
    onSuccess: () => {
      toast.success(
        userId ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso"
      );
      queryClient.invalidateQueries({ queryKey: ["users", "user", userId] });
      router.push("/admin/users");
    },
    onError: (error) => {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Não foi possível salvar o usuário");
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutation.mutate(data);
  };

  // Formatar documento como CPF
  const formatCPF = (value: string) => {
    return value
      ?.replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  // Formatar telefone
  const formatPhone = (value: string) => {
    return value
      ?.replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const isLoading = loadingProfiles || isLoadingUser;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando formulário...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite o email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {userId ? "Nova Senha (opcional)" : "Senha"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      userId ? "Deixe em branco para manter" : "Digite a senha"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    {...field}
                    value={formatCPF(field.value)}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                    value={formatPhone(field.value)}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem
                        key={profile.id}
                        value={profile.id.toString()}
                      >
                        {profile.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
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
