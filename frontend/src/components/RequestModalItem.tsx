import { englishToPortugueseMapping } from '@/utils/constants/general'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

interface RequestModalItemProps {
  title: keyof typeof englishToPortugueseMapping
  description: string | number
}

export function RequestModalItem({
  title,
  description,
}: Readonly<RequestModalItemProps>) {
  const className = description.toString().length < 50 ? 'flex gap-2' : ''

  let value: JSX.Element

  if (title === 'createdAt' || title === 'updatedAt') {
    value = (
      <p className="text-muted-foreground">
        {format(description, 'dd/MM/yyyy')}
      </p>
    )
  } else if (
    title === 'youtube' ||
    title === 'platforms' ||
    title === 'productLink'
  ) {
    value = (
      <Button className="m-0 h-6 p-0" variant={'link'} asChild>
        <Link to={description as string}>{description}</Link>
      </Button>
    )
  } else {
    value = <p className="text-muted-foreground">{description}</p>
  }

  return (
    <div className={className}>
      <p>{englishToPortugueseMapping[title]}:</p>
      {value}
    </div>
  )
}
