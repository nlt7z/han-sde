import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { label: 'Work',     path: '/work'     },
  { label: 'Projects', path: '/projects' },
  { label: 'Gallery',  path: '/gallery'  },
  { label: 'About',    path: '/about'    },
]

export default function Nav() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="site-nav">
      <motion.span
        className="nav-logo"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .5 }}
      >
        Han Cao
      </motion.span>
      <ul className="nav-list">
        {links.map(({ label, path }) => (
          <li key={path}>
            <span
              className={pathname === path ? 'active' : ''}
              onClick={() => navigate(path)}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}
