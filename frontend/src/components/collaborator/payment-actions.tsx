"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, FileText, TrendingUp } from "lucide-react";

interface PaymentActionsProps {
  onNewPayment: () => void;
  pendingCount: number;
}

export function PaymentActions({
  onNewPayment,
  pendingCount,
}: PaymentActionsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onNewPayment} className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="mr-2 h-4 w-4" />
            Relatório Mensal
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Exportar Dados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <div>
              <div className="font-medium">Pagamentos Pendentes</div>
              <div className="text-xs text-muted-foreground">
                Aguardando aprovação
              </div>
            </div>
            <div className="font-medium text-orange-600">{pendingCount}</div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <div>
              <div className="font-medium">Próximo Pagamento</div>
              <div className="text-xs text-muted-foreground">
                Previsão: 15/01
              </div>
            </div>
            <div className="font-medium text-green-600">R$ 1.200</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
