import * as React from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'
import { Autocomplete as AutocompleteOption } from '@/services/autocomplete.service'

interface AutocompleteProps {
  value: AutocompleteOption[]
  options: AutocompleteOption[]
  onChange: (value: AutocompleteOption[]) => void
}

export function Autocomplete({
  options,
  value,
  onChange,
}: Readonly<AutocompleteProps>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [, setSelected] = React.useState<AutocompleteOption[]>([])

  const handleUnselect = React.useCallback(
    (framework: AutocompleteOption) => {
      setSelected((prev) => {
        const result = prev.filter((s) => s.id !== framework.id)
        onChange(result)
        return result
      })
    },
    [onChange],
  )
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              onChange(newSelected)
              return newSelected
            })
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [onChange],
  )

  const selectables = options.filter((framework) => !value.includes(framework))

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {value.map((framework) => {
            return (
              <Badge key={framework.id} variant="secondary">
                {framework.label ?? framework.fullName}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(framework)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Selecione os usuários"
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-50 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((framework) => {
                return (
                  <CommandItem
                    key={framework.id}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue('')
                      setSelected((prev) => {
                        const result = [...prev, framework]
                        onChange(result)
                        return result
                      })
                    }}
                    className={'cursor-pointer'}
                  >
                    {framework.label ?? framework.fullName}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
