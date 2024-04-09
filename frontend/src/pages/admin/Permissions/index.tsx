import { Button } from '@/components/ui/button'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export const Permissions: React.FC = () => {
  return (
    <section>
      <Helmet title="Permissões" />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Selecione uma categoria de permissões
      </h1>
      <div className="flex justify-around gap-6 pt-56">
        <Button asChild className="h-60 w-full">
          <Link to={ADMIN_PAGES.trainingPermissions}>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Treinamentos
            </h2>
          </Link>
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
