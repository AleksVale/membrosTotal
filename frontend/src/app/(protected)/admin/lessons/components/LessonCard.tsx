"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-utils";
import { Edit, ExternalLink, Eye, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  order: number;
  submoduleId: number;
  submodule: {
    id: number;
    title: string;
    module: {
      id: number;
      title: string;
      trainingId: number;
    };
  };
}

interface LessonCardProps {
  lesson: Lesson;
  isDeletingId?: number | null;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function LessonCard({
  lesson,
  isDeletingId,
  onView,
  onEdit,
  onDelete,
}: LessonCardProps) {
  const isDeleting = isDeletingId === lesson.id;

  return (
    <Card className="h-full flex flex-col overflow-hidden min-w-0">
      <CardHeader className="p-0">
        <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
          {lesson.thumbnail ? (
            <Image
              src={getImageUrl(lesson.thumbnail) || "/placeholder.jpg"}
              alt={lesson.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">Sem imagem</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              #{lesson.order}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-3 sm:p-4 min-w-0">
        <div className="space-y-2 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight break-words">
            {lesson.title}
          </h3>

          {lesson.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
              {lesson.description}
            </p>
          )}

          <div className="space-y-2 min-w-0">
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block mb-1">
                Submódulo:
              </span>
              <Badge
                variant="outline"
                className="text-xs w-full justify-start truncate max-w-full"
              >
                {lesson.submodule.title}
              </Badge>
            </div>

            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block mb-1">
                Módulo:
              </span>
              <span className="font-medium text-xs block truncate">
                {lesson.submodule.module.title}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex flex-col gap-2">
        {/* Layout em grid 2x2 para telas pequenas */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(lesson.id)}
            className="text-xs px-2 py-1 h-8 flex items-center justify-center"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Ver</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lesson.id)}
            className="text-xs px-2 py-1 h-8 flex items-center justify-center"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Editar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(lesson.content, "_blank")}
            className="text-xs px-2 py-1 h-8 flex items-center justify-center"
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Acessar</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(lesson.id)}
            disabled={isDeleting}
            className="text-xs px-2 py-1 h-8 flex items-center justify-center"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
