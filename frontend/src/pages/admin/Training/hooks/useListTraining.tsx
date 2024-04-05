import { useState } from 'react'

export function useListTraining() {
  const [training] = useState()
  return { training }
}
