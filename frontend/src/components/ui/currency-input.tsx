import Currency from 'react-currency-input-field'

interface CurrencyInputProps {
  value: string | number | undefined
  onChange: (value: number | null | undefined) => void
}
export function CurrencyInput({ onChange, value }: CurrencyInputProps) {
  return (
    <Currency
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Valor"
      allowDecimals={true}
      prefix="R$"
      defaultValue={value}
      decimalsLimit={2}
      onValueChange={(_, _name, values) => onChange(values?.float)}
      intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
    />
  )
}
