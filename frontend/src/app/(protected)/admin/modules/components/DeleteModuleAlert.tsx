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
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteModuleAlertProps {
  moduleId: number;
  onDelete: (id: number) => Promise<void>;
}

export function DeleteModuleAlert({
  moduleId,
  onDelete,
}: DeleteModuleAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return; // Evita chamadas múltiplas

    setIsDeleting(true);
    try {
      await onDelete(moduleId);
      // Não precisa de setState aqui, pois o componente será desmontado quando o alerta fechar
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
      setIsDeleting(false); // Só reseta em caso de erro para permitir nova tentativa
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir módulo</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este módulo? Esta ação não pode ser
          desfeita e também excluirá todos os submódulos e aulas relacionadas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Excluindo...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Confirmar exclusão
            </>
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
