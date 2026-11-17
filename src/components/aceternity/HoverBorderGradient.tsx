import { cn } from '@/lib/utils'

interface HoverBorderGradientProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  as?: React.ElementType
}

export function HoverBorderGradient({ children, className, containerClassName, as: Component = 'div' }: HoverBorderGradientProps) {
  return (
    <Component className={cn('relative group', containerClassName)}>
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-accent opacity-0 blur transition duration-500 group-hover:opacity-75" />
      <div className={cn('relative rounded-lg bg-background', className)}>
        {children}
      </div>
    </Component>
  )
}