import { motion } from 'framer-motion'
import AnimatedTitle from '../components/AnimatedTitle'
import Footer        from '../components/Footer'

export default function Gallery() {
  return (
    <div style={{ paddingTop: 72 }}>
      <header className="page-header">
        <motion.p className="page-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
          Photography
        </motion.p>
        <div className="page-header-row">
          <AnimatedTitle as="h1" className="t-title">Gallery</AnimatedTitle>
          <motion.span className="t-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: .3 }}>
            Personal work
          </motion.span>
        </div>
        <div className="hr" style={{ marginTop: 32 }} />
      </header>

      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 56px',
          gap: 20,
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .8, delay: .3 }}
      >
        <p style={{
          fontFamily: 'var(--serif)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(36px, 5vw, 72px)',
          letterSpacing: '-.02em',
          lineHeight: 1,
          color: 'var(--fg)',
        }}>
          Coming Soon
        </p>
        <p style={{
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'var(--gray-b)',
          marginTop: 12,
        }}>
          Photos on the way
        </p>
      </motion.div>

      <Footer left="Han Cao — Gallery" right="About →" rightHref="/about" />
    </div>
  )
}
