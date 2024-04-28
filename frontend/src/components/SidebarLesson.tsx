import { CheckCircle, Play } from 'lucide-react'
import { Button } from './ui/button'
import { ILesson } from '@/pages/admin/Lessons/interfaces'

interface ISidebarLessonProps {
  lesson: ILesson
  isSelected: boolean
  handleClick: (lesson: ILesson) => void
}

export const SidebarLesson = ({
  lesson,
  isSelected,
  handleClick,
}: ISidebarLessonProps) => {
  return (
    <Button
      key={lesson.id}
      variant={'ghost'}
      className="data-[selected=true]:text-primary group w-full items-center justify-start gap-2 text-left"
      data-selected={isSelected}
      onClick={() => handleClick(lesson)}
    >
      {lesson.UserViewLesson.length > 0 ? (
        <CheckCircle className="group-hover:text-primary size-4" />
      ) : (
        <Play className="group-hover:text-primary size-4" />
      )}
      <span className="group-hover:text-primary">{lesson.title}</span>
    </Button>
  )
}
