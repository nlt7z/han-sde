const row1Items = [
  { type: 'accent', text: '1,000+' }, { type: 'text', text: 'Analyses in 4 days' },
  { type: 'accent', text: '11' },     { type: 'text', text: 'AWS Regions' },
  { type: 'accent', text: '2.8×' },   { type: 'text', text: 'Build speed up' },
  { type: 'text',   text: 'p99' },    { type: 'accent', text: '<25ms' }, { type: 'text', text: 'overhead' },
  { type: 'accent', text: '50K+' },   { type: 'text', text: 'Throttle keys' },
  { type: 'text',   text: 'Northwestern GPA' }, { type: 'accent', text: '3.86' },
  { type: 'accent', text: '3+' },     { type: 'text', text: 'Years at AWS' },
]

const row2Items = [
  'Java', 'Python', 'AWS Lambda', 'Amazon Bedrock',
  'Step Functions', 'DynamoDB', 'CloudFormation', 'React', 'C++', 'Ruby', 'Haskell',
]

function Row1Content() {
  return (
    <span className="mq-item">
      {row1Items.map((item, i) => (
        <span key={i}>
          {i > 0 && i % 2 === 0 && <span className="mq-dot" />}
          {item.type === 'accent'
            ? <span className="mq-accent">{item.text}</span>
            : item.text}
          {' '}
        </span>
      ))}
    </span>
  )
}

function Row2Content() {
  return (
    <span className="mq-item">
      {row2Items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mq-dot" />}
          {item}{' '}
        </span>
      ))}
    </span>
  )
}

export default function Marquee() {
  return (
    <div className="mq-section">
      <div className="mq-row">
        <div className="mq-track left">
          <Row1Content /><Row1Content />
        </div>
      </div>
      <div className="mq-row">
        <div className="mq-track right">
          <Row2Content /><Row2Content />
        </div>
      </div>
    </div>
  )
}
