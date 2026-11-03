import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
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
import { habeebaData, DialogueLine, Photo, Surprise } from './habeebaData'

const STORAGE_KEY = 'habeeba-world-progress'

type Progress = {
  entered: boolean
  cakeComplete: boolean
  surprises: string[]
}

type CompanionEvent = {
  id: number
  kind: 'gallery' | 'photo' | 'celebrate'
  text?: string
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
  const [heartBurst, setHeartBurst] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [companionVisible, setCompanionVisible] = useState(true)
  const [companionEvent, setCompanionEvent] = useState<CompanionEvent>({ id: 0, kind: 'celebrate' })

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
    setHeartBurst((count) => count + 1)
    setProgress((current) => ({ ...current, cakeComplete: true }))
  }
  const openSurprise = (surprise: Surprise) => {
    setActiveSurprise(surprise)
    setHeartBurst((count) => count + 1)
    setProgress((current) => current.surprises.includes(surprise.id) ? current : { ...current, surprises: [...current.surprises, surprise.id] })
  }
  const triggerCelebration = () => setHeartBurst((count) => count + 1)
  const triggerCompanionEvent = (event: Omit<CompanionEvent, 'id'>) => {
    setCompanionEvent((current) => ({ ...event, id: current.id + 1 }))
    setHeartBurst((count) => count + 1)
  }

  return (
    <div className={`world ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Fireworks active reducedMotion={reducedMotion} burstKey={heartBurst} />
      {!progress.entered ? (
        <>
          <Opening birthdayStarted={birthdayStarted} time={time} onEnter={enter} />
          <CompanionSystem reducedMotion={reducedMotion} visible={companionVisible} event={companionEvent} onToggle={() => setCompanionVisible((current) => !current)} onBurst={triggerCelebration} />
        </>
      ) : (
        <>
          <TopNav />
          <main>
            <Hero birthdayStarted={birthdayStarted} time={time} onCake={() => document.getElementById('surprises')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })} onHeart={() => setHeartBurst((count) => count + 1)} />
            <WorldSection />
            <Gallery onSelect={(photo) => { setActivePhoto(photo); triggerCompanionEvent({ kind: 'photo', text: photo.caption }) }} />
            <SurpriseSection cakeLit={cakeLit} cakeComplete={progress.cakeComplete} surprises={progress.surprises} onCake={completeCake} onSurprise={openSurprise} />
            <WishesSection />
            <LetterSection />
            <FinaleSection reducedMotion={reducedMotion} onHeart={triggerCelebration} />
          </main>
          <Footer />
          <CompanionSystem reducedMotion={reducedMotion} visible={companionVisible} event={companionEvent} onToggle={() => setCompanionVisible((current) => !current)} onBurst={triggerCelebration} />
        </>
      )}
      {activePhoto && <PhotoLightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />}
      {activeSurprise && <SurpriseModal surprise={activeSurprise} onClose={() => setActiveSurprise(null)} />}
      <CelebrationDetails reducedMotion={reducedMotion} burstKey={heartBurst} />
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

function Hero({ birthdayStarted, time, onCake, onHeart }: { birthdayStarted: boolean; time: ReturnType<typeof countdown>; onCake: () => void; onHeart: () => void }) {
  return (
    <section className="hero section-wrap" id="top">
      <div className="hero-copy"><span className="eyebrow orange">THE STAR OF THE DAY</span><h2>Today, the<br /><em>world is hers.</em></h2><p>{birthdayStarted ? 'The candles are lit, the confetti is in the air and this entire little universe is here to celebrate Habeeba.' : 'A bright little universe is waiting for Habeeba. Come in, make a wish and celebrate every beautiful thing she is.'}</p><button className="outline-button" onClick={onCake}>Find the surprises <ArrowDown size={16} /></button></div>
      <div className="hero-portrait"><div className="portrait-halo" /><div className="portrait-placeholder"><Camera size={28} /><span>ADD HER PHOTO<br /><small>optional · habeebaData.ts</small></span></div><div className="hero-sticker sticker-star">✦</div><button className="hero-sticker sticker-heart heart-trigger" onClick={() => { onHeart(); onCake() }} aria-label="Send a heart">♡</button><div className="hero-sticker sticker-tada"><PartyPopper size={22} /></div></div>
      <div className="hero-bottom"><span>SCROLL TO CELEBRATE</span><div className="hero-line" /><span>01 — 06</span></div>
    </section>
  )
}

function WorldSection() {
  return <section className="world-section section-wrap" id="world"><div className="section-heading"><span className="eyebrow orange">02 / HER BEAUTIFUL WORLD</span><h2>{habeebaData.world.intro}<span className="heading-heart">♡</span></h2><div className="heading-sparkle">✹</div></div><div className="world-grid"><div className="world-story">{habeebaData.world.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="favourite-list">{habeebaData.world.favourites.map((favourite, index) => <span key={favourite}><b>0{index + 1}</b>{favourite}<Heart size={13} /></span>)}</div></div><div className="compliment-stack">{habeebaData.world.compliments.map((item) => <article className="compliment heart-trigger" key={item.label}><span className="compliment-icon">{item.icon}</span><div><span className="eyebrow">{item.label}</span><h3>{item.text}</h3></div></article>)}</div></div></section>
}

function Gallery({ onSelect }: { onSelect: (photo: Photo) => void }) {
  return <section className="gallery-section section-wrap" id="gallery"><div className="section-heading centered"><span className="eyebrow coral">03 / A GALLERY OF HER</span><h2>Little snapshots<br /><em>of wonderful.</em></h2><p>Add the photographs that make you smile first.</p></div><div className="gallery-grid">{habeebaData.photos.map((photo, index) => <button className={`photo-frame photo-${index + 1} ${photo.tone}`} key={photo.id} onClick={() => onSelect(photo)}>{photo.src ? <img src={photo.src} alt={photo.alt} /> : <div className="photo-empty"><ImageOff size={20} /><span>ADD PHOTO {String(index + 1).padStart(2, '0')}</span></div>}<span className="photo-caption">{photo.caption}</span></button>)}</div></section>
}

function SurpriseSection({ cakeLit, cakeComplete, surprises, onCake, onSurprise }: { cakeLit: boolean; cakeComplete: boolean; surprises: string[]; onCake: () => void; onSurprise: (surprise: Surprise) => void }) {
  return <section className="surprise-section section-wrap" id="surprises"><div className="section-heading"><span className="eyebrow gold">04 / BIRTHDAY SURPRISES</span><h2>Make a wish.<br /><em>Then make another.</em></h2><p>Tap the candles, then open the little secrets waiting around the party.</p></div><div className="cake-stage"><div className="cake-sparkles">✦　✧　✦</div><div className={`cake ${cakeComplete ? 'celebrated' : ''}`} onClick={onCake}><div className="flame-row">{[0, 1, 2].map((candle) => <span className={`candle ${cakeLit ? '' : 'out'}`} key={candle}><i /></span>)}</div><div className="icing">HABEEBA</div><div className="cake-layer layer-top" /><div className="cake-layer layer-bottom" /><div className="cake-plate" /></div><button className="cake-action" onClick={onCake}>{cakeComplete ? <><Check size={17} /> WISH MADE</> : <><CakeSlice size={17} /> {cakeLit ? 'TAP TO BLOW OUT THE CANDLES' : 'MAKE A WISH'}</>}</button></div><div className="surprise-boxes">{habeebaData.surprises.map((surprise) => <button className={`surprise-box ${surprise.color}`} key={surprise.id} onClick={() => onSurprise(surprise)}><span className="box-lid"><Gift size={20} /></span><span className="eyebrow">{surprise.label}</span><strong>{surprises.includes(surprise.id) ? 'opened ✦' : 'open the box'}</strong></button>)}</div></section>
}

function WishesSection() {
  return <section className="wishes-section section-wrap" id="wishes"><div className="wishes-burst">✹</div><div className="section-heading centered"><span className="eyebrow pink">05 / A WORLD OF WISHES</span><h2>For her next<br /><em>beautiful chapter.</em></h2></div><div className="wish-list">{habeebaData.wishes.map((wish, index) => <div className="wish" key={wish}><span>0{index + 1}</span><p>{wish}</p><Sparkles size={18} /></div>)}</div></section>
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

function CelebrationDetails({ reducedMotion, burstKey }: { reducedMotion: boolean; burstKey: number }) {
  const petals = Array.from({ length: 34 }, (_, index) => index)
  return <><div className="petal-layer" aria-hidden="true">{!reducedMotion && petals.map((petal) => <span key={petal} className={`petal petal-${petal % 6}`} style={{ '--petal-left': `${(petal * 43) % 103}%`, '--petal-delay': `${(petal % 9) * -1.7}s`, '--petal-duration': `${8 + (petal % 6)}s` } as CSSProperties}>{petal % 4 === 0 ? '✿' : petal % 3 === 0 ? '❀' : '♡'}</span>)}</div><div className={`heart-burst-layer ${burstKey ? 'burst-active' : ''}`} key={burstKey} aria-hidden="true">{burstKey > 0 && Array.from({ length: 16 }, (_, index) => <span key={index} style={{ '--burst-angle': `${index * 22.5}deg`, '--burst-distance': `${55 + (index % 4) * 18}px` } as CSSProperties}>♥</span>)}</div></>
}

type PetName = 'mimi' | 'puppy'
type PetState = 'idle' | 'walking' | 'running' | 'sitting' | 'sleeping' | 'waking' | 'jumping' | 'playing' | 'talking' | 'celebrating' | 'reacting'

function CompanionSystem({ reducedMotion, visible, event, onToggle, onBurst }: { reducedMotion: boolean; visible: boolean; event: CompanionEvent; onToggle: () => void; onBurst: () => void }) {
  const [section, setSection] = useState('hero')
  const [lineIndex, setLineIndex] = useState(0)
  const [activeSpeaker, setActiveSpeaker] = useState<'mimi' | 'puppy' | 'together'>(habeebaData.dialogue.hero[0].speaker)
  const [bubble, setBubble] = useState(habeebaData.dialogue.hero[0].text)
  const [jumping, setJumping] = useState<'mimi' | 'puppy' | 'together' | null>(null)
  const [petStates, setPetStates] = useState<Record<PetName, PetState>>({ mimi: 'idle', puppy: 'idle' })
  const [positions, setPositions] = useState<Record<PetName, { x: number; y: number }>>(() => ({ mimi: { x: 24, y: Math.max(100, window.innerHeight - 132) }, puppy: { x: Math.max(150, window.innerWidth - 94), y: Math.max(100, window.innerHeight - 132) } }))
  const [dragging, setDragging] = useState<PetName | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const sectionIds = ['top', 'world', 'gallery', 'surprises', 'wishes', 'letter', 'finale']
  useEffect(() => {
    const updateSection = () => {
      const current = sectionIds.reduce((found, id) => {
        const node = document.getElementById(id)
        if (!node || window.scrollY + window.innerHeight * .42 < node.offsetTop) return found
        return id
      }, 'hero')
      if (current !== section) {
        setSection(current)
        setLineIndex(0)
      }
    }
    updateSection()
    window.addEventListener('scroll', updateSection, { passive: true })
    return () => window.removeEventListener('scroll', updateSection)
  }, [section])
  useEffect(() => {
    if (!visible || reducedMotion) return
    const timer = window.setInterval(() => {
      const lines = getDialogue(section)
      const next = lines[lineIndex % lines.length]
      showLine(next)
    }, 12000)
    return () => window.clearInterval(timer)
  }, [lineIndex, reducedMotion, section, visible])
  useEffect(() => {
    if (!visible || reducedMotion) return
    const timer = window.setInterval(() => {
      setPetStates((current) => ({
        mimi: current.mimi === 'sleeping' ? 'waking' : (['idle', 'walking', 'sitting', 'sleeping', 'playing'][Math.floor(Math.random() * 5)] as PetState),
        puppy: current.puppy === 'sleeping' ? 'waking' : (['idle', 'walking', 'running', 'jumping', 'playing'][Math.floor(Math.random() * 5)] as PetState),
      }))
    }, 6500)
    return () => window.clearInterval(timer)
  }, [reducedMotion, visible])
  useEffect(() => {
    if (!visible || reducedMotion) return
    let frame = 0
    const move = () => {
      setPositions((current) => {
        const next = { ...current }
        ;(['mimi', 'puppy'] as PetName[]).forEach((name) => {
          const state = petStates[name]
          if (state !== 'walking' && state !== 'running' && state !== 'playing') return
          const direction = name === 'mimi' ? 1 : -1
          next[name] = { x: Math.min(Math.max(8, current[name].x + direction * (state === 'running' ? 1.5 : .6)), window.innerWidth - 72), y: Math.min(current[name].y, window.innerHeight - 82) }
        })
        return next
      })
      frame = window.requestAnimationFrame(move)
    }
    frame = window.requestAnimationFrame(move)
    return () => window.cancelAnimationFrame(frame)
  }, [petStates, reducedMotion, visible])
  useEffect(() => {
    if (event.id === 0) return
    if (event.kind === 'gallery') showLine({ speaker: 'together', text: event.text || habeebaData.dialogue.galleryReactions[0] })
    if (event.kind === 'photo') showLine({ speaker: 'mimi', text: habeebaData.dialogue.galleryReactions[Math.floor(Math.random() * habeebaData.dialogue.galleryReactions.length)] })
  }, [event.id])
  useEffect(() => {
    if (section !== 'gallery') return
    showLine({ speaker: 'together', text: habeebaData.dialogue.galleryReactions[Math.floor(Math.random() * habeebaData.dialogue.galleryReactions.length)] })
  }, [section])
  if (!visible) return <button className="companion-restore" onClick={onToggle}>Show Mimi &amp; Puppy</button>
  const getDialogue = (key: string): DialogueLine[] => {
    const normalized = key === 'top' || key === 'hero' ? 'hero' : key
    return (habeebaData.dialogue as Record<string, DialogueLine[]>)[normalized] || habeebaData.dialogue.hero
  }
  const showLine = (line: DialogueLine) => {
    setActiveSpeaker(line.speaker)
    setBubble(line.text)
    setJumping(line.speaker)
    setLineIndex((index) => index + 1)
    if (line.speaker === 'together') onBurst()
    window.setTimeout(() => setJumping(null), reducedMotion ? 1 : 700)
  }
  const clickCharacter = (speaker: 'mimi' | 'puppy') => {
    const options = habeebaData.dialogue.clicks[speaker]
    showLine({ speaker, text: options[Math.floor(Math.random() * options.length)] })
  }
  const clickTogether = () => showLine({ speaker: 'together', text: habeebaData.dialogue.clicks.together[Math.floor(Math.random() * habeebaData.dialogue.clicks.together.length)] })
  const beginDrag = (name: PetName, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragOffset.current = { x: event.clientX - positions[name].x, y: event.clientY - positions[name].y }
    setDragging(name)
    setPetStates((current) => ({ ...current, [name]: 'reacting' }))
    showLine({ speaker: name, text: name === 'mimi' ? 'Heheee! Where are we going? 💗' : 'Wheeeee! Take me somewhere!' })
  }
  const moveDrag = (name: PetName, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragging !== name) return
    setPositions((current) => ({ ...current, [name]: { x: Math.min(Math.max(8, event.clientX - dragOffset.current.x), window.innerWidth - 72), y: Math.min(Math.max(70, event.clientY - dragOffset.current.y), window.innerHeight - 82) } }))
  }
  const endDrag = (name: PetName) => {
    if (dragging !== name) return
    setDragging(null)
    setPetStates((current) => ({ ...current, [name]: 'idle' }))
    const distance = Math.hypot(positions.mimi.x - positions.puppy.x, positions.mimi.y - positions.puppy.y)
    if (distance < 110) {
      onBurst()
      showLine({ speaker: 'together', text: 'Aww, we found each other! 💗' })
    }
  }
  return <><button className={`companion companion-mimi pet-companion ${petStates.mimi} ${jumping === 'mimi' || jumping === 'together' ? 'companion-jump' : ''}`} style={{ left: positions.mimi.x, top: positions.mimi.y }} onPointerDown={(event) => beginDrag('mimi', event)} onPointerMove={(event) => moveDrag('mimi', event)} onPointerUp={() => endDrag('mimi')} onClick={() => { if (!dragging) clickCharacter('mimi') }} aria-label="Drag or talk to Mimi"><img src={habeebaData.finale.mimi.src} alt="Mimi the Kitty pixel-art companion" /><span>Mimi</span>{petStates.mimi === 'sleeping' && <i>Zzz</i>}</button><button className={`companion companion-puppy pet-companion ${petStates.puppy} ${jumping === 'puppy' || jumping === 'together' ? 'companion-jump' : ''}`} style={{ left: positions.puppy.x, top: positions.puppy.y }} onPointerDown={(event) => beginDrag('puppy', event)} onPointerMove={(event) => moveDrag('puppy', event)} onPointerUp={() => endDrag('puppy')} onClick={() => { if (!dragging) clickCharacter('puppy') }} aria-label="Drag or talk to Puppy"><img src={habeebaData.finale.puppy.src} alt="Puppy the pixel-art companion" /><span>Puppy</span>{petStates.puppy === 'sleeping' && <i>Zzz</i>}</button><aside className={`companions ${reducedMotion ? 'still' : ''}`} aria-label="Mimi and Puppy birthday companions"><button className="companion-dismiss" onClick={onToggle} aria-label="Hide Mimi and Puppy">×</button><div className={`companion-bubble ${activeSpeaker}`}><strong>{activeSpeaker === 'mimi' ? 'MIMI' : activeSpeaker === 'puppy' ? 'PUPPY' : 'MIMI + PUPPY'}</strong><span>{bubble}</span></div><div className="companion-row"><button className={`companion companion-mimi ${jumping === 'mimi' || jumping === 'together' ? 'companion-jump' : ''}`} onClick={() => clickCharacter('mimi')} aria-label="Talk to Mimi"><img src={habeebaData.finale.mimi.src} alt="Mimi the Kitty pixel-art companion" /><span>Mimi</span></button><button className={`companion companion-puppy ${jumping === 'puppy' || jumping === 'together' ? 'companion-jump' : ''}`} onClick={() => clickCharacter('puppy')} aria-label="Talk to Puppy"><img src={habeebaData.finale.puppy.src} alt="Puppy pixel-art companion" /><span>Puppy</span></button><button className="companion-together" onClick={clickTogether} aria-label="Make Mimi and Puppy speak together">♡</button></div>  </aside></>
  }

function FinaleSection({ reducedMotion, onHeart }: { reducedMotion: boolean; onHeart: () => void }) {
  const finaleRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [spoken, setSpoken] = useState(false)
  useEffect(() => {
    const node = finaleRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpoken(true)
    habeebaData.finale.spokenSegments.forEach((segment, index) => {
      const utterance = new SpeechSynthesisUtterance(segment.text)
      utterance.rate = .94
      utterance.pitch = segment.speaker === 'Mimi' ? 1.12 : 1.04
      utterance.onend = () => { if (index === habeebaData.finale.spokenSegments.length - 1) setSpoken(false) }
      window.speechSynthesis.speak(utterance)
    })
    onHeart()
  }
  return <section ref={finaleRef} className={`finale-section ${visible ? 'finale-visible' : ''}`} id="finale"><div className="finale-firework finale-firework-a">✹</div><div className="finale-firework finale-firework-b">✦</div><div className="finale-heading"><span className="eyebrow">THE GRAND FINALE</span><h2>One more little<br /><em>surprise.</em></h2><p className="finale-subtitle">THIS WHOLE DAY IS YOURS! 💗</p></div><div className="character-stage"><Character character={habeebaData.finale.mimi} className="mimi" reducedMotion={reducedMotion} /><div className="finale-speech"><span>HAPPY BIRTHDAY HABEEBAAAAA!! 🎂💗</span><button onClick={speak} className="speech-button">{spoken ? 'OUR WISH IS PLAYING ✦' : 'HEAR OUR BIRTHDAY WISH ❤️'}<Volume2 size={16} /></button></div><Character character={habeebaData.finale.puppy} className="puppy" reducedMotion={reducedMotion} /></div><p className="finale-note">Mimi and Puppy are the original pixel-art characters from the uploaded reference image.</p></section>
}

function Character({ character, className, reducedMotion }: { character: { name: string; src: string; alt: string }; className: string; reducedMotion: boolean }) {
  return <div className={`character ${className} ${reducedMotion ? 'still' : ''}`}>{character.src ? <img className="pixel-character" src={character.src} alt={character.alt} draggable="false" /> : <div className="character-placeholder"><Camera size={23} /><strong>{character.name}</strong><small>ADD REFERENCE IMAGE</small></div>}<span className="character-bubble">{character.bubble}</span><span className="character-name">{character.name}</span></div>
}

function Fireworks({ active, reducedMotion, burstKey }: { active: boolean; reducedMotion: boolean; burstKey: number }) {
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
    const bursts: { x: number; y: number; age: number; color: string; size: number; pattern: number }[] = []
    let lastBurstKey = burstKey
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
      if (document.hidden) {
        animation = window.requestAnimationFrame(draw)
        return
      }
      context.fillStyle = active ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.14)'
      context.clearRect(0, 0, width, height)
      if (frame % (active ? 28 : 45) === 0) bursts.push({ x: 30 + Math.random() * Math.max(1, width - 60), y: 70 + Math.random() * height * .48, age: 0, color: colors[Math.floor(Math.random() * colors.length)], size: active ? 2.2 + Math.random() * 2.8 : 1.4 + Math.random() * 2, pattern: Math.floor(Math.random() * 3) })
      if (burstKey !== lastBurstKey) {
        lastBurstKey = burstKey
        for (let i = 0; i < (active ? 4 : 2); i += 1) bursts.push({ x: width * (.18 + Math.random() * .64), y: height * (.15 + Math.random() * .35), age: 0, color: colors[(i + burstKey) % colors.length], size: 3.2, pattern: i % 3 })
      }
      bursts.forEach((burst) => {
        burst.age += 1
        context.globalAlpha = Math.max(0, 1 - burst.age / (active ? 95 : 75))
        context.shadowBlur = 12
        context.shadowColor = burst.color
        const particleCount = burst.pattern === 0 ? 34 : 24
        for (let i = 0; i < particleCount; i += 1) {
          const angle = (Math.PI * 2 * i) / particleCount
          const distance = burst.age * (burst.size + (i % 3) * .28)
          context.fillStyle = burst.color
          const particleSize = burst.pattern === 2 && i % 2 === 0 ? 4 : 2.5
          context.fillRect(burst.x + Math.cos(angle) * distance, burst.y + Math.sin(angle) * distance, particleSize, particleSize)
        }
        context.shadowBlur = 0
      })
      for (let i = bursts.length - 1; i >= 0; i -= 1) if (bursts[i].age > (active ? 95 : 75)) bursts.splice(i, 1)
      context.globalAlpha = 1
      for (let i = 0; i < (active ? 80 : 45); i += 1) {
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
  }, [active, burstKey, reducedMotion])
  return <canvas className={`fireworks ${active ? 'celebration-fireworks' : ''}`} ref={canvasRef} aria-hidden="true" />
}
