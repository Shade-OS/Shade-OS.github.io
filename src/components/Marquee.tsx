import { marquee } from '../data/site.ts'

/** Sonsuz kayan bant — iki kopya ile dikişsiz döngü. */
export function Marquee() {
  return (
    <div className="marquee" role="note" aria-label="Yasal uyarı">
      {[0, 1].map((copy) => (
        <div className="marquee__track" key={copy} aria-hidden={copy === 1}>
          {marquee.map((text) => (
            <span key={text}>{text}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
