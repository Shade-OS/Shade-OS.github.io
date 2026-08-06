import { installSteps } from '../data/site.ts'
import { useSpotlight } from '../hooks.ts'
import { Reveal, Section } from './ui.tsx'

function Step({
  n,
  title,
  body,
}: {
  n: number
  title: string
  body: string
}) {
  const spot = useSpotlight<HTMLLIElement>()

  return (
    <li
      className="step spot-card"
      ref={spot.ref}
      onPointerMove={spot.onPointerMove}
    >
      <span className="step__n">{String(n).padStart(2, '0')}</span>
      <h3 className="step__title">{title}</h3>
      <p className="step__body">{body}</p>
    </li>
  )
}

export function Install() {
  return (
    <Section
      id="kurulum"
      index={3}
      label="kurulum"
      title="Dört adım"
      desc="Kuruluma başlamadan önce diskindeki verileri yedekle. Bu işlem hedef sürücüyü tamamen siler."
    >
      <Reveal delay={80}>
        <ol className="steps">
          {installSteps.map((step, i) => (
            <Step key={step.title} n={i + 1} title={step.title} body={step.body} />
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}
