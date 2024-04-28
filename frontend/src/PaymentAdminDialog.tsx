import { CheckSquare, DownloadCloud, MoreHorizontal, Trash } from 'lucide-react'

import { useState } from 'react'
import {
  Payment,
  PaymentResponseDto,
  PaymentStatus,
  RefundResponseDto,
} from '@/utils/interfaces/payment'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
import { Button } from './components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'

interface PaymentDialogProps {
  data: Payment | RefundResponseDto | PaymentResponseDto
  cancel: (
    id: number,
    status: PaymentStatus,
    cancelReason: string,
  ) => Promise<void>
  confirmPaidPayment: (
    id: number,
    status: PaymentStatus,
    reason: string,
    file: File,
  ) => Promise<void>
  downloadFile: (id: number) => Promise<void>
  navigateOnEdit: string
  type: 'pagamento' | 'reembolso' | 'solicitação de compra'
}

export function PaymentAdminDialog({
  data,
  cancel,
  type,
  downloadFile,
  confirmPaidPayment,
}: Readonly<PaymentDialogProps>) {
  const [reason, setReason] = useState('Cancelado pelo usuário')
  const [file, setFile] = useState<File | null>(null)
  const [cancelType, setCancelType] = useState(false)

  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const renderConfirm = () => {
    if (cancelType) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Você tem certeza que deseja
              cancelar esse {type}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-right">
              Motivo
            </Label>
            <Input
              id="reason"
              defaultValue={reason}
              className="col-span-3"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={'destructive'}
                onClick={() => cancel(data.id, data.status, reason)}
              >
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )
    }
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Você tem certeza que deseja
            confirmar esse {type}?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-right">
            Descrição
          </Label>
          <Textarea
            id="reason"
            defaultValue={''}
            className="col-span-3"
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file" className="text-right">
            Arquivo
          </Label>
          <Input
            id="file"
            type="file"
            className="col-span-3"
            onChange={handleChangePhoto}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={'secondary'}
              onClick={() =>
                confirmPaidPayment(data.id, data.status, reason, file as File)
              }
            >
              Confirmar pagamento
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    )
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setCancelType(false)}
              className="group flex items-center gap-2"
            >
              <CheckSquare size={16} className="text-green-300" />
              <span className="group-hover:text-green-300">
                Confirmar {type}
              </span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="group flex items-center gap-2"
              onClick={() => setCancelType(true)}
            >
              <Trash size={16} className="text-destructive" />
              <span className="group-hover:text-destructive">Negar {type}</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            className="group flex items-center gap-2"
            onClick={() => downloadFile(data.id)}
          >
            <DownloadCloud size={16} className="text-primary" />
            <span className="group-hover:text-primary">Baixar {type}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {renderConfirm()}
    </Dialog>
  )
}
