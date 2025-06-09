"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSubmoduleAlertProps {
  submoduleId: number;
  onDelete: (id: number) => Promise<void>;
}

export function DeleteSubmoduleAlert({
  submoduleId,
  onDelete,
}: DeleteSubmoduleAlertProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir submódulo</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este submódulo? Esta ação não pode ser
          desfeita e todas as aulas relacionadas também serão excluídas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onDelete(submoduleId)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Confirmar exclusão
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
