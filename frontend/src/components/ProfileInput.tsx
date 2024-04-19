import { ForwardedRef, forwardRef } from 'react'
import { ChangeHandler } from 'react-hook-form'
import avatar from '../assets/avatar.png'

interface ProfileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeHandler
  placeholder?: string
}

export const ProfileInput = forwardRef(
  (props: ProfileInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div>
        <div className="flex w-full justify-center">
          <label className="hover:cursor-pointer" htmlFor="imageUpload">
            <img
              src={props.placeholder ?? avatar}
              alt="Imagem"
              className="size-[300px] rounded-full object-fill"
            />
          </label>
        </div>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: 'none' }}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

ProfileInput.displayName = 'ProfileInput'
