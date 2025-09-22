"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit,
  FileText,
  GraduationCap,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface TreeItem {
  id: number;
  title: string;
  description?: string;
  status?: string;
  order: number;
  type: "training" | "module" | "submodule" | "lesson";
  children?: TreeItem[];
  metadata?: {
    thumbnail?: string;
    tutor?: string;
    content?: string;
  };
}

interface TreeViewProps {
  data: TreeItem[];
  onAdd?: (parentId: number, type: TreeItem["type"]) => void;
  onEdit?: (item: TreeItem) => void;
  onDelete?: (item: TreeItem) => void;
  showActions?: boolean;
}

interface TreeNodeProps {
  item: TreeItem;
  level: number;
  onAdd?: (parentId: number, type: TreeItem["type"]) => void;
  onEdit?: (item: TreeItem) => void;
  onDelete?: (item: TreeItem) => void;
  showActions?: boolean;
}

const getNextChildType = (type: TreeItem["type"]): TreeItem["type"] | null => {
  switch (type) {
    case "training":
      return "module";
    case "module":
      return "submodule";
    case "submodule":
      return "lesson";
    default:
      return null;
  }
};

function getTypeIcon(type: string) {
  const iconClass = "w-4 h-4 mr-2";

  switch (type) {
    case "training":
      return <GraduationCap className={iconClass} />;
    case "module":
      return <BookOpen className={iconClass} />;
    case "submodule":
      return <FileText className={iconClass} />;
    case "lesson":
      return <Play className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
}

const getTypeColor = (type: TreeItem["type"]) => {
  switch (type) {
    case "training":
      return "bg-blue-100 text-blue-800";
    case "module":
      return "bg-green-100 text-green-800";
    case "submodule":
      return "bg-yellow-100 text-yellow-800";
    case "lesson":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function TreeNode({
  item,
  level,
  onAdd,
  onEdit,
  onDelete,
  showActions = true,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = item.children && item.children.length > 0;
  const nextChildType = getNextChildType(item.type);

  const indentLevel = level * 24;

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg group"
        style={{ paddingLeft: `${indentLevel + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setExpanded(!expanded)}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Type Icon */}
        <span className="text-lg">{getTypeIcon(item.type)}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{item.title}</h4>
            <Badge
              variant="secondary"
              className={`text-xs ${getTypeColor(item.type)}`}
            >
              {item.type === "training"
                ? "treinamento"
                : item.type === "module"
                ? "módulo"
                : item.type === "submodule"
                ? "submódulo"
                : item.type === "lesson"
                ? "aula"
                : item.type}
            </Badge>
            {item.status && (
              <Badge
                variant={item.status === "ACTIVE" ? "default" : "secondary"}
                className="text-xs"
              >
                {item.status === "ACTIVE"
                  ? "ATIVO"
                  : item.status === "INACTIVE"
                  ? "INATIVO"
                  : item.status}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">#{item.order}</span>
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate">
              {item.description}
            </p>
          )}
          {item.metadata?.tutor && (
            <p className="text-xs text-muted-foreground">
              Tutor: {item.metadata.tutor}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {nextChildType && onAdd && (
                  <DropdownMenuItem
                    onClick={() => onAdd(item.id, nextChildType)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar{" "}
                    {nextChildType === "module"
                      ? "Módulo"
                      : nextChildType === "submodule"
                      ? "Submódulo"
                      : "Aula"}
                  </DropdownMenuItem>
                )}

                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="ml-1">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({
  data,
  onAdd,
  onEdit,
  onDelete,
  showActions = true,
}: TreeViewProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum treinamento encontrado</p>
          {onAdd && (
            <Button className="mt-4" onClick={() => onAdd(0, "training")}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Treinamento
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          {data.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              level={0}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export type { TreeItem };
