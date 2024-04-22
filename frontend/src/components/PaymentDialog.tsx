import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useState } from 'react'
import {
  Payment,
  PaymentResponseDto,
  PaymentStatus,
  RefundResponseDto,
} from '@/utils/interfaces/payment'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

interface PaymentDialogProps {
  data: Payment | RefundResponseDto | PaymentResponseDto
  cancel: (
    id: number,
    status: PaymentStatus,
    cancelReason: string,
  ) => Promise<void>
  navigateOnEdit: string
  type: 'pagamento' | 'reembolso' | 'solicitação de compra'
}

export function PaymentDialog({
  data,
  cancel,
  navigateOnEdit,
  type,
}: Readonly<PaymentDialogProps>) {
  const navigate = useNavigate()
  const [cancelReason, setCancelReason] = useState('Cancelado pelo usuário')
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
          <DropdownMenuItem
            onClick={() =>
              data.status === PaymentStatus.PENDING
                ? navigate(navigateOnEdit)
                : toast.error(
                    `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} finalizada, não é possível editar`,
                  )
            }
            className="group flex items-center gap-2"
          >
            <Edit size={16} className="text-primary" />
            <span className="group-hover:text-primary">Editar {type}</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="group flex items-center gap-2">
              <Trash size={16} className="text-destructive" />
              <span className="group-hover:text-destructive">
                Cancelar {type}
              </span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
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
            defaultValue={cancelReason}
            className="col-span-3"
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={'destructive'}
              onClick={() => cancel(data.id, data.status, cancelReason)}
            >
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
