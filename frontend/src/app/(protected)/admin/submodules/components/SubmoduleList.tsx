"use client";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Trash,
} from "lucide-react";
import { DeleteSubmoduleAlert } from "./DeleteSubmoduleAlert";

interface Submodule {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  order: number;
  moduleId: number;
  module: {
    id: number;
    title: string;
    trainingId: number;
    training?: {
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  lessonCount?: number;
}

interface SubmoduleListProps {
  submodules: Submodule[];
  isDeletingId: number | null;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onManageLessons?: (id: number, moduleId: number, trainingId: number) => void;
}

export function SubmoduleList({
  submodules,
  isDeletingId,
  onView,
  onEdit,
  onDelete,
  onManageLessons,
}: SubmoduleListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Módulo</TableHead>
            <TableHead className="hidden lg:table-cell">Treinamento</TableHead>
            <TableHead className="hidden md:table-cell">Aulas</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submodules.map((submodule) => {
            const isDeleting = isDeletingId === submodule.id;

            return (
              <TableRow key={submodule.id}>
                <TableCell>
                  <Badge variant="secondary">{submodule.order}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {submodule.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {submodule.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {submodule.module.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="space-y-1">
                    <p className="text-sm">
                      {submodule.module.training?.title || "N/A"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">
                    {submodule.lessonCount || 0} aula
                    {submodule.lessonCount !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {format(new Date(submodule.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem
                            onClick={() => onView(submodule.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ver detalhes</span>
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(submodule.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                        )}
                        {onManageLessons && (
                          <DropdownMenuItem
                            onClick={() =>
                              onManageLessons(
                                submodule.id,
                                submodule.moduleId,
                                submodule.module.trainingId
                              )
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Gerenciar Aulas</span>
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {onDelete && (
                      <DeleteSubmoduleAlert
                        submoduleId={submodule.id}
                        onDelete={onDelete}
                      />
                    )}
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
