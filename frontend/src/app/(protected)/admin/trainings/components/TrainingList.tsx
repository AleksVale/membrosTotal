import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, MoreHorizontal, Trash, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Training {
  id: number;
  title: string;
  description: string;
  tutor: string;
  thumbnail?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  moduleCount?: number;
}

interface TrainingListProps {
  trainings: Training[];
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function TrainingList({
  trainings,
  isLoading,
  onDelete,
  onView,
  onEdit,
}: TrainingListProps) {
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const TABLE_COLUMN_COUNT = 7; // Número de colunas para uso com colSpan

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Professor</TableHead>
            <TableHead className="hidden md:table-cell">Módulos</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="hidden lg:table-cell">
              Atualizado em
            </TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={TABLE_COLUMN_COUNT}
                className="text-center py-6"
              >
                Nenhum treinamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="font-medium">{training.order}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{training.title}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline-block">
                      {training.description.length > 60
                        ? `${training.description.substring(0, 60)}...`
                        : training.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {training.tutor}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {training.moduleCount ? (
                    <Badge variant="secondary">{training.moduleCount}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Nenhum
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(training.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(training.updatedAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {onView && (
                        <DropdownMenuItem onClick={() => onView(training.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>
                      )}

                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(training.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/trainings/${training.id}/modules`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver módulos</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/trainings/${training.id}/permissions`}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <span>Permissões</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => setTrainingToDelete(training.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir treinamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este treinamento? Esta ação não
              pode ser desfeita e também excluirá todos os módulos, submódulos e
              aulas relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (trainingToDelete) {
                  onDelete(trainingToDelete);
                  setTrainingToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
