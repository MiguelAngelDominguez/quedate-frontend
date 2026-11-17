import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BentoGridProps {
  className?: string
  children: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
      {children}
    </div>
  )
}

interface BentoGridItemProps {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  header?: ReactNode
  icon?: ReactNode
}

export function BentoGridItem({ className, title, description, header, icon }: BentoGridItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30',
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mb-2 mt-2 font-sans font-bold text-foreground">{title}</div>
        <div className="font-sans text-xs font-normal text-muted-foreground">{description}</div>
      </div>
    </motion.div>
  )
}