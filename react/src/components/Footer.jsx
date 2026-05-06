export default function Footer({ left = 'Han Cao 2025', right = 'hanmail1024@gmail.com', rightHref }) {
  return (
    <footer className="site-footer">
      <span className="footer-copy">{left}</span>
      {rightHref
        ? <a href={rightHref} className="footer-copy" style={{ color: 'var(--gray-b)' }}>{right}</a>
        : <span className="footer-copy" style={{ color: 'var(--gray-b)' }}>{right}</span>
      }
    </footer>
  )
}
