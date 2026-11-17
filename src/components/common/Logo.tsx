import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

export function Logo({ size = 32, showWordmark = true, className }: LogoProps) {
  const width = showWordmark ? 160 : 40
  const height = 48
  const scaledWidth = (size * width) / height

  return (
    <svg
      width={scaledWidth}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quédate"
      role="img"
      className={cn('text-foreground', className)}
    >
      {/* Techo triangular sin base (coral, encima de la Q, separado) */}
      <path
        d="M6 12 L22 2 L38 12"
        stroke="#ea580c"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Wordmark "Quédate" como texto SVG (Space Grotesk) */}
      {showWordmark && (
        <text
          x="0"
          y="44"
          fontFamily="Space Grotesk, sans-serif"
          fontSize="36"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          <tspan fill="currentColor">Qué</tspan>
          <tspan fill="#0d9488">date</tspan>
        </text>
      )}
    </svg>
  )
}