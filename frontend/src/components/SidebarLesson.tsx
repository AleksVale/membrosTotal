import { PlayCircle } from 'lucide-react'
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
      className="data-[selected=true]:text-primary group w-full justify-start gap-1 text-left"
      data-selected={isSelected}
      onClick={() => handleClick(lesson)}
    >
      <PlayCircle className="group-hover:text-primary " />
      <span className="group-hover:text-primary">{lesson.title}</span>
    </Button>
  )
}
