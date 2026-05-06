import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Animates a number from 0 → target when scrolled into view.
 * For non-numeric displays (e.g. "Private Beta", "14→5"), just fades in.
 *
 * Props:
 *   value  – numeric value to count to
 *   display – raw JSX to show (overrides count if provided and isCount=false)
 *   sub    – subscript suffix text (e.g. "+", "×", "ms", "s")
 *   prefix – prefix text (e.g. "<")
 *   isCount – whether to animate counting (default true)
 *   decimals – decimal places to display (default 0)
 */
export default function CountUp({ value, sub, prefix = '', isCount = true, decimals = 0, children }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!inView || !isCount) return
    const target   = value
    const duration = 1400
    const start    = performance.now()

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = eased * target
      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, value, isCount, decimals])

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : count.toLocaleString()

  return (
    <div className="mi-num" ref={ref}>
      {isCount
        ? <>{prefix}{formatted}{sub && <sub>{sub}</sub>}</>
        : children
      }
    </div>
  )
}
