import { motion } from 'framer-motion'
import AnimatedTitle from '../components/AnimatedTitle'
import Footer        from '../components/Footer'

const slideUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .1 },
  transition: { duration: .9, ease: [.4, 0, .2, 1], delay },
})

export default function Projects() {
  return (
    <div style={{ paddingTop: 72 }}>
      {/* PAGE HEADER */}
      <header className="page-header" id="page-header">
        <motion.p className="page-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
          Research &amp; Patents
        </motion.p>
        <div className="page-header-row">
          <AnimatedTitle as="h1" className="t-title">Projects</AnimatedTitle>
          <motion.span className="t-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: .3 }}>
            Independent work
          </motion.span>
        </div>
        <div className="hr" style={{ marginTop: 36 }} />
      </header>

      {/* ENTRIES */}
      <section className="entries">
        <div className="entry-group">
          <div className="group-label">
            <span className="group-label-text">Publications &amp; Patents</span>
          </div>

          {/* Entry 01 */}
          <motion.div className="entry" {...slideUp(0)}>
            <span className="entry-idx">01</span>
            <div className="entry-body">
              <p className="entry-type">Academic Publication</p>
              <AnimatedTitle as="h2" className="entry-title">
                Learning-based Software<br />Defect Prediction
              </AnimatedTitle>
              <p className="entry-desc">
                A systematic study evaluating machine learning approaches for predicting
                software defects in production codebases. Explored feature extraction from
                abstract syntax trees, code metrics, and change history. Evaluated
                classification models across multiple open-source Java projects.
              </p>
              <p className="entry-ref">Han Cao — Journal of Physics, Conference Series · CCEAI 2020</p>
            </div>
            <div className="entry-aside">
              <div className="aside-block"><div className="aside-label">Venue</div><div className="aside-value">CCEAI 2020</div></div>
              <div className="aside-block"><div className="aside-label">Published in</div><div className="aside-value">Journal of Physics</div></div>
              <div className="aside-block"><div className="aside-label">Year</div><div className="aside-value hi">2020</div></div>
            </div>
          </motion.div>

          {/* Entry 02 */}
          <motion.div className="entry" {...slideUp(.18)}>
            <span className="entry-idx">02</span>
            <div className="entry-body">
              <p className="entry-type">Utility Patent — Granted</p>
              <AnimatedTitle as="h2" className="entry-title">
                TCM Self-Service Clinic<br />Management System
              </AnimatedTitle>
              <p className="entry-desc">
                Invented a self-service inquiry management system for Traditional Chinese Medicine
                outpatient clinics, streamlining patient intake and pre-consultation workflows.
                Enables patients to complete structured symptom entry and consultation routing
                without front-desk intervention.
              </p>
              <p className="entry-ref">Grant No. ZL 2017 2 1856637.6 — Patent Authority of China</p>
            </div>
            <div className="entry-aside">
              <div className="aside-block"><div className="aside-label">Status</div><div className="aside-value hi">Granted</div></div>
              <div className="aside-block"><div className="aside-label">Patent No.</div><div className="aside-value">ZL 2017 2 1856637.6</div></div>
              <div className="aside-block"><div className="aside-label">Year</div><div className="aside-value">2017</div></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERNAL TOOLING */}
      <section className="tools-section">
        <div className="tools-section-label">Internal Tooling</div>
        <div className="tools-grid">
          {[
            { id: 't1', num: '03', name: 'LLM Evaluation Framework',    desc: 'Internal benchmark suite for evaluating 12 large language models across accuracy, latency, and cost for production model selection at Amazon Lex.',              meta: 'Amazon Lex · 2024', delay: 0    },
            { id: 't2', num: '04', name: 'Region Build Orchestration',  desc: 'New orchestration model replacing the manual Lambda region expansion process. Parallelised IA-gating tasks and integrated with automated region config systems.',  meta: 'AWS Lambda · 2023', delay: .15  },
            { id: 't3', num: '05', name: 'Load Testing Suite',          desc: 'Designed and executed load testing simulating ~7× normal production traffic across 50,000 throttle cache keys to validate Lambda control plane latency impact.',    meta: 'AWS Lambda · 2023', delay: 0    },
            { id: 't4', num: '06', name: 'MapReduce Analysis Pipeline', desc: 'Custom MapReduce pipeline that shards Amazon Lex bots by intent for parallel processing and result aggregation, achieving sub-60-second analysis for 1,000+ intents.', meta: 'Amazon Lex · 2024', delay: .15  },
          ].map(({ id, num, name, desc, meta, delay }) => (
            <motion.div key={id} className="tool-cell"
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .1 }}
              transition={{ duration: .8, ease: 'easeOut', delay }}
            >
              <div className="tool-num">{num}</div>
              <AnimatedTitle as="div" className="tool-name">{name}</AnimatedTitle>
              <p className="tool-desc">{desc}</p>
              <p className="tool-meta">{meta}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer left="Han Cao — Projects" right="About →" rightHref="/about" />
    </div>
  )
}
