import { cn } from '@/lib/utils'

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className, fill = '#0d9488' }: SpotlightProps) {
  return (
    <svg
      className={cn('pointer-events-none absolute z-[1] h-full w-full animate-spotlight', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.902"
          rx="1924.71"
          ry="273.902"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.22"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838867"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  )
}