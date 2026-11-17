import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface MovingBorderProps {
  children: React.ReactNode
  className?: string
  duration?: number
  as?: React.ElementType
}

export function MovingBorder({ children, className, duration = 2000, as: Component = 'div' }: MovingBorderProps) {
  return (
    <Component className={cn('relative overflow-hidden rounded-lg', className)}>
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative z-10">{children}</div>
    </Component>
  )
}