import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  CakeSlice,
  Camera,
  Check,
  Gift,
  Heart,
  ImageOff,
  PartyPopper,
  Play,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'
import { habeebaData, Photo, Surprise } from './habeebaData'

const STORAGE_KEY = 'habeeba-world-progress'

type Progress = {
  entered: boolean
  cakeComplete: boolean
  surprises: string[]
}

const defaultProgress: Progress = { entered: false, cakeComplete: false, surprises: [] }

function readProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<Progress> | null
    return { ...defaultProgress, ...saved, surprises: saved?.surprises || [] }
  } catch {
    return defaultProgress
  }
}

function getBirthdayTarget() {
  return Date.parse(`${habeebaData.birthday.year}-${String(habeebaData.birthday.month).padStart(2, '0')}-${String(habeebaData.birthday.day).padStart(2, '0')}T18:30:00.000Z`)
}

function countdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export function App() {
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [now, setNow] = useState(Date.now())
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)
  const [activeSurprise, setActiveSurprise] = useState<Surprise | null>(null)
  const [cakeLit, setCakeLit] = useState(true)
  const [celebrating, setCelebrating] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)), [progress])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  const birthdayStarted = now >= getBirthdayTarget()
  const time = countdown(getBirthdayTarget() - now)
  const enter = () => setProgress((current) => ({ ...current, entered: true }))
  const completeCake = () => {
    if (progress.cakeComplete) return
    setCakeLit(false)
    setCelebrating(true)
    setProgress((current) => ({ ...current, cakeComplete: true }))
    window.setTimeout(() => setCelebrating(false), 4200)
  }
  const openSurprise = (surprise: Surprise) => {
    setActiveSurprise(surprise)
    setProgress((current) => current.surprises.includes(surprise.id) ? current : { ...current, surprises: [...current.surprises, surprise.id] })
  }

  return (
    <div className={`world ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Fireworks active reducedMotion={reducedMotion} />
      {!progress.entered ? (
        <Opening birthdayStarted={birthdayStarted} time={time} onEnter={enter} />
      ) : (
        <>
          <TopNav />
          <main>
            <Hero birthdayStarted={birthdayStarted} time={time} onCake={() => document.getElementById('surprises')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })} />
            <WorldSection />
            <Gallery onSelect={setActivePhoto} />
            <SurpriseSection cakeLit={cakeLit} cakeComplete={progress.cakeComplete} surprises={progress.surprises} onCake={completeCake} onSurprise={openSurprise} />
            <WishesSection />
            <LetterSection />
          </main>
          <Footer />
        </>
      )}
      {activePhoto && <PhotoLightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />}
      {activeSurprise && <SurpriseModal surprise={activeSurprise} onClose={() => setActiveSurprise(null)} />}
    </div>
  )
}

function Opening({ birthdayStarted, time, onEnter }: { birthdayStarted: boolean; time: ReturnType<typeof countdown>; onEnter: () => void }) {
  return (
    <section className="opening">
      <div className="opening-noise" />
      <div className="opening-orbit orbit-a" /><div className="opening-orbit orbit-b" />
      <div className="opening-content">
        <span className="eyebrow">{habeebaData.opening.kicker}</span>
        <h1>{habeebaData.opening.headline}<em>{habeebaData.opening.subheadline}</em></h1>
        <p>{habeebaData.opening.message}</p>
        <div className="opening-status">
          <Sparkles size={16} />
          <span>{birthdayStarted ? 'HER BIRTHDAY IS LIVE' : `THE CELEBRATION OPENS IN ${time.days}D ${time.hours}H ${time.minutes}M`}</span>
        </div>
        <button className="enter-button" onClick={onEnter}><span>ENTER HER WORLD</span><ArrowRight size={18} /></button>
      </div>
      <div className="opening-flowers"><span>✦</span><span>✹</span><span>♡</span><span>✦</span></div>
      <div className="opening-scroll"><ArrowDown size={16} /> a celebration made for Habeeba</div>
    </section>
  )
}

function TopNav() {
  return <header className="top-nav"><a className="brand" href="#top"><span>H</span> HABEEBA'S WORLD</a><nav><a href="#world">Her world</a><a href="#gallery">Gallery</a><a href="#surprises">Surprises</a><a href="#letter">Letter</a></nav><span className="nav-date">04 / 11</span></header>
}

function Hero({ birthdayStarted, time, onCake }: { birthdayStarted: boolean; time: ReturnType<typeof countdown>; onCake: () => void }) {
  return (
    <section className="hero section-wrap" id="top">
      <div className="hero-copy"><span className="eyebrow orange">THE STAR OF THE DAY</span><h2>Today, the<br /><em>world is hers.</em></h2><p>{birthdayStarted ? 'The candles are lit, the confetti is in the air and this entire little universe is here to celebrate Habeeba.' : 'A bright little universe is waiting for Habeeba. Come in, make a wish and celebrate every beautiful thing she is.'}</p><button className="outline-button" onClick={onCake}>Find the surprises <ArrowDown size={16} /></button></div>
      <div className="hero-portrait"><div className="portrait-halo" /><div className="portrait-placeholder"><Camera size={28} /><span>ADD HER PHOTO<br /><small>optional · habeebaData.ts</small></span></div><div className="hero-sticker sticker-star">✦</div><div className="hero-sticker sticker-heart">♡</div><div className="hero-sticker sticker-tada"><PartyPopper size={22} /></div></div>
      <div className="hero-bottom"><span>SCROLL TO CELEBRATE</span><div className="hero-line" /><span>01 — 06</span></div>
    </section>
  )
}

function WorldSection() {
  return <section className="world-section section-wrap" id="world"><div className="section-heading"><span className="eyebrow orange">02 / HER BEAUTIFUL WORLD</span><h2>{habeebaData.world.intro}</h2><div className="heading-sparkle">✹</div></div><div className="world-grid"><div className="world-story">{habeebaData.world.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="favourite-list">{habeebaData.world.favourites.map((favourite, index) => <span key={favourite}><b>0{index + 1}</b>{favourite}</span>)}</div></div><div className="compliment-stack">{habeebaData.world.compliments.map((item) => <article className="compliment" key={item.label}><span className="compliment-icon">{item.icon}</span><div><span className="eyebrow">{item.label}</span><h3>{item.text}</h3></div></article>)}</div></div></section>
}

function Gallery({ onSelect }: { onSelect: (photo: Photo) => void }) {
  return <section className="gallery-section section-wrap" id="gallery"><div className="section-heading centered"><span className="eyebrow coral">03 / A GALLERY OF HER</span><h2>Little snapshots<br /><em>of wonderful.</em></h2><p>Add the photographs that make you smile first.</p></div><div className="gallery-grid">{habeebaData.photos.map((photo, index) => <button className={`photo-frame photo-${index + 1} ${photo.tone}`} key={photo.id} onClick={() => onSelect(photo)}>{photo.src ? <img src={photo.src} alt={photo.alt} /> : <div className="photo-empty"><ImageOff size={20} /><span>ADD PHOTO {String(index + 1).padStart(2, '0')}</span></div>}<span className="photo-caption">{photo.caption}</span></button>)}</div></section>
}

function SurpriseSection({ cakeLit, cakeComplete, surprises, onCake, onSurprise }: { cakeLit: boolean; cakeComplete: boolean; surprises: string[]; onCake: () => void; onSurprise: (surprise: Surprise) => void }) {
  return <section className="surprise-section section-wrap" id="surprises"><div className="section-heading"><span className="eyebrow gold">04 / BIRTHDAY SURPRISES</span><h2>Make a wish.<br /><em>Then make another.</em></h2><p>Tap the candles, then open the little secrets waiting around the party.</p></div><div className="cake-stage"><div className="cake-sparkles">✦　✧　✦</div><div className={`cake ${cakeComplete ? 'celebrated' : ''}`} onClick={onCake}><div className="flame-row">{[0, 1, 2].map((candle) => <span className={`candle ${cakeLit ? '' : 'out'}`} key={candle}><i /></span>)}</div><div className="icing">HABEEBA</div><div className="cake-layer layer-top" /><div className="cake-layer layer-bottom" /><div className="cake-plate" /></div><button className="cake-action" onClick={onCake}>{cakeComplete ? <><Check size={17} /> WISH MADE</> : <><CakeSlice size={17} /> {cakeLit ? 'TAP TO BLOW OUT THE CANDLES' : 'MAKE A WISH'}</>}</button></div><div className="surprise-boxes">{habeebaData.surprises.map((surprise) => <button className={`surprise-box ${surprise.color}`} key={surprise.id} onClick={() => onSurprise(surprise)}><span className="box-lid"><Gift size={20} /></span><span className="eyebrow">{surprise.label}</span><strong>{surprises.includes(surprise.id) ? 'opened ✦' : 'open the box'}</strong></button>)}</div></section>
}

function WishesSection() {
  return <section className="wishes-section section-wrap"><div className="wishes-burst">✹</div><div className="section-heading centered"><span className="eyebrow pink">05 / A WORLD OF WISHES</span><h2>For her next<br /><em>beautiful chapter.</em></h2></div><div className="wish-list">{habeebaData.wishes.map((wish, index) => <div className="wish" key={wish}><span>0{index + 1}</span><p>{wish}</p><Sparkles size={18} /></div>)}</div></section>
}

function LetterSection() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const toggleAudio = async () => {
    if (!audioRef.current || !habeebaData.optionalAudio.src) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    try { await audioRef.current.play(); setPlaying(true) } catch { setPlaying(false) }
  }
  return <section className="letter-section section-wrap" id="letter"><div className="letter-intro"><span className="eyebrow orange">06 / HER BIRTHDAY LETTER</span><h2>Words for<br /><em>Habeeba.</em></h2><div className="letter-mark">♡</div></div><article className="letter-paper"><div className="paper-top"><span>04 — 11 — 2026</span><Heart size={17} /></div><h3>{habeebaData.letter.salutation}</h3>{habeebaData.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="letter-signoff">{habeebaData.letter.signoff}<br /><em>{habeebaData.letter.signature}</em></p><div className="paper-seal">H</div></article><audio ref={audioRef} src={habeebaData.optionalAudio.src || undefined} onEnded={() => setPlaying(false)} /><button className="voice-note" onClick={toggleAudio}><span className="voice-icon">{playing ? <Volume2 size={16} /> : <Play size={16} fill="currentColor" />}</span><span><strong>{playing ? 'Playing her birthday note' : 'Optional birthday voice note'}</strong><small>{habeebaData.optionalAudio.src ? 'tap to listen' : 'add audio in habeebaData.ts'}</small></span></button></section>
}

function Footer() {
  return <footer className="world-footer"><Sparkles size={18} /><p>Made with colour, confetti and a very large amount of birthday love for <strong>{habeebaData.name}</strong>.</p><Sparkles size={18} /></footer>
}

function PhotoLightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className={`photo-modal ${photo.tone}`} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button>{photo.src ? <img src={photo.src} alt={photo.alt} /> : <div className="photo-modal-empty"><ImageOff size={28} /><p>Add this photo in <code>habeebaData.ts</code>.</p></div>}<p>{photo.caption}</p></div></div>
}

function SurpriseModal({ surprise, onClose }: { surprise: Surprise; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className={`surprise-modal ${surprise.color}`} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="modal-gift"><Gift size={30} /></div><span className="eyebrow">A SECRET FOR HABEEBA</span><h2>{surprise.title}</h2><p>{surprise.message}</p><button className="modal-done" onClick={onClose}>Keep this wish close <Heart size={15} /></button></div></div>
}

function Fireworks({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reducedMotion) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let animation = 0
    let width = 0
    let height = 0
    const bursts: { x: number; y: number; age: number; color: string }[] = []
    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio
      height = canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
      width = window.innerWidth
      height = window.innerHeight
    }
    const colors = ['#ff7438', '#ffb52e', '#f78fb3', '#f15b4e', '#ffd86b']
    const draw = () => {
      frame += 1
      context.fillStyle = active ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.22)'
      context.clearRect(0, 0, width, height)
      if (frame % (active ? 42 : 75) === 0) bursts.push({ x: Math.random() * width, y: 80 + Math.random() * height * .42, age: 0, color: colors[Math.floor(Math.random() * colors.length)] })
      bursts.forEach((burst) => {
        burst.age += 1
        context.globalAlpha = Math.max(0, 1 - burst.age / 70)
        for (let i = 0; i < 22; i += 1) {
          const angle = (Math.PI * 2 * i) / 22
          const distance = burst.age * (1.2 + (i % 3) * .17)
          context.fillStyle = burst.color
          context.fillRect(burst.x + Math.cos(angle) * distance, burst.y + Math.sin(angle) * distance, 2, 2)
        }
      })
      context.globalAlpha = 1
      for (let i = 0; i < 35; i += 1) {
        const x = (i * 97 + frame * .18) % width
        const y = (i * 47 + frame * .08) % (height * .8)
        context.fillStyle = colors[i % colors.length]
        context.fillRect(x, y, 2, 2)
      }
      animation = window.requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    animation = window.requestAnimationFrame(draw)
    return () => { window.cancelAnimationFrame(animation); window.removeEventListener('resize', resize) }
  }, [active, reducedMotion])
  return <canvas className={`fireworks ${active ? 'celebration-fireworks' : ''}`} ref={canvasRef} aria-hidden="true" />
}
