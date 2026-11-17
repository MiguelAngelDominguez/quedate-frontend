import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export function Sheet({ open, onClose, children, side = 'right', className }: SheetProps) {
  if (!open) return null

  const sideClasses = {
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm',
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm',
    top: 'inset-x-0 top-0 w-full',
    bottom: 'inset-x-0 bottom-0 w-full',
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed bg-background shadow-lg transition-transform duration-300',
          sideClasses[side],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>
        {children}
      </div>
    </div>
  )
}