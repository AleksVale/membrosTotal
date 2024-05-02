import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ILesson } from '@/pages/admin/Lessons/interfaces'
import useListLesson from './hooks/useLessonTraining'
import { SidebarLesson } from '@/components/SidebarLesson'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle, Info } from 'lucide-react'
import { useGoBack } from '@/hooks/useGoBack'
import ReactPlayer from 'react-player'
const LessonList: React.FC = () => {
  const {
    lessons,
    selectedLesson,
    handleChangeLesson,
    videoError,
    handleInvalidURL,
    submoduleName,
    handleViewLesson,
    sawLesson,
  } = useListLesson()
  const { goBack } = useGoBack()

  return (
    <div className="m-auto flex size-full flex-col items-center">
      <Helmet title={selectedLesson?.title} />
      <section className="flex w-full gap-2">
        <div className=" h-[calc(100vh-200px)] w-full">
          {videoError ? (
            <div className=" flex size-full items-center justify-center p-2 text-center text-white">
              {videoError}
            </div>
          ) : (
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
          )}
          <Button variant={'ghost'} onClick={goBack} className="text-primary">
            <ArrowLeft className="size-4" />
            <span>Voltar para os conteúdos</span>
          </Button>
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 py-5 text-xl font-semibold tracking-tight">
              {selectedLesson?.title}
            </h3>
            {sawLesson ? (
              <Button variant={'outline'} className="gap-2">
                <CheckCircle className="size-3.5" />
                <span>Aula vista</span>
              </Button>
            ) : (
              <Button
                onClick={() => handleViewLesson(selectedLesson?.id)}
                variant={'secondary'}
              >
                Concluir Aula
              </Button>
            )}
          </div>
          <div className="display flex items-center gap-1">
            <Info className="size-3.5 font-semibold" />
            <span className="text-base font-semibold">Informações da aula</span>
          </div>
          <p className="pb-3 pt-1 text-gray-400">
            {selectedLesson?.description}
          </p>
        </div>
        <div className="bg-muted w-4/12 rounded-xl py-3">
          <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight">
            {submoduleName}
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
