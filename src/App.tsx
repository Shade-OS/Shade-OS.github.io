import { Grain, PointerTracker, ScrollProgress } from './components/Ambient.tsx'
import { Downloads } from './components/Downloads.tsx'
import { Faq } from './components/Faq.tsx'
import { Footer } from './components/Footer.tsx'
import { Hero } from './components/Hero.tsx'
import { Install } from './components/Install.tsx'
import { Marquee } from './components/Marquee.tsx'
import { Nav } from './components/Nav.tsx'
import { Verify } from './components/Verify.tsx'

export function App() {
  return (
    <>
      <a className="skip" href="#indir">
        İçeriğe atla
      </a>

      <PointerTracker />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <Marquee />
        <Downloads />
        <Verify />
        <Install />
        <Faq />
      </main>

      <Footer />
      <Grain />
    </>
  )
}
