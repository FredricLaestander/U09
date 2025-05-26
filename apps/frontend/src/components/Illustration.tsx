export const Illustration = ({
  variant,
}: {
  variant: 'fire' | 'crown' | 'cloud'
}) => {
  return (
    <img
      src={`/illustrations/${variant}.svg`}
      alt={`${variant} illustration`}
    />
  )
}
