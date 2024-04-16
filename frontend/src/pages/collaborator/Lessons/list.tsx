import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ILesson } from '@/pages/admin/Lessons/interfaces'
import useListLesson from './hooks/useLessonTraining'
import { SidebarLesson } from '@/components/SidebarLesson'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useGoBack } from '@/hooks/useGoBack'
import ReactPlayer from 'react-player'
const LessonList: React.FC = () => {
  const {
    lessons,
    selectedLesson,
    handleChangeLesson,
    videoError,
    handleInvalidURL,
  } = useListLesson()
  const { goBack } = useGoBack()

  return (
    <div className="m-auto flex size-full flex-col items-center">
      <Helmet title="Aulas" />
      <section className="flex w-full gap-2">
        <div className=" h-[calc(100vh-200px)] w-full">
          {videoError && (
            <div className=" flex size-full items-center justify-center p-2 text-center text-white">
              {videoError}
            </div>
          )}
          <ReactPlayer
            width={'100%'}
            height={'100%'}
            url={selectedLesson?.content}
            controls={true}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1, // Hide YouTube logo
                  showinfo: 0, // Hide video title and player actions
                  rel: 0, // Do not show related videos at the end
                },
              },
            }}
            fallback={<div>Video não encontrado</div>}
            onError={handleInvalidURL}
          />
          <Button variant={'link'} onClick={goBack} className="p-0">
            <ArrowLeft className="size-4" />
            <span>Voltar</span>
          </Button>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {selectedLesson?.title}
          </h3>
        </div>
        <div className="bg-muted w-4/12 rounded py-3">
          <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight">
            Conteúdos
          </h4>
          <div>
            {lessons.map((lesson: ILesson) => (
              <SidebarLesson
                key={lesson.id}
                lesson={lesson}
                isSelected={lesson.id === selectedLesson?.id}
                handleClick={handleChangeLesson}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LessonList
