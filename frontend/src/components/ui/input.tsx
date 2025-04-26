import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        const value = props.value
        if (value?.toString().length === 1 && value === 0) {
          e.target.value = e.target.value.replace(/^0+/, '')
        }
      }
      if (props.onChange) {
        props.onChange(e)
      }
    }
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
        onChange={handleChangeInput}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
