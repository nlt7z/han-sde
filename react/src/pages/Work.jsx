import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CountUp       from '../components/CountUp'
import AnimatedTitle from '../components/AnimatedTitle'
import Footer        from '../components/Footer'

/* Job header choreography: idx → company → title → date */
function JobHeader({ idx, company, title, date }) {
  return (
    <motion.div
      className="job-header"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: .25 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: .12 } } }}
    >
      <motion.span className="job-idx" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .4 } } }}>
        {idx}
      </motion.span>
      <div>
        <motion.p className="job-company" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: .55, ease: 'easeOut' } } }}>
          {company}
        </motion.p>
        <AnimatedTitle as="h2" className="job-title">{title}</AnimatedTitle>
      </div>
      <motion.div className="job-date" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .5 } } }}>
        {date}
      </motion.div>
    </motion.div>
  )
}

/* Panel: type → name → descs → metrics */
function ProjPanel({ type, name, descs, metrics }) {
  return (
    <motion.div
      className="proj-panel"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: .15 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: .1 } } }}
    >
      <div className="proj-left">
        <motion.p className="proj-type" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .45 } } }}>
          {type}
        </motion.p>
        <AnimatedTitle as="h3" className="proj-name">{name}</AnimatedTitle>
        {descs.map((d, i) => (
          <motion.p key={i} className="proj-desc"
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .6, delay: i * .12 } } }}
          >
            {d}
          </motion.p>
        ))}
      </div>
      <div className="proj-right">
        <motion.div className="metrics-list"
          variants={{ hidden: { opacity: 0, x: 16 }, visible: { opacity: 1, x: 0, transition: { duration: .7, ease: 'easeOut' } } }}
        >
          {metrics.map((m, i) => (
            <div className="mi" key={i}>
              {m.isCount
                ? <CountUp value={m.value} sub={m.sub} prefix={m.prefix} decimals={m.decimals || 0} isCount />
                : <div className="mi-num" style={m.style}>{m.content}</div>
              }
              <div className="mi-lbl">{m.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Work() {
  const navigate = useNavigate()
  return (
    <div style={{ paddingTop: 72 }}>
      {/* PAGE HEADER */}
      <header className="page-header">
        <motion.p className="page-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
          Experience
        </motion.p>
        <div className="page-header-row">
          <AnimatedTitle as="h1" className="t-title">Work</AnimatedTitle>
          <motion.span className="t-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .3 }}>
            2 positions &nbsp;·&nbsp; 3+ years
          </motion.span>
        </div>
        <div className="hr" style={{ marginTop: 32 }} />
      </header>

      {/* JOB 01 */}
      <article>
        <JobHeader idx="01" company="Amazon Web Services" title="Amazon Lex" date={<>Jun 2024<br />Present</>} />
        <div className="proj-panels">
          <ProjPanel
            type="Public AWS Feature"
            name="Bot Analyzer"
            descs={[
              'LLM-driven configuration analysis for Amazon Lex chatbots, surfacing alignment with AWS best practices through public API and the Lex console. Designed and shipped across 11 AWS regions — end to end.',
              'Benchmarked 12 LLMs on accuracy, latency, and cost. Built async pipeline with Step Functions, Bedrock, and DynamoDB. MapReduce architecture for parallel intent processing.',
            ]}
            metrics={[
              { isCount: true,  value: 1000, sub: '+',  label: 'Analyses in 4 days' },
              { isCount: true,  value: 11,              label: 'AWS Regions' },
              { isCount: false, content: <>&lt;60<sub>s</sub></>, label: 'For 1,000+ intent bots' },
              { isCount: true,  value: 12,              label: 'LLMs benchmarked' },
            ]}
          />
          <ProjPanel
            type="Cross-Service Feature"
            name="Multi-modal Conversation"
            descs={[
              'SMS input capture during live voice (IVR) calls without interrupting the session. Extended bot channel APIs to integrate AWS End User Messaging with Amazon Connect.',
              'Evaluated native channel vs. Lambda-based extensibility. Chose control-plane-driven design for backward-compatible multi-channel growth. Delivered Private Beta across 4 teams.',
            ]}
            metrics={[
              { isCount: true,  value: 4, label: 'Teams coordinated' },
              { isCount: true,  value: 0, label: 'Call interruptions' },
              { isCount: false, content: <span style={{ fontSize: 'clamp(15px,1.6vw,20px)', letterSpacing: 0, lineHeight: 1.3 }}>Private<br />Beta</span>, label: 'Enterprise shipped' },
            ]}
          />
        </div>
      </article>

      <div className="hr" style={{ margin: '0 56px' }} />

      {/* JOB 02 */}
      <article>
        <JobHeader idx="02" company="Amazon Web Services" title="AWS Lambda" date={<>Aug 2022<br />Jun 2024</>} />
        <div className="proj-panels">
          <ProjPanel
            type="Infrastructure"
            name="Region Build Automation"
            descs={[
              'Led automation of Lambda EventBridge control plane region builds — on the critical path for every new Lambda region launch. Replaced a fully manual expansion process, eliminating human error from the build sequence entirely.',
              'Redesigned orchestration model and CI/CD pipeline. Parallelized serial IA-gating tasks. Onboarded to automated region config and resource provisioning systems.',
            ]}
            metrics={[
              { isCount: true,  value: 2.8, sub: '×', decimals: 1, label: 'Build speed improvement' },
              { isCount: false, content: <>14→5</>,              label: 'Days per build' },
              { isCount: true,  value: 0,                        label: 'Errors & manual steps' },
            ]}
          />
          <ProjPanel
            type="Reliability"
            name="Control Plane Throttling"
            descs={[
              'Co-designed a multi-dimensional token bucket throttling system extending from account-level to Org ID and caller principal. Prevents cross-tenant traffic spikes from triggering availability incidents across the Lambda fleet.',
              'Per-host local token cache with async background sync to central data plane. Throttle decisions removed from the request hot path. Load tested at ~7× normal traffic.',
            ]}
            metrics={[
              { isCount: false, content: <>&lt;25<sub>ms</sub></>, label: 'p99 latency overhead' },
              { isCount: true,  value: 7, sub: '×',               label: 'Traffic load tested' },
              { isCount: false, content: <>50K<sub>+</sub></>,     label: 'Throttle cache keys' },
            ]}
          />
        </div>
      </article>

      {/* TECH FOOTER */}
      <motion.div
        className="tech-footer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .3 }}
        transition={{ duration: .7 }}
      >
        <p className="tech-label">Technologies</p>
        <p className="tech-text">
          <em>Java</em> (Spring Boot) · <em>Python</em> · <em>AWS Step Functions</em> ·{' '}
          <em>Amazon Bedrock</em> · <em>DynamoDB</em> · <em>S3</em> ·{' '}
          <em>CloudFormation</em> · <em>CloudWatch</em> · <em>IAM</em>
        </p>
      </motion.div>

      <Footer
        left="Han Cao — Work"
        right="Projects →"
        rightHref="/projects"
      />
    </div>
  )
}
