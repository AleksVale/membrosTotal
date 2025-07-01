"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Play,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Lesson {
  id: number;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "LOCKED";
  type: "VIDEO" | "TEXT" | "PDF";
  duration: number;
  submoduleId: number;
  submoduleTitle: string;
}

interface LessonsResponse {
  data: Lesson[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export default function CollaboratorLessonsPage() {
  const searchParams = useSearchParams();
  const submoduleId = searchParams.get("submoduleId");

  const { data, isLoading, isError } = useQuery<LessonsResponse>({
    queryKey: QueryKeys.collaborator.lessons.list(submoduleId || "all"),
    queryFn: async () => {
      const response = await http.get("/collaborator/lessons-collaborator", {
        params: { submoduleId: submoduleId || undefined },
      });
      return response.data;
    },
    staleTime: 60000, // 1 minuto
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar as aulas.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const lessons = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="default"
            className="bg-success text-success-foreground"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            <Clock className="h-3 w-3 mr-1" />
            Em andamento
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Lock className="h-3 w-3 mr-1" />
            Bloqueado
          </Badge>
        );
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4 mr-2 text-muted-foreground" />;
      case "PDF":
        return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  };

  const groupedLessons = lessons.reduce<Record<number, Lesson[]>>(
    (acc, lesson) => {
      const submoduleId = lesson.submoduleId;
      if (!acc[submoduleId]) {
        acc[submoduleId] = [];
      }
      acc[submoduleId].push(lesson);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Aulas</h1>
          <p className="text-muted-foreground">
            Acesse as aulas dos seus submódulos
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link
            href={
              submoduleId
                ? `/collaborator/submodules?moduleId=${submoduleId}`
                : "/collaborator/submodules"
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Submódulos
          </Link>
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">
              {submoduleId
                ? "Nenhuma aula encontrada para este submódulo."
                : "Nenhuma aula disponível no momento."}
            </p>
            {submoduleId && (
              <Button asChild variant="outline">
                <Link href="/collaborator/lessons">Ver todas as aulas</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedLessons).map(([submoduleId, lessons]) => (
          <div key={submoduleId} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {lessons[0].submoduleTitle}
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/collaborator/submodules/${submoduleId}`}>
                  Ver submódulo
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      {getStatusBadge(lesson.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {lesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getLessonTypeIcon(lesson.type)}
                        <span className="text-sm">
                          {lesson.type === "VIDEO"
                            ? "Vídeo"
                            : lesson.type === "PDF"
                            ? "PDF"
                            : "Texto"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(lesson.duration)}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      disabled={lesson.status === "LOCKED"}
                      variant={
                        lesson.status === "LOCKED" ? "secondary" : "default"
                      }
                    >
                      <Link href={`/collaborator/lessons/${lesson.id}`}>
                        {lesson.status === "LOCKED" ? (
                          "Bloqueado"
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            {lesson.status === "COMPLETED"
                              ? "Revisar"
                              : "Assistir"}
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
