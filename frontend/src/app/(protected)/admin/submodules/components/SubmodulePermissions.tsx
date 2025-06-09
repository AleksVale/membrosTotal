"use client";

import { Loader2, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AutocompleteService, {
  Autocomplete,
} from "@/services/autocomplete.service";
import { toast } from "react-toastify";
import {
  useSubmodulePermissions,
  useUpdateSubmodulePermissions,
} from "../hooks/useSubmodulePermissions";

interface User {
  id: number;
  name: string;
  email: string;
}

interface SubmodulePermissionsProps {
  submoduleId: number;
  submoduleTitle: string;
}

export function SubmodulePermissions({
  submoduleId,
  submoduleTitle,
}: SubmodulePermissionsProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [addRelatives, setAddRelatives] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableUsers, setAvailableUsers] = useState<Autocomplete[]>([]);
  const [selectedNewUserId, setSelectedNewUserId] = useState<string>("");

  const {
    data: permissions,
    isLoading,
    isError,
  } = useSubmodulePermissions(submoduleId);

  const updatePermissions = useUpdateSubmodulePermissions();

  // Load available users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AutocompleteService.fetchAutocomplete(["users"]);
        setAvailableUsers(response.data.users || []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddUserFromSelect = () => {
    if (!selectedNewUserId) return;

    const userId = parseInt(selectedNewUserId);
    const user = availableUsers.find((u) => u.id === userId);

    if (user && !newUsers.find((u) => u.id === userId)) {
      const newUser: User = {
        id: userId,
        name: user.fullName || user.name || "",
        email: "", // This might not be available in autocomplete, but we include it for interface compliance
      };
      setNewUsers((prev) => [...prev, newUser]);
      setSelectedNewUserId("");
    }
  };

  const handleRemoveNewUser = (userId: number) => {
    setNewUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = async () => {
    try {
      await updatePermissions.mutateAsync({
        submoduleId,
        data: {
          removedUsers: selectedUsers.length > 0 ? selectedUsers : undefined,
          addedUsers:
            newUsers.length > 0 ? newUsers.map((u) => u.id) : undefined,
          addRelatives,
        },
      });
      setSelectedUsers([]);
      setNewUsers([]);
      setAddRelatives(false);
    } catch (error) {
      toast.error("Erro ao atualizar permissões. Tente novamente.");
      console.error("Erro ao atualizar permissões:", error);
    }
  };

  const filteredUsers =
    permissions?.users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciar Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciar Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Erro ao carregar permissões.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasChanges =
    selectedUsers.length > 0 || newUsers.length > 0 || addRelatives;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gerenciar Permissões
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gerencie quem tem acesso ao submódulo &quot;{submoduleTitle}&quot;
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {permissions?.totalUsers || 0} usuários com acesso
          </Badge>
          {hasChanges && (
            <Badge variant="outline">
              {selectedUsers.length} para remover, {newUsers.length} para
              adicionar
            </Badge>
          )}
        </div>

        {/* Add Relatives Option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addRelatives"
            checked={addRelatives}
            onCheckedChange={(checked) => setAddRelatives(checked as boolean)}
          />
          <Label htmlFor="addRelatives" className="text-sm">
            Incluir parentes dos usuários selecionados
          </Label>
        </div>

        {/* Add New Users */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Usuários
          </h4>
          <div className="flex gap-2">
            <Select
              value={selectedNewUserId}
              onValueChange={setSelectedNewUserId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um usuário para adicionar" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers
                  .filter((user) => !newUsers.find((nu) => nu.id === user.id))
                  .filter(
                    (user) =>
                      !permissions?.users?.find((pu) => pu.id === user.id)
                  )
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.fullName || user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddUserFromSelect}
              disabled={!selectedNewUserId}
              size="sm"
            >
              Adicionar
            </Button>
          </div>
        </div>

        {/* New Users to Add */}
        {newUsers.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Usuários para adicionar ({newUsers.length})
            </h4>
            <div className="space-y-2">
              {newUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveNewUser(user.id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Current Users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Usuários com Acesso</h4>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Nenhum usuário encontrado."
                : "Nenhum usuário tem acesso a este submódulo."}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map((u) => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[100px]">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserToggle(user.id)}
                          className={
                            selectedUsers.includes(user.id)
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {selectedUsers.includes(user.id) ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-1" />
                              Remover
                            </>
                          ) : (
                            "Manter"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Actions */}
        {hasChanges && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedUsers([]);
                setNewUsers([]);
                setAddRelatives(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updatePermissions.isPending}
            >
              {updatePermissions.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Aplicar Alterações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
