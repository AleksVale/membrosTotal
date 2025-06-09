"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteLessonAlert } from "./DeleteLessonAlert";

interface LessonListItem {
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
  createdAt: string;
  updatedAt: string;
}

interface LessonListProps {
  lessons: LessonListItem[];
  onDelete: (id: number) => Promise<void>;
  isDeleting: boolean;
}

export function LessonList({ lessons, onDelete, isDeleting }: LessonListProps) {
  const router = useRouter();
  const [lessonToDelete, setLessonToDelete] = useState<LessonListItem | null>(
    null
  );

  const handleView = (id: number) => {
    router.push(`/admin/lessons/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/lessons/${id}/edit`);
  };

  const handleDeleteClick = (lesson: LessonListItem) => {
    setLessonToDelete(lesson);
  };

  const handleDeleteConfirm = async () => {
    if (lessonToDelete) {
      await onDelete(lessonToDelete.id);
      setLessonToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setLessonToDelete(null);
  };

  if (!lessons.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma aula encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Submódulo</TableHead>
            <TableHead>Módulo</TableHead>
            <TableHead className="text-center">Ordem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{lesson.title}</div>
                  {lesson.description && (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {lesson.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{lesson.submodule.title}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{lesson.submodule.module.title}</div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{lesson.order}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(lesson.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(lesson.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(lesson)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {lessonToDelete && (
        <DeleteLessonAlert
          isOpen={!!lessonToDelete}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          lessonTitle={lessonToDelete.title}
        />
      )}
    </>
  );
}
