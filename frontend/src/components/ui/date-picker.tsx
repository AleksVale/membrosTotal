import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  minYear?: number
  maxYear?: number
  layout?: 'dropdown' | 'buttons'
}

export function DatePicker({
  selected,
  onSelect,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  layout = 'buttons',
}: Readonly<DatePickerProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, 'dd/MM/yyyy')
          ) : (
            <span>Selecione uma data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          captionLayout={layout}
          fromYear={minYear}
          toYear={maxYear}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
