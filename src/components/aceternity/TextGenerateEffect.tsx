import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= words.length) {
        setDisplayed(words.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [words])

  const wordsArray = displayed.split(' ')

  return (
    <motion.div className={cn('font-bold', className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          initial={{ opacity: 0, filter: filter ? 'blur(10px)' : 'none' }}
          animate={{ opacity: 1, filter: filter ? 'blur(0px)' : 'none' }}
          transition={{ duration: duration, delay: idx * 0.08 }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.div>
  )
}