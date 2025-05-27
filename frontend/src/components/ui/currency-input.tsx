import Currency from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: string | number | undefined;
  onChange: (value: number | null | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function CurrencyInput({
  onChange,
  value,
  placeholder = "Valor",
  className,
}: Readonly<CurrencyInputProps>) {
  return (
    <Currency
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      placeholder={placeholder}
      allowDecimals={true}
      prefix="R$ "
      defaultValue={value}
      decimalsLimit={2}
      onValueChange={(_, _name, values) => onChange(values?.float)}
      intlConfig={{ locale: "pt-BR", currency: "BRL" }}
      data-slot="input"
    />
  );
}
