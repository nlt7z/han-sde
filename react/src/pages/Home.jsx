import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Marquee from '../components/Marquee'
import Footer  from '../components/Footer'
import AnimatedTitle from '../components/AnimatedTitle'

const exploreLinks = [
  { num: '01', title: 'Work',     sub: 'Amazon Lex & AWS Lambda', path: '/work'     },
  { num: '02', title: 'Projects', sub: 'Research & Patents',       path: '/projects' },
  { num: '03', title: 'Gallery',  sub: 'Photography',              path: '/gallery'  },
  { num: '04', title: 'About',    sub: 'Background & Contact',     path: '/about'    },
]

/* Framer variants */
const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 32 },
  animate:  { opacity: 1, y: 0,  transition: { duration: .9, ease: [.4,0,.2,1], delay } },
})

const scaleRule = {
  initial:  { scaleX: 0 },
  animate:  { scaleX: 1, transition: { duration: .9, ease: [.4,0,.2,1], delay: .3 } },
}

export default function Home() {
  const navigate  = useNavigate()
  const heroRef   = useRef(null)

  /* Parallax on hero name */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])

  return (
    <>
      {/* HERO */}
      <section id="hero" ref={heroRef}>
        <div className="hero-bg-year">2025</div>

        <div className="hero-name-wrap">
          <motion.div
            id="hero-name"
            style={{ y: nameY }}
            {...fadeUp(0.15)}
          >
            Han<br />Cao
          </motion.div>

          <motion.div className="hero-meta" {...fadeUp(0.6)}>
            <span className="hi">Software Development Engineer</span>
            <span>Amazon Web Services &nbsp;·&nbsp; Seattle</span>
            <span>2022 — Present</span>
          </motion.div>
        </div>

      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* TAGLINE */}
      <motion.div
        className="tagline"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: .2 }}
        transition={{ duration: .8 }}
      >
        <p>3+ years at Amazon building systems that scale<br />for millions — from whiteboard to 11-region production.</p>
      </motion.div>

      {/* EXPLORE */}
      <section id="explore">
        <motion.div
          className="explore-head"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: .3 }}
          transition={{ duration: .6 }}
        >
          <span className="explore-head-label">Explore</span>
        </motion.div>

        <div className="explore-links">
          {exploreLinks.map(({ num, title, sub, path }, i) => (
            <motion.div
              key={path}
              className="explore-link"
              onClick={() => navigate(path)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .1 }}
              transition={{ duration: .65, ease: 'easeOut', delay: i * .12 }}
            >
              <span className="el-num">{num}</span>
              <AnimatedTitle as="span" className="el-title" delay={i * .06}>{title}</AnimatedTitle>
              <span className="el-sub">{sub}</span>
              <span className="el-arrow">↗</span>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer left="© Han Cao 2025" right="hanmail1024@gmail.com" />
    </>
  )
}
