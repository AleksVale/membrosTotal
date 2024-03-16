import React from 'react'
import useListTraining from './hooks/useListTraining'
import CarouselTrainingItem from '@/components/CarouselTrainingItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import imagem from '../../../assets/logo.jpg'

const TrainingList: React.FC = () => {
  // const { trainings, error, isLoading } = useListTraining()

  return (
    <div className="m-auto flex size-full items-center justify-center">
      {/* {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <h1>Trainings</h1>
      {trainings.map((training) => (
        <div key={training.id}>
          <h3>{training.tutor}</h3>
          <p>Date: {training.tutor}</p>
        </div>
      ))} */}
      <Carousel
        opts={{ loop: true, align: 'start' }}
        className="m-auto flex h-full w-2/3 items-center justify-center p-2"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/2">
            <CarouselTrainingItem imageUrl={imagem} title="galo" />
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <CarouselTrainingItem imageUrl={''} title="doido" />
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <CarouselTrainingItem imageUrl={''} title="doido" />
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <CarouselTrainingItem imageUrl={''} title="doido" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default TrainingList
