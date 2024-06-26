import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import CarouselCustomItem from '@/components/CarouselCustomItem'
import { IModule } from '@/pages/admin/Modules/interfaces'
import useListModule from './hooks/useListModule'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'

const ModuleList: React.FC = () => {
  const { modules, id } = useListModule()

  return (
    <div className="m-auto flex size-full flex-col items-center justify-center">
      <Helmet title="Módulos" />
      <BaseHeader label="Módulos" />
      <Carousel
        opts={{ loop: true, align: 'start' }}
        className="m-auto flex h-full w-2/3 items-center justify-center p-2"
      >
        <CarouselContent className="-ml-1">
          {modules.map((module: IModule) => (
            <CarouselItem className="basis-1/2 pl-4" key={module.id}>
              <CarouselCustomItem
                imageUrl={module.thumbnail ?? ''}
                title={module.title}
                navigateTo={COLLABORATOR_PAGES.subModulesList(id, module.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default ModuleList
