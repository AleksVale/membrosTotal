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
import { ISubModule } from '@/pages/admin/SubModules/interfaces'
import useListSubmodule from './hooks/useSubmoduleTraining'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'

const SubmoduleList: React.FC = () => {
  const { submodules, id, moduleId } = useListSubmodule()

  return (
    <div className="m-auto flex size-full flex-col items-center justify-center">
      <Helmet title="Submódulos" />
      <BaseHeader label="Submódulos" />
      <Carousel
        opts={{ loop: true, align: 'start' }}
        className="m-auto flex h-full w-2/3 items-center justify-center p-2"
      >
        <CarouselContent className="-ml-1">
          {submodules.map((submodule: ISubModule) => (
            <CarouselItem className="basis-1/2 pl-4" key={submodule.id}>
              <CarouselCustomItem
                imageUrl={submodule.thumbnail ?? ''}
                title={submodule.title}
                navigateTo={COLLABORATOR_PAGES.lessonsList(
                  id,
                  moduleId,
                  submodule.id,
                  submodule.title,
                )}
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

export default SubmoduleList
