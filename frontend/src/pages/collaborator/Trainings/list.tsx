import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import useListTraining from './hooks/useListTraining'
import { ITraining } from '@/pages/admin/Training/interfaces'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import CarouselCustomItem from '@/components/CarouselCustomItem'

const TrainingList: React.FC = () => {
  const { trainings } = useListTraining()

  return (
    <div className="m-auto flex size-full flex-col items-center justify-center">
      <Helmet title="Treinamentos" />
      <BaseHeader label="Treinamentos" />
      <Carousel
        opts={{ loop: true, align: 'start' }}
        className="m-auto flex h-full w-2/3 items-center justify-center p-2"
      >
        <CarouselContent className="-ml-1">
          {trainings.map((training: ITraining) => (
            <CarouselItem className="basis-1/2 pl-4" key={training.id}>
              <CarouselCustomItem
                imageUrl={training.thumbnail ?? ''}
                title={training.title}
                navigateTo={`${training.id}/modules`}
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

export default TrainingList
