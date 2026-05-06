import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Nav  from './components/Nav'
import Home     from './pages/Home'
import Work     from './pages/Work'
import Projects from './pages/Projects'
import Gallery  from './pages/Gallery'
import About    from './pages/About'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.35, ease: 'easeIn'  } },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/"        element={<Home />}     />
          <Route path="/work"    element={<Work />}     />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />}  />
          <Route path="/about"   element={<About />}    />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
