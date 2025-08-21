"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Loader2,
  Search,
  Shield,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  AddPermissionData,
  Permission,
  useSearchUsers,
} from "../hooks/usePermissions";

const permissionSchema = z.object({
  addedUsers: z.array(z.number()).min(1, "Selecione pelo menos um usuário"),
  addRelatives: z.boolean().optional(),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionManagerProps {
  title: string;
  description: string;
  permissions: Permission[];
  isLoading: boolean;
  onUpdatePermissions: (data: AddPermissionData) => Promise<void>;
  isUpdating: boolean;
  entityType: "training" | "module" | "submodule";
}

export function PermissionManager({
  title,
  description,
  permissions,
  isLoading,
  onUpdatePermissions,
  isUpdating,
  entityType,
}: PermissionManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [usersToRemove, setUsersToRemove] = useState<number[]>([]);

  const { data: searchResults = [], isLoading: isSearching } =
    useSearchUsers(searchTerm);

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      addedUsers: [],
      addRelatives: false,
    },
  });

  const handleAddUsers = async (data: PermissionFormData) => {
    try {
      await onUpdatePermissions({
        addedUsers: data.addedUsers,
        addRelatives: data.addRelatives,
      });
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao adicionar usuários:", error);
    }
  };

  const handleRemoveUsers = async () => {
    if (usersToRemove.length === 0) return;

    try {
      await onUpdatePermissions({
        removedUsers: usersToRemove,
      });
      setUsersToRemove([]);
    } catch (error) {
      console.error("Erro ao remover usuários:", error);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setUsersToRemove((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const availableUsers = searchResults.filter((user) =>
    permissions?.some((permission) => permission.user.id === user.id)
  );

  const getEntityIcon = () => {
    switch (entityType) {
      case "training":
        return "🎓";
      case "module":
        return "📚";
      case "submodule":
        return "📄";
      default:
        return "📋";
    }
  };

  const getRelativesDescription = () => {
    switch (entityType) {
      case "training":
        return "Aplicar também aos módulos e submódulos deste treinamento";
      case "module":
        return "Aplicar também aos submódulos deste módulo e ao treinamento pai";
      case "submodule":
        return "Aplicar também ao módulo e treinamento pais";
      default:
        return "Aplicar às entidades relacionadas";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getEntityIcon()}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {permissions.length} usuário{permissions.length !== 1 ? "s" : ""}{" "}
              com acesso
            </Badge>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Usuários
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Usuários</DialogTitle>
                  <DialogDescription>
                    Selecione os usuários que terão acesso a este{" "}
                    {entityType === "training"
                      ? "treinamento"
                      : entityType === "module"
                      ? "módulo"
                      : "submódulo"}
                    .
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddUsers)}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar usuários..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="addedUsers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuários Disponíveis</FormLabel>
                            <ScrollArea className="h-48 border rounded-md p-2">
                              {isSearching ? (
                                <div className="flex items-center justify-center h-32">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : availableUsers.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                  {searchTerm
                                    ? "Nenhum usuário encontrado"
                                    : "Todos os usuários já têm acesso"}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {availableUsers.map((user) => (
                                    <div
                                      key={user.id}
                                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                      onClick={() => {
                                        const currentValues = field.value || [];
                                        const newValues =
                                          currentValues.includes(user.id)
                                            ? currentValues.filter(
                                                (id) => id !== user.id
                                              )
                                            : [...currentValues, user.id];
                                        field.onChange(newValues);
                                      }}
                                    >
                                      <Checkbox
                                        checked={(field.value || []).includes(
                                          user.id
                                        )}
                                      />
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                          {user.fullName
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {user.fullName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {user.email}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </ScrollArea>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addRelatives"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                Aplicar a entidades relacionadas
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {getRelativesDescription()}
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("addRelatives") && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Esta ação irá conceder acesso às entidades
                            relacionadas automaticamente.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          "Adicionar"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {permissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Users className="h-8 w-8 mb-2" />
            <p className="text-sm">Nenhum usuário tem acesso ainda</p>
            <p className="text-xs">
              Clique em &quot;Adicionar Usuários&quot; para começar
            </p>
          </div>
        ) : (
          <>
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários com acesso..."
                  className="pl-8"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              {usersToRemove.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveUsers}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserMinus className="h-4 w-4 mr-2" />
                  )}
                  Remover {usersToRemove.length} usuário
                  {usersToRemove.length !== 1 ? "s" : ""}
                </Button>
              )}
            </div>

            {/* Users List */}
            <div className="space-y-2">
              {permissions
                .filter(
                  (permission) =>
                    searchFilter === "" ||
                    `${permission.user?.firstName || ""} ${
                      permission.user?.lastName || ""
                    }`.trim() ||
                    "Usuário sem nome"
                      .toLowerCase()
                      .includes(searchFilter.toLowerCase()) ||
                    permission.user.email
                      .toLowerCase()
                      .includes(searchFilter.toLowerCase())
                )
                .map((permission) => (
                  <div
                    key={permission.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      usersToRemove.includes(permission.user.id)
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={usersToRemove.includes(permission.user.id)}
                        onCheckedChange={() =>
                          toggleUserSelection(permission.user.id)
                        }
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getUserInitials(
                            permission.user?.firstName || "",
                            permission.user.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {permission.user?.firstName || ""}{" "}
                          {permission.user?.lastName || ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {permission.user.email}
                        </p>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Acesso Ativo
                    </Badge>
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
