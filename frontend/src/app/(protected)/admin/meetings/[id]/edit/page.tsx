"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingForm } from "@/components/meetings/meeting-form";
import http from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Meeting {
  id: number;
  title: string;
  description: string;
  link: string;
  date: string; // Modificado de meetingDate para date conforme backend
  UserMeeting: {
    User: {
      id: number;
      firstName: string;
      lastName: string;
    };
    userId: number;
  }[];
}

interface FormattedMeeting {
  id: number;
  title: string;
  description: string;
  link: string;
  meetingDate: string;
  users: number[];
}

export default function EditMeetingPage() {
  const params = useParams();
  const meetingId =
    typeof params.id === "string" ? parseInt(params.id, 10) : undefined;

  // Buscar dados da reunião usando React Query
  const {
    data: meeting,
    isLoading,
    isError,
  } = useQuery<FormattedMeeting>({
    queryKey: ["meeting", meetingId],
    queryFn: async () => {
      if (!meetingId) throw new Error("ID da reunião não fornecido");
      const response = await http.get<Meeting>(`/meetings/${meetingId}`);

      const formattedMeeting: FormattedMeeting = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        link: response.data.link,
        meetingDate:
          response.data.date.split("T")[0] +
          "T" +
          response.data.date.split("T")[1].substring(0, 5),
        users: response.data.UserMeeting.map((um) => um.userId),
      };

      return formattedMeeting;
    },
    enabled: !!meetingId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados da reunião...</span>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 text-lg mb-2">
          Não foi possível carregar os dados da reunião
        </div>
        <p className="text-muted-foreground">
          Verifique se a reunião existe ou tente novamente mais tarde
        </p>
      </div>
    );
  }

  // Garantir que todos os campos necessários estão presentes
  const validInitialData = {
    title: meeting.title || "",
    description: meeting.description || "",
    link: meeting.link || "",
    meetingDate: meeting.meetingDate || "",
    users: meeting.users || [],
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Reunião</h1>
        <p className="text-muted-foreground">Atualize os detalhes da reunião</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Reunião</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingForm initialData={validInitialData} meetingId={meetingId} />
        </CardContent>
      </Card>
    </div>
  );
}
