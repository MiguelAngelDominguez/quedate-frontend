import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export function BackgroundBeams() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 top-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  )
}