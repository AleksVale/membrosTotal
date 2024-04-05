import { ChangeEvent, useState } from 'react'
import { ChangeHandler } from 'react-hook-form'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'

interface ThumbnailInputProps {
  onChange: ChangeHandler
}

export function ThumbnailInput({ onChange }: Readonly<ThumbnailInputProps>) {
  const [image, setImage] = useState<string | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const selectedImage = URL.createObjectURL(files[0])
      setImage(selectedImage)
      onChange(e)
    }
  }

  const handleDeleteImage = () => {
    setImage(null)
  }

  return (
    <div>
      <label className="hover:cursor-pointer" htmlFor="imageUpload">
        <img
          src={image ?? 'https://via.placeholder.com/400x700'}
          alt="Imagem"
          className="h-[700px] w-[400px] object-fill"
        />
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      {image && (
        <div className="flex w-full items-center justify-center p-1">
          <Button
            variant="destructive"
            onClick={handleDeleteImage}
            aria-label="Excluir foto"
          >
            <Trash className="size-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}
