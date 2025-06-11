"use client";

import {
  BookOpen,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulePermissions } from "./components/ModulePermissions";
import { PermissionsOverview } from "./components/PermissionsOverview";
import { PermissionsStats } from "./components/PermissionsStats";
import { SubmodulePermissions } from "./components/SubmodulePermissions";
import { TrainingPermissions } from "./components/TrainingPermissions";
import { UserPermissions } from "./components/UserPermissions";

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState(() => {
    // Recuperar a última aba ativa do localStorage, se disponível
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("permissions-active-tab");
      return savedTab || "overview";
    }
    return "overview";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Salvar a aba ativa no localStorage quando mudar
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("permissions-active-tab", value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="hidden sm:inline">
              Gerenciamento de Permissões
            </span>
            <span className="sm:hidden">Permissões</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            <span className="hidden sm:inline">
              Controle completo de acesso aos treinamentos, módulos, submódulos
              e aulas
            </span>
            <span className="sm:hidden">Controle de acesso a recursos</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8 w-full sm:w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="trainings">Treinamentos</SelectItem>
              <SelectItem value="modules">Módulos</SelectItem>
              <SelectItem value="submodules">Submódulos</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <PermissionsStats searchTerm={searchTerm} filterType={filterType} />

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-1 sm:gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline">Visão Geral</span>
            <span className="md:hidden">Visão</span>
          </TabsTrigger>
          <TabsTrigger
            value="trainings"
            className="flex items-center gap-1 sm:gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden xs:inline">Treinamentos</span>
            <span className="xs:hidden">Trein.</span>
          </TabsTrigger>
          <TabsTrigger
            value="modules"
            className="flex items-center gap-1 sm:gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Módulos</span>
          </TabsTrigger>
          <TabsTrigger
            value="submodules"
            className="flex items-center gap-1 sm:gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Submódulos</span>
            <span className="sm:hidden">Submód.</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex items-center gap-1 sm:gap-2"
          >
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PermissionsOverview
            searchTerm={searchTerm}
            filterType={filterType}
          />
        </TabsContent>

        <TabsContent value="trainings" className="space-y-6">
          <TrainingPermissions searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <ModulePermissions searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="submodules" className="space-y-6">
          <SubmodulePermissions searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserPermissions searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
