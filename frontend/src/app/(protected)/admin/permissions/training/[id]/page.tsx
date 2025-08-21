"use client";

import { ArrowLeft, GraduationCap, Loader2, Plus, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

import {
  useSearchUsers,
  useTrainingPermissions,
  useUpdateTrainingPermissions,
} from "../../hooks/usePermissions";

export default function TrainingPermissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const trainingId = parseInt(id as string);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [addRelatives, setAddRelatives] = useState(false);

  const {
    data: permissionsData,
    isLoading,
    refetch,
  } = useTrainingPermissions(trainingId);

  const permissions = permissionsData?.users || [];
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchUsers(searchTerm);
  const updatePermissions = useUpdateTrainingPermissions();

  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Selecione pelo menos um usuário");
      return;
    }

    try {
      await updatePermissions.mutateAsync({
        trainingId,
        data: {
          addedUsers: selectedUsers,
          addRelatives,
        },
      });

      setSelectedUsers([]);
      refetch();
      toast.success("Usuários adicionados com sucesso!");
    } catch {
      toast.error("Erro ao adicionar usuários");
    }
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await updatePermissions.mutateAsync({
        trainingId,
        data: {
          removedUsers: [userId],
        },
      });

      refetch();
      toast.success("Usuário removido com sucesso!");
    } catch {
      toast.error("Erro ao remover usuário");
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const isUserAlreadyAdded = (userId: number) => {
    return permissions.some((p) => p.userId === userId);
  };

  const availableUsers = searchResults.filter(
    (user) => !isUserAlreadyAdded(user.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">
            Permissões do Treinamento #{trainingId}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Usuários com Permissão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários com Acesso ({permissions?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {permissions && permissions.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div>
                        <div className="font-medium">
                          {permission.user.firstName} {permission.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {permission.user.email}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(permission.userId)}
                        disabled={updatePermissions.isPending}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário com acesso a este treinamento
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adicionar Novos Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Usuários</Label>
              <Input
                id="search"
                placeholder="Digite pelo menos 2 caracteres do nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && searchTerm.length < 2 && (
                <p className="text-xs text-muted-foreground">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              )}
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {searchTerm && searchTerm.length >= 2
                      ? "Nenhum usuário encontrado com esse termo"
                      : "Digite algo para buscar usuários ou aguarde o carregamento"}
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addRelatives"
                  checked={addRelatives}
                  onChange={(e) => setAddRelatives(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="addRelatives" className="text-sm">
                  Adicionar acesso aos módulos e submódulos relacionados
                </Label>
              </div>

              <Button
                onClick={handleAddUsers}
                disabled={
                  selectedUsers.length === 0 || updatePermissions.isPending
                }
                className="w-full"
              >
                {updatePermissions.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Usuários ({selectedUsers.length})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
