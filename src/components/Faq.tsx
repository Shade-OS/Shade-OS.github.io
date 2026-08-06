import { useId, useState } from 'react'

import { faq } from '../data/site.ts'
import { Reveal, Section } from './ui.tsx'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <Section
      id="sss"
      index={4}
      label="sss"
      title="Sık sorulanlar"
      desc="Projenin kimliği, lisans durumu ve sorumluluk sınırları hakkında bilinmesi gerekenler."
    >
      <Reveal delay={80}>
        <div className="faq">
          {faq.map((item, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`
            return (
              <div className="faq__item" key={item.q} data-open={isOpen}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="faq__sign" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className="faq__a"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>
    </Section>
  )
}
