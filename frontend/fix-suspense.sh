#!/bin/bash

# Script para adicionar Suspense wrapper nas páginas que usam useSearchParams

# Páginas collaborator que precisam de fix
pages=(
  "src/app/(protected)/collaborator/submodules/page.tsx"
  "src/app/(protected)/collaborator/lessons/page.tsx"
  "src/app/(protected)/collaborator/modules/page.tsx"
)

for page in "${pages[@]}"; do
  echo "Processando $page..."
  
  # Verificar se já tem Suspense
  if grep -q "Suspense" "$page"; then
    echo "  - Já tem Suspense, pulando..."
    continue
  fi
  
  # Pegar o nome da função default export
  func_name=$(grep "export default function" "$page" | sed 's/export default function \([^(]*\).*/\1/')
  
  if [ -z "$func_name" ]; then
    echo "  - Não encontrou export default, pulando..."
    continue
  fi
  
  echo "  - Função encontrada: $func_name"
  
  # Fazer backup
  cp "$page" "$page.bak"
  
  # 1. Adicionar Suspense no import de react
  sed -i 's/from "react";/, Suspense } from "react";/' "$page"
  
  # 2. Remover export default e criar função interna
  sed -i "s/export default function $func_name/function $func_name/" "$page"
  
  # 3. Adicionar wrapper no final do arquivo
  echo "" >> "$page"
  echo "export default function ${func_name}Wrapper() {" >> "$page"
  echo "  return (" >> "$page"
  echo "    <Suspense fallback={<div>Carregando...</div>}>" >> "$page"
  echo "      <$func_name />" >> "$page"
  echo "    </Suspense>" >> "$page"
  echo "  );" >> "$page"
  echo "}" >> "$page"
  
  echo "  - Concluído!"
done

echo "Todas as páginas processadas!"
