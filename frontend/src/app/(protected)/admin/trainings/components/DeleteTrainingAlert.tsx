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
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import http from "@/lib/http";

interface DeleteTrainingAlertProps {
  trainingId: number;
}

export function DeleteTrainingAlert({ trainingId }: DeleteTrainingAlertProps) {
  const queryClient = useQueryClient();

  const deleteTraining = useMutation({
    mutationFn: async () => {
      await http.delete(`/training-admin/${trainingId}`);
    },
    onSuccess: () => {
      toast.success("Treinamento excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.trainings.all });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir treinamento");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir treinamento?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação é irreversível. Isso excluirá permanentemente este
          treinamento e todos os seus módulos, submódulos e aulas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              deleteTraining.mutate();
            }}
            disabled={deleteTraining.isPending}
          >
            {deleteTraining.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir treinamento"
            )}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
