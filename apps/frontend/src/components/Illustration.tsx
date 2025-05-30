import type { Illustration as TIllustration } from '../types'

export const Illustration = ({ variant }: { variant: TIllustration }) => {
  return (
    <img
      src={`/illustrations/${variant}.svg`}
      alt={`${variant} illustration`}
    />
  )
}
