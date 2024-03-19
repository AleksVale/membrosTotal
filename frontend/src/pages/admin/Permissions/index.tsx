import { Button } from '@/components/ui/button'
import React from 'react'
import { Helmet } from 'react-helmet-async'

export const Permissions: React.FC = () => {
  return (
    <section>
      <Helmet title="Permissões" />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Selecione uma categoria de permissões
      </h1>
      <div className="flex justify-around gap-6 pt-56">
        <Button className="h-60 w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Treinamentos
          </h2>
        </Button>
        <Button className="h-60 w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Módulos
          </h2>
        </Button>
        <Button className="h-60 w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Submódulos
          </h2>
        </Button>
      </div>
    </section>
  )
}
