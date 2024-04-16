import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PropsWithChildren, useState } from 'react'

interface ISideMenuCollapsibleProps extends PropsWithChildren {
  title: string
  icon: JSX.Element
}

export function SideMenuCollapsible({
  children,
  icon,
  title,
}: Readonly<ISideMenuCollapsibleProps>) {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen((prev) => !prev)
  return (
    <Collapsible className="w-full" open={open} onOpenChange={toggleOpen}>
      <CollapsibleTrigger className="w-full">
        <span className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            {icon} {title}
          </span>{' '}
          {open ? <ChevronUp /> : <ChevronDown />}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
