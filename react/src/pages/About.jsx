import { motion } from 'framer-motion'
import AnimatedTitle from '../components/AnimatedTitle'
import Footer        from '../components/Footer'

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .1 },
  transition: { duration: .8, ease: 'easeOut', delay },
})

export default function About() {
  return (
    <div className="about-body">
      {/* PAGE HEADER */}
      <header className="about-page-header">
        <motion.p className="page-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
          Background
        </motion.p>
        <AnimatedTitle as="h1" className="t-title">About</AnimatedTitle>
        <div className="hr" style={{ marginTop: 40 }} />
      </header>

      {/* BIO */}
      <section className="bio-section">
        <motion.div className="bio-text" {...fadeUp(0)}>
          <p className="bio-lead">
            Software engineer who builds infrastructure and AI systems that millions of people depend on.
          </p>
          <div className="bio-body">
            <p>
              Han Cao is a software development engineer at Amazon with 3+ years building
              production systems at scale. Currently at Amazon Lex, where he shipped Bot
              Analyzer — a publicly available AI feature that went live across 11 AWS regions
              and saw 1,000+ analyses in its first four days.
            </p>
            <p>
              Previously at AWS Lambda, he led the automation of the Lambda EventBridge control
              plane region builds — replacing a fully manual process — and co-designed the
              multi-dimensional token bucket throttling system that protects the Lambda fleet
              from cross-tenant traffic spikes.
            </p>
            <p>
              He holds an M.S. in Computer Science from Northwestern University (GPA 3.86) and
              a B.S. in Computer Science with a Minor in Mathematics from Simon Fraser University.
              He holds three professional certifications from AWS and Oracle, and has published
              academic research and holds a granted patent.
            </p>
          </div>
        </motion.div>

        <motion.div className="bio-aside" {...fadeUp(.24)}>
          {[
            { label: 'Location',   value: 'Seattle, Washington' },
            { label: 'Currently',  value: <><strong>Amazon Web Services</strong><br />SDE, Generative AI</> },
            { label: 'Languages',  value: 'English, Mandarin' },
            { label: 'LinkedIn',   value: <a href="https://linkedin.com/in/han-ca0">han-ca0</a> },
          ].map(({ label, value }) => (
            <div className="fact-block" key={label}>
              <div className="fact-label">{label}</div>
              <div className="fact-value">{value}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* EDUCATION */}
      <section className="edu-section">
        <p className="section-head">Education</p>
        <motion.div className="edu-row" {...fadeUp(0)}>
          <div>
            <AnimatedTitle as="div" className="edu-school">Northwestern University</AnimatedTitle>
            <div className="edu-degree">M.S. Computer Science</div>
            <div className="edu-gpa">GPA 3.86 / 4.0</div>
          </div>
          <span className="edu-year">2020 – 2022</span>
        </motion.div>
        <motion.div className="edu-row" {...fadeUp(.12)}>
          <div>
            <AnimatedTitle as="div" className="edu-school">Simon Fraser University</AnimatedTitle>
            <div className="edu-degree">B.S. Computer Science &nbsp;·&nbsp; Minor in Mathematics</div>
          </div>
          <span className="edu-year">2017 – 2020</span>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section className="stack-section">
        <p className="section-head">Technical Stack</p>
        <div className="stack-groups">
          {[
            { label: 'Languages', items: [
              { text: 'Java (Spring Boot)', primary: true }, { text: 'Python', primary: true },
              { text: 'JavaScript (React)' }, { text: 'C++' }, { text: 'Ruby' }, { text: 'Haskell' },
            ], delay: 0 },
            { label: 'AWS Services', items: [
              { text: 'Lambda', primary: true }, { text: 'Lex', primary: true },
              { text: 'Bedrock', primary: true }, { text: 'Step Functions', primary: true },
              { text: 'DynamoDB', primary: true }, { text: 'S3, CloudFormation, CloudWatch, IAM' },
            ], delay: .12 },
            { label: 'Expertise', items: [
              { text: 'Distributed Systems', primary: true }, { text: 'LLM Integration', primary: true },
              { text: 'Infrastructure Automation', primary: true }, { text: 'Multi-Region Deployment' },
              { text: 'CI/CD Pipelines' }, { text: 'MapReduce' },
            ], delay: .24 },
          ].map(({ label, items, delay }) => (
            <motion.div key={label} className="stack-group" {...fadeUp(delay)}>
              <div className="stack-group-label">{label}</div>
              <div className="stack-items">
                {items.map(({ text, primary }) => (
                  <span key={text} className={`stack-item${primary ? ' primary' : ''}`}>{text}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="cert-section">
        <p className="section-head">Certifications</p>
        {[
          { name: 'AWS Certified Solutions Architect — Professional',  issuer: 'Amazon Web Services', delay: 0    },
          { name: 'AWS Certified Generative AI Developer — Professional', issuer: 'Amazon Web Services', delay: .12 },
          { name: 'Oracle Certified Java SE 8 Developer',              issuer: 'Oracle Corporation',   delay: .24 },
        ].map(({ name, issuer, delay }) => (
          <motion.div key={name} className="cert-row" {...fadeUp(delay)}>
            <span className="cert-name">{name}</span>
            <span className="cert-issuer">{issuer}</span>
          </motion.div>
        ))}
      </section>

      {/* CONTACT */}
      <section className="contact-section">
        <motion.div className="contact-left" {...fadeUp(0)}>
          <AnimatedTitle as="h2" className="contact-headline">
            Let's build<br />something.
          </AnimatedTitle>
          <p className="contact-sub">
            Open to senior SDE roles, staff engineering,<br />
            and ambitious technical challenges.
          </p>
        </motion.div>
        <motion.div className="contact-right" {...fadeUp(.24)}>
          {[
            { type: 'Email',    val: 'hanmail1024@gmail.com', href: 'mailto:hanmail1024@gmail.com' },
            { type: 'LinkedIn', val: 'han-ca0',               href: 'https://linkedin.com/in/han-ca0' },
          ].map(({ type, val, href }) => (
            <div key={type} className="contact-row">
              <span className="contact-type">{type}</span>
              {href
                ? <a href={href} className="contact-val">{val}</a>
                : <span className="contact-val">{val}</span>
              }
            </div>
          ))}
        </motion.div>
      </section>

      <Footer left="Han Cao · Software Development Engineer · AWS" right="Seattle, WA · 2025" />
    </div>
  )
}
