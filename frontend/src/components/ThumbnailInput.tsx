import { ForwardedRef, forwardRef } from 'react'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import { ChangeHandler } from 'react-hook-form'

interface ThumbnailInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeHandler
  placeholder?: string
}

export const ThumbnailInput = forwardRef(
  (props: ThumbnailInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    console.log(props.placeholder)
    return (
      <div>
        <label className="hover:cursor-pointer" htmlFor="imageUpload">
          <img
            src={props.placeholder ?? 'https://via.placeholder.com/400x700'}
            alt="Imagem"
            className="h-[700px] w-[400px] object-fill"
          />
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: 'none' }}
          ref={ref}
          {...props}
        />
        {props.placeholder && (
          <div className="flex w-full items-center justify-center p-1">
            <Button
              variant="destructive"
              onClick={() => 'deletar foto'}
              aria-label="Excluir foto"
              type="button"
            >
              <Trash className="size-6 text-white" />
            </Button>
          </div>
        )}
      </div>
    )
  },
)

ThumbnailInput.displayName = 'ThumbnailInput'
