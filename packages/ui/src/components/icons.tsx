type IconProps = React.HTMLAttributes<SVGElement>

export const ExampleIcon = (props: IconProps) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 0H100V100H0V0Z" fill="currentColor" />
  </svg>
)
