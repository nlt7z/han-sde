import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
  },
}

/**
 * Wraps any heading/block in a Framer Motion scroll-triggered entrance.
 * delay: seconds offset for stagger
 */
export default function AnimatedTitle({ as: Tag = 'div', className, style, delay = 0, children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: { ...variants.visible.transition, delay },
        },
      }}
      style={style}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  )
}
