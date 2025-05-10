import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  BookOpen,
  Calendar,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDateRangePicker } from "@/components/date-range-picker";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de administração.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>15% de aumento</span>
                  <span className="ml-2">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faturamento
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 48.278,53</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>21.3% de aumento</span>
                  <span className="ml-2">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cursos Ativos
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>2 novos cursos</span>
                  <span className="ml-2">este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conclusão
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>7.2% de aumento</span>
                  <span className="ml-2">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>
                  Receita mensal vs. Usuários ativos dos últimos 7 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <span className="ml-2">Gráfico de estatísticas aqui</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  As últimas 10 atividades no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[350px] overflow-auto">
                <div className="space-y-8">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div
                        className={`mt-0.5 rounded-full p-1 ${getActivityColorClass(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center pt-1">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Próximas Reuniões</CardTitle>
                  <CardDescription>
                    Reuniões programadas para os próximos dias
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meeting.participants.slice(0, 2).join(", ")}
                          {meeting.participants.length > 2 &&
                            ` +${meeting.participants.length - 2}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          meeting.status === "scheduled"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {meeting.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Usuários Recentes</CardTitle>
                <CardDescription>
                  Últimos 5 usuários cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {user.joinedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Progresso dos Usuários</CardTitle>
                <CardDescription>
                  Média de conclusão do conteúdo por usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <span className="ml-2">Gráfico de progresso aqui</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Engajamento</CardTitle>
                <CardDescription>
                  Métricas de engajamento dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        Taxa de Conclusão
                      </div>
                      <div className="text-sm text-muted-foreground">78%</div>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        Participação em Fóruns
                      </div>
                      <div className="text-sm text-muted-foreground">45%</div>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        Download de Materiais
                      </div>
                      <div className="text-sm text-muted-foreground">62%</div>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>
                Selecione um relatório para visualizar ou exportar
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                >
                  {report.icon}
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {report.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                    <div className="pt-2">
                      <Badge variant="outline" className="text-xs">
                        {report.lastUpdated}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações Recentes</CardTitle>
              <CardDescription>
                Gerencie as notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start p-4 rounded-lg border"
                  >
                    <div
                      className={`mt-0.5 rounded-full p-1.5 ${getNotificationColorClass(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {notification.time}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sample data
const recentActivities = [
  {
    id: 1,
    type: "completion",
    title: "João Silva completou um módulo",
    description: "Módulo: Introdução ao Marketing Digital",
    time: "5 min atrás",
  },
  {
    id: 2,
    type: "creation",
    title: "Maria Santos criou um novo treinamento",
    description: "Treinamento: Marketing de Conteúdo",
    time: "2 horas atrás",
  },
  {
    id: 3,
    type: "meeting",
    title: "Pedro Almeida agendou uma reunião",
    description: "Assunto: Revisão de Metas | Dia 15/05 às 14:00",
    time: "3 horas atrás",
  },
  {
    id: 4,
    type: "creation",
    title: "Ana Costa adicionou uma nova aula",
    description: "Aula: SEO Avançado - Técnicas 2025",
    time: "5 horas atrás",
  },
  {
    id: 5,
    type: "payment",
    title: "Lucas Oliveira solicitou um pagamento",
    description: "Valor: R$ 2.500,00 | Motivo: Consultoria",
    time: "1 dia atrás",
  },
];

const upcomingMeetings = [
  {
    id: 1,
    title: "Revisão Mensal",
    participants: ["João Silva", "Maria Santos", "Pedro Almeida"],
    date: "Hoje, 14:00",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Planejamento Q2",
    participants: ["Ana Costa", "Lucas Oliveira", "João Silva"],
    date: "Amanhã, 10:00",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Onboarding Novos Colaboradores",
    participants: ["Pedro Almeida", "Gabriel Martins"],
    date: "25/05, 15:30",
    status: "scheduled",
  },
  {
    id: 4,
    title: "Análise de Feedback",
    participants: ["Maria Santos", "Carla Souza"],
    date: "26/05, 11:00",
    status: "scheduled",
  },
];

const recentUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "Colaborador",
    joinedAt: "5 min atrás",
    avatar: "",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "Administrador",
    joinedAt: "2 horas atrás",
    avatar: "",
  },
  {
    id: 3,
    name: "Pedro Almeida",
    email: "pedro@exemplo.com",
    role: "Colaborador",
    joinedAt: "1 dia atrás",
    avatar: "",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@exemplo.com",
    role: "Expert",
    joinedAt: "2 dias atrás",
    avatar: "",
  },
  {
    id: 5,
    name: "Lucas Oliveira",
    email: "lucas@exemplo.com",
    role: "Colaborador",
    joinedAt: "3 dias atrás",
    avatar: "",
  },
];

const reports = [
  {
    id: 1,
    name: "Relatório de Vendas",
    description: "Dados de vendas e conversões do último mês",
    lastUpdated: "Atualizado hoje",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    name: "Engajamento de Usuários",
    description: "Análise de engajamento e retenção",
    lastUpdated: "Atualizado ontem",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    name: "Progressão de Cursos",
    description: "Taxa de conclusão e tempo médio",
    lastUpdated: "Atualizado há 3 dias",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    name: "Relatório Financeiro",
    description: "Receitas, despesas e projeções",
    lastUpdated: "Atualizado há 1 semana",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
  },
];

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Novo usuário registrado",
    message: "João Silva criou uma conta no sistema.",
    time: "5 min atrás",
  },
  {
    id: 2,
    type: "info",
    title: "Atualização do sistema",
    message: "Uma nova versão do sistema está disponível.",
    time: "2 horas atrás",
  },
  {
    id: 3,
    type: "warning",
    title: "Pagamento pendente",
    message: "Há uma solicitação de pagamento aguardando aprovação.",
    time: "5 horas atrás",
  },
  {
    id: 4,
    type: "error",
    title: "Erro de sistema",
    message: "Ocorreu um erro ao processar um pagamento.",
    time: "1 dia atrás",
  },
];

function getActivityColorClass(type: string) {
  switch (type) {
    case "completion":
      return "bg-emerald-100 dark:bg-emerald-800";
    case "creation":
      return "bg-blue-100 dark:bg-blue-800";
    case "meeting":
      return "bg-purple-100 dark:bg-purple-800";
    case "payment":
      return "bg-amber-100 dark:bg-amber-800";
    default:
      return "bg-gray-100 dark:bg-gray-800";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "completion":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "creation":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "meeting":
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case "payment":
      return <DollarSign className="h-4 w-4 text-amber-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
}

function getNotificationColorClass(type: string) {
  switch (type) {
    case "success":
      return "bg-emerald-100 text-emerald-500 dark:bg-emerald-800";
    case "info":
      return "bg-blue-100 text-blue-500 dark:bg-blue-800";
    case "warning":
      return "bg-amber-100 text-amber-500 dark:bg-amber-800";
    case "error":
      return "bg-red-100 text-red-500 dark:bg-red-800";
    default:
      return "bg-gray-100 text-gray-500 dark:bg-gray-800";
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4" />;
    case "info":
      return <BellRing className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <BellRing className="h-4 w-4" />;
  }
}
