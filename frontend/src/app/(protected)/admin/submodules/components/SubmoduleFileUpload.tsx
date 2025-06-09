"use client";

import { CheckCircle, File, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import http from "@/lib/http";

interface SubmoduleFileUploadProps {
  submoduleId: number;
  submoduleTitle: string;
  onUploadSuccess?: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export function SubmoduleFileUpload({
  submoduleId,
  submoduleTitle,
  onUploadSuccess,
}: SubmoduleFileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadFile = async (uploadFile: UploadFile, index: number) => {
    try {
      setUploadFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "uploading" as const } : f
        )
      );

      const formData = new FormData();
      formData.append("file", uploadFile.file);

      const response = await http.post(
        `/sub-modules-admin/${submoduleId}/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadFiles((prev) =>
                prev.map((f, i) => (i === index ? { ...f, progress } : f))
              );
            }
          },
        }
      );

      if (response.data.success) {
        setUploadFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "success" as const, progress: 100 }
              : f
          )
        );
        toast.success(
          `Arquivo &quot;${uploadFile.file.name}&quot; enviado com sucesso!`
        );
        onUploadSuccess?.();
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      setUploadFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error" as const,
                error: "Erro no upload",
              }
            : f
        )
      );
      toast.error(`Erro ao enviar arquivo &quot;${uploadFile.file.name}&quot;`);
    }
  };

  const handleUploadAll = () => {
    uploadFiles.forEach((fileItem, index) => {
      if (fileItem.status === "pending") {
        uploadFile(fileItem, index);
      }
    });
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadFiles((prev) =>
      prev.filter((f) => f.status === "pending" || f.status === "uploading")
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const pendingFiles = uploadFiles.filter((f) => f.status === "pending");
  const completedFiles = uploadFiles.filter(
    (f) => f.status === "success" || f.status === "error"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Arquivos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Envie arquivos para o submódulo &quot;{submoduleTitle}&quot;
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Suporta imagens, documentos e vídeos
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Selecionar Arquivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {/* Upload Queue */}
        {uploadFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Arquivos ({uploadFiles.length})</h4>
              <div className="flex gap-2">
                {pendingFiles.length > 0 && (
                  <Button size="sm" onClick={handleUploadAll}>
                    Enviar Todos ({pendingFiles.length})
                  </Button>
                )}
                {completedFiles.length > 0 && (
                  <Button size="sm" variant="outline" onClick={clearCompleted}>
                    Limpar Concluídos
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {uploadFiles.map((fileItem, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <File className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileItem.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileItem.status === "uploading" && (
                      <Progress value={fileItem.progress} className="mt-2" />
                    )}
                    {fileItem.status === "error" && fileItem.error && (
                      <p className="text-sm text-red-600 mt-1">
                        {fileItem.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {fileItem.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => uploadFile(fileItem, index)}
                      >
                        Enviar
                      </Button>
                    )}
                    {fileItem.status === "uploading" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {fileItem.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      disabled={fileItem.status === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
