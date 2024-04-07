import React from 'react'
import { Link } from 'react-router-dom'

interface CarouselItemProps {
  imageUrl?: string
  title: string
  navigateTo: string
}

const CarouselCustomItem: React.FC<CarouselItemProps> = ({
  imageUrl,
  title,
  navigateTo,
}) => {
  const isValidImageUrl = imageUrl && imageUrl.length > 0
  return (
    <Link
      to={navigateTo}
      className="m-auto block size-full h-[800px] w-[400px] text-center"
    >
      <img
        className="h-[700px] w-[400px] object-fill"
        src={isValidImageUrl ? imageUrl : 'https://via.placeholder.com/400x700'}
        alt="thumbnail"
      />
      <span className="text-lg font-bold">{title}</span>
    </Link>
  )
}

export default CarouselCustomItem
