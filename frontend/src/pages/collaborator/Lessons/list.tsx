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
import { ILesson } from '@/pages/admin/Lessons/interfaces'
import useListLesson from './hooks/useLessonTraining'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'

const LessonList: React.FC = () => {
  const { lessons, id, moduleId } = useListLesson()

  return (
    <div className="m-auto flex size-full flex-col items-center justify-center">
      <Helmet title="Aulas" />
      <BaseHeader label="Aulas" />
      <Carousel
        opts={{ loop: true, align: 'start' }}
        className="m-auto flex h-full w-2/3 items-center justify-center p-2"
      >
        <CarouselContent className="-ml-1">
          {lessons.map((lesson: ILesson) => (
            <CarouselItem className="basis-1/2 pl-4" key={lesson.id}>
              <CarouselCustomItem
                imageUrl={lesson.thumbnail ?? ''}
                title={lesson.title}
                navigateTo={COLLABORATOR_PAGES.lessonsList(
                  id,
                  moduleId,
                  lesson.id,
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

export default LessonList
