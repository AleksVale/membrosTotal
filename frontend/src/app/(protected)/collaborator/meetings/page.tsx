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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { format, isPast, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  participants: number;
}

interface MeetingsResponse {
  data: Meeting[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export default function CollaboratorMeetingsPage() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  const { data, isLoading, isError } = useQuery<MeetingsResponse>({
    queryKey: QueryKeys.collaborator.meetings.list(activeTab),
    queryFn: async () => {
      const status = activeTab === "past" ? "past" : "upcoming";
      const response = await http.get("/collaborator/meetings", {
        params: { status },
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
          Ocorreu um erro ao carregar as reuniões.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const meetings = data?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isSameDay(date, new Date())) {
      return "Hoje, " + format(date, "HH:mm", { locale: ptBR });
    }
    return format(date, "dd 'de' MMMM', às 'HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (meeting: Meeting) => {
    if (meeting.status === "CANCELLED") {
      return <Badge variant="destructive">Cancelada</Badge>;
    }

    if (meeting.status === "COMPLETED" || isPast(new Date(meeting.endDate))) {
      return <Badge variant="secondary">Concluída</Badge>;
    }

    if (isSameDay(new Date(meeting.startDate), new Date())) {
      return (
        <Badge variant="default" className="bg-success text-success-foreground">
          Hoje
        </Badge>
      );
    }

    return <Badge>Agendada</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Reuniões</h1>
        <p className="text-muted-foreground">
          Acompanhe suas reuniões agendadas
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Anteriores</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {meetings.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">
                  {activeTab === "upcoming"
                    ? "Você não tem reuniões agendadas."
                    : "Você não tem reuniões anteriores."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{meeting.title}</CardTitle>
                      {getStatusBadge(meeting)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {meeting.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {formatDate(meeting.startDate)} até{" "}
                          {format(new Date(meeting.endDate), "HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {meeting.isVirtual ? (
                        <div className="flex items-center text-sm">
                          <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Reunião virtual</span>
                        </div>
                      ) : meeting.location ? (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{meeting.location}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {meeting.participants}{" "}
                          {meeting.participants === 1
                            ? "participante"
                            : "participantes"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {format(
                            new Date(meeting.endDate).getTime() -
                              new Date(meeting.startDate).getTime(),
                            "H'h' mm'min'",
                            { locale: ptBR }
                          )}
                        </span>
                      </div>
                    </div>

                    {meeting.isVirtual && meeting.meetingUrl && (
                      <Button
                        className="mt-4 w-full"
                        disabled={
                          meeting.status === "CANCELLED" ||
                          meeting.status === "COMPLETED" ||
                          isPast(new Date(meeting.endDate))
                        }
                        onClick={() =>
                          window.open(meeting.meetingUrl, "_blank")
                        }
                      >
                        Entrar na reunião
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
