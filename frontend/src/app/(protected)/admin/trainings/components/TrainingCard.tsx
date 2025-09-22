import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Eye, MoreVertical, Users } from "lucide-react";
import Image from "next/image";
import { DeleteTrainingAlert } from "./DeleteTrainingAlert";

interface TrainingCardProps {
  training: {
    id: number;
    title: string;
    description: string;
    tutor: string;
    thumbnail?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
    totalStudents?: number;
    totalModules?: number;
  };
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export function TrainingCard({ training, onView, onEdit }: TrainingCardProps) {
  const getStatusBadge = () => {
    switch (training.status) {
      case "ACTIVE":
        return <Badge>Ativo</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Rascunho</Badge>;
      case "ARCHIVED":
        return <Badge variant="secondary">Arquivado</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video w-full">
        {training ? (
          <Image
            src={`https://pub-5d54aa14d19d48d4bac5298564dde31b.r2.dev/membros/${training.thumbnail}`}
            alt={training.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-muted/30 h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sem imagem</p>
          </div>
        )}
        <div className="absolute top-2 right-2">{getStatusBadge()}</div>
      </div>

      <CardHeader className="p-4 pb-0 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-2">{training.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(training.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(training.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    <Eye className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DeleteTrainingAlert trainingId={training.id} />
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {training.description}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <p className="text-sm">
          <span className="font-medium">Tutor:</span> {training.tutor}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Atualizado em{" "}
          {format(new Date(training.updatedAt), "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          {training.totalStudents || 0} aluno
          {training.totalStudents !== 1 ? "s" : ""}
        </div>
        <div className="text-sm text-muted-foreground">
          {training.totalModules || 0} módulo
          {training.totalModules !== 1 ? "s" : ""}
        </div>
      </CardFooter>
    </Card>
  );
}
