import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Archive,
  ArrowLeft,
  BatteryCharging,
  Bell,
  BookHeart,
  ChevronRight,
  CircleHelp,
  Clock3,
  Disc3,
  Edit3,
  Headphones,
  Home,
  LockKeyhole,
  Menu,
  Moon,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  TimerReset,
  Unlock,
  Volume2,
  X,
} from 'lucide-react'
import { AppId, DataItem, habeebaData } from './habeebaData'

type PersistedState = {
  unlocked: boolean
  preview: boolean
  opened: AppId[]
  activeApp: AppId | null
  readItems: string[]
  capsuleStep: number
  volume: number
  vaultDraft: string
}

const STORAGE_KEY = 'habeeba-midnight-archive-state'

const apps: { id: AppId; label: string; caption: string; icon: typeof Radio; tone: string }[] = [
  { id: 'distance', label: 'Distance FM', caption: 'signal / 01', icon: Radio, tone: 'violet' },
  { id: 'transmission', label: 'Transmission', caption: 'letter / 02', icon: Sparkles, tone: 'rose' },
  { id: 'constellation', label: 'Her Constellation', caption: 'stars / 03', icon: Star, tone: 'blue' },
  { id: 'vault', label: '0411 Vault', caption: 'locked / 04', icon: Archive, tone: 'amber' },
  { id: 'capsule', label: 'Time Capsule', caption: 'future / 05', icon: TimerReset, tone: 'mint' },
]

const defaultState: PersistedState = {
  unlocked: false,
  preview: false,
  opened: [],
  activeApp: null,
  readItems: [],
  capsuleStep: 0,
  volume: 0.65,
  vaultDraft: habeebaData.vault[0].body,
}

function readState(): PersistedState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<PersistedState> | null
    return {
      ...defaultState,
      ...parsed,
      opened: parsed?.opened || [],
      readItems: parsed?.readItems || [],
      vaultDraft: parsed?.vaultDraft ?? defaultState.vaultDraft,
    }
  } catch {
    return defaultState
  }
}

function getTargetDate(): number {
  // Asia/Kolkata is UTC+05:30 and does not observe daylight saving time.
  return Date.parse(`${habeebaData.birthday.year}-${String(habeebaData.birthday.month).padStart(2, '0')}-${String(habeebaData.birthday.day).padStart(2, '0')}T18:30:00.000Z`)
}

function formatTime(ms: number): { days: number; hours: number; mins: number; secs: number } {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins: Math.floor((total % 3600) / 60),
    secs: total % 60,
  }
}

function formatClock(timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function App() {
  const [state, setState] = useState<PersistedState>(readState)
  const [booting, setBooting] = useState(true)
  const [now, setNow] = useState(Date.now())
  const [shadeOpen, setShadeOpen] = useState(false)
  const [managerOpen, setManagerOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [reducedMotion, setReducedMotion] = useState(false)
  const uiRef = useRef<{ shadeOpen: boolean; managerOpen: boolean; activeApp: AppId | null }>({ shadeOpen: false, managerOpen: false, activeApp: null })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  uiRef.current = { shadeOpen, managerOpen, activeApp: state.activeApp }

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 520)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    onChange()
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (shadeOpen) setShadeOpen(false)
        else if (managerOpen) setManagerOpen(false)
        else if (state.activeApp) setState((s) => ({ ...s, activeApp: null }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [managerOpen, shadeOpen, state.activeApp])

  useEffect(() => {
    if (!state.unlocked) return
    window.history.pushState({ habeebaOs: true }, '')
    const onPopState = () => {
      if (uiRef.current.shadeOpen) setShadeOpen(false)
      else if (uiRef.current.managerOpen) setManagerOpen(false)
      else if (uiRef.current.activeApp) setState((s) => ({ ...s, activeApp: null }))
      window.history.pushState({ habeebaOs: true }, '')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [state.unlocked])

  const remaining = formatTime(getTargetDate() - now)
  const birthdayStarted = getTargetDate() <= now

  const update = useCallback((patch: Partial<PersistedState>) => setState((current) => ({ ...current, ...patch })), [])
  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }, [])

  const openApp = (id: AppId) => {
    update({ activeApp: id, opened: state.opened.includes(id) ? state.opened : [...state.opened, id] })
    setShadeOpen(false)
    setManagerOpen(false)
  }

  const closeApp = () => update({ activeApp: null })
  const markRead = (id: string) => update({ readItems: state.readItems.includes(id) ? state.readItems : [...state.readItems, id] })
  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
    setShadeOpen(false)
    setManagerOpen(false)
    notify('Archive reset')
  }

  return (
    <div className={`os-shell ${reducedMotion ? 'reduced-motion' : ''}`}>
      {booting ? <BootScreen /> : !state.unlocked ? (
        <LockScreen
          now={now}
          remaining={remaining}
          birthdayStarted={birthdayStarted}
          preview={state.preview}
          onUnlock={() => update({ unlocked: true })}
          onPreview={() => update({ preview: true, unlocked: true })}
        />
      ) : (
        <div className="phone-stage">
          <StatusBar now={now} onShade={() => setShadeOpen(true)} />
          <main className="screen-content">
            {state.activeApp ? (
              <AppWindow
                appId={state.activeApp}
                state={state}
                remaining={remaining}
                onBack={closeApp}
                onRead={markRead}
                onCapsuleStep={(step) => update({ capsuleStep: step })}
                vaultDraft={state.vaultDraft}
                onVaultDraft={(vaultDraft) => update({ vaultDraft })}
                volume={state.volume}
                onVolume={(volume) => update({ volume })}
                notify={notify}
              />
            ) : (
              <Launcher
                remaining={remaining}
                birthdayStarted={birthdayStarted}
                opened={state.opened}
                onOpen={openApp}
                onManager={() => setManagerOpen(true)}
              />
            )}
          </main>
          <NavigationDock activeApp={state.activeApp} onHome={closeApp} onManager={() => setManagerOpen(true)} onShade={() => setShadeOpen(true)} />
          {shadeOpen && <NotificationShade remaining={remaining} onClose={() => setShadeOpen(false)} onOpen={openApp} onReset={reset} preview={state.preview} />}
          {managerOpen && <AppManager opened={state.opened} activeApp={state.activeApp} onClose={() => setManagerOpen(false)} onOpen={openApp} onReset={reset} />}
          {toast && <div className="toast">{toast}</div>}
        </div>
      )}
    </div>
  )
}

function BootScreen() {
  return <div className="boot-screen"><div className="boot-mark"><Sparkles size={24} /></div><span className="eyebrow">HABEEBA // OS</span><strong>THE MIDNIGHT ARCHIVE</strong><small>loading private frequency...</small></div>
}

function LockScreen({ now, remaining, birthdayStarted, preview, onUnlock, onPreview }: { now: number; remaining: ReturnType<typeof formatTime>; birthdayStarted: boolean; preview: boolean; onUnlock: () => void; onPreview: () => void }) {
  const date = new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)
  return (
    <div className="lock-screen">
      <div className="grain" />
      <div className="lock-topline"><span>HABEEBA // OS</span><span>ARCHIVE 04.11</span></div>
      <div className="lock-center">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <span className="eyebrow">THE MIDNIGHT ARCHIVE</span>
        <div className="lock-clock">{new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
        <div className="lock-date">{date.toUpperCase()}</div>
        <ClockStrip />
        <div className="countdown-card">
          <span>{birthdayStarted ? 'THE ARCHIVE IS LIVE' : 'COUNTDOWN TO HER DAY'}</span>
          <strong>{birthdayStarted ? '00 : 00 : 00' : `${String(remaining.days).padStart(2, '0')} : ${String(remaining.hours).padStart(2, '0')} : ${String(remaining.mins).padStart(2, '0')}`}</strong>
          {!birthdayStarted && <small>{String(remaining.secs).padStart(2, '0')} seconds remaining</small>}
        </div>
      </div>
      <div className="lock-bottom">
        <button className="unlock-button" onClick={onUnlock}><span>Swipe / tap to unlock</span><Unlock size={17} /></button>
        {!preview && <button className="preview-link" onClick={onPreview}>Preview mode · enter the archive now</button>}
      </div>
    </div>
  )
}

function StatusBar({ now, onShade }: { now: number; onShade: () => void }) {
  return <header className="status-bar" onClick={onShade}><span>{new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span><span className="status-title">HABEEBA // OS</span><span className="status-icons"><Volume2 size={13} /><BatteryCharging size={14} /></span></header>
}

function ClockStrip() {
  return <div className="clock-strip" aria-label="Current India and London times"><span><strong>INDIA</strong><b>{formatClock('Asia/Kolkata')}</b></span><i /><span><strong>LONDON</strong><b>{formatClock('Europe/London')}</b></span></div>
}

function Launcher({ remaining, birthdayStarted, opened, onOpen, onManager }: { remaining: ReturnType<typeof formatTime>; birthdayStarted: boolean; opened: AppId[]; onOpen: (id: AppId) => void; onManager: () => void }) {
  return (
    <div className="launcher">
      <section className="launcher-hero">
        <div className="eyebrow">WEDNESDAY // 04 NOVEMBER 2026</div>
        <h1>Good evening,<br /><em>Habeeba.</em></h1>
        <p>{birthdayStarted ? 'The archive has opened. Everything here is yours.' : 'A small universe is waiting behind the midnight signal.'}</p>
        <div className="mini-countdown"><Clock3 size={15} /> {birthdayStarted ? 'LIVE NOW' : `${remaining.days}d ${remaining.hours}h ${remaining.mins}m until midnight`}</div>
        <ClockStrip />
      </section>
      <section className="app-grid">
        {apps.map((app) => <AppIcon key={app.id} app={app} opened={opened.includes(app.id)} onOpen={onOpen} />)}
      </section>
      <section className="launcher-footer">
        <div><span className="eyebrow">SYSTEM NOTE</span><p>Five rooms. No rush. Come back whenever you need them.</p></div>
        <button className="round-button" onClick={onManager} aria-label="Open app manager"><Menu size={19} /></button>
      </section>
    </div>
  )
}

function AppIcon({ app, opened, onOpen }: { app: (typeof apps)[number]; opened: boolean; onOpen: (id: AppId) => void }) {
  const Icon = app.icon
  return <button className={`app-icon tone-${app.tone}`} onClick={() => onOpen(app.id)}><span className="app-icon-mark"><Icon size={24} strokeWidth={1.6} /></span><strong>{app.label}</strong><small>{opened ? 'recently visited' : app.caption}</small></button>
}

function NavigationDock({ activeApp, onHome, onManager, onShade }: { activeApp: AppId | null; onHome: () => void; onManager: () => void; onShade: () => void }) {
  return <nav className="nav-dock"><button onClick={onShade} aria-label="Notifications"><Bell size={18} /></button><button className={activeApp === null ? 'selected' : ''} onClick={onHome} aria-label="Home"><Home size={18} /></button><button onClick={onManager} aria-label="App manager"><Menu size={18} /></button></nav>
}

function NotificationShade({ remaining, onClose, onOpen, onReset, preview }: { remaining: ReturnType<typeof formatTime>; onClose: () => void; onOpen: (id: AppId) => void; onReset: () => void; preview: boolean }) {
  return <div className="overlay shade-overlay"><div className="shade-panel"><div className="panel-handle" /><div className="panel-head"><div><span className="eyebrow">NOTIFICATION SHADE</span><h2>Good evening.</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="quick-grid"><div><Moon size={16} /><span>Midnight mode</span><small>on</small></div><div><Headphones size={16} /><span>Audio ready</span><small>tap to play</small></div><div><Sparkles size={16} /><span>{preview ? 'Preview mode' : 'Birthday lock'}</span><small>{preview ? 'enabled' : 'active'}</small></div></div><div className="shade-note"><span className="eyebrow">NEXT SIGNAL</span><strong>{remaining.days} days, {remaining.hours} hours</strong><p>Distance FM will be waiting when the moment arrives.</p></div><div className="shade-actions"><button onClick={() => onOpen('distance')}><Radio size={16} /> Open Distance FM <ChevronRight size={16} /></button><button className="danger-action" onClick={onReset}><RotateCcw size={16} /> Reset local progress</button></div></div></div>
}

function AppManager({ opened, activeApp, onClose, onOpen, onReset }: { opened: AppId[]; activeApp: AppId | null; onClose: () => void; onOpen: (id: AppId) => void; onReset: () => void }) {
  return <div className="overlay manager-overlay"><div className="manager-panel"><div className="panel-head"><div><span className="eyebrow">APP MANAGER</span><h2>Open rooms</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{opened.length ? <div className="manager-list">{opened.map((id) => { const app = apps.find((item) => item.id === id)!; const Icon = app.icon; return <button key={id} onClick={() => onOpen(id)}><span className={`manager-icon tone-${app.tone}`}><Icon size={18} /></span><span><strong>{app.label}</strong><small>{activeApp === id ? 'currently open' : 'resume where you left off'}</small></span><ChevronRight size={16} /></button> })}</div> : <div className="empty-state"><CircleHelp size={24} /><p>Your recently opened rooms will appear here.</p></div>}<button className="text-button" onClick={onReset}>Reset local progress</button></div></div>
}

function AppWindow({ appId, state, remaining, onBack, onRead, onCapsuleStep, volume, onVolume, notify, vaultDraft, onVaultDraft }: { appId: AppId; state: PersistedState; remaining: ReturnType<typeof formatTime>; onBack: () => void; onRead: (id: string) => void; onCapsuleStep: (step: number) => void; volume: number; onVolume: (volume: number) => void; notify: (message: string) => void; vaultDraft: string; onVaultDraft: (value: string) => void }) {
  const app = apps.find((item) => item.id === appId)!
  const Icon = app.icon
  return <div className={`app-window app-${appId}`}><div className="app-header"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /></button><div><span className="eyebrow">{app.caption}</span><h2>{app.label}</h2></div><span className={`app-header-icon tone-${app.tone}`}><Icon size={18} /></span></div>{appId === 'distance' && <DistanceFM complete={state.readItems.includes('distance')} remaining={remaining} volume={volume} onVolume={onVolume} onRead={onRead} notify={notify} />}{appId === 'transmission' && <Transmission read={state.readItems.includes('transmission')} volume={volume} onVolume={onVolume} onRead={onRead} notify={notify} />}{appId === 'constellation' && <Constellation readItems={state.readItems} onRead={onRead} />}{appId === 'vault' && <Vault readItems={state.readItems} draft={vaultDraft} onDraft={onVaultDraft} onRead={onRead} />}{appId === 'capsule' && <TimeCapsule step={state.capsuleStep} readItems={state.readItems} onStep={onCapsuleStep} onRead={onRead} />}</div>
}

function DistanceFM({ complete, remaining, volume, onVolume, onRead, notify }: { complete: boolean; remaining: ReturnType<typeof formatTime>; volume: number; onVolume: (volume: number) => void; onRead: (id: string) => void; notify: (message: string) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const toggle = async () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    onRead('distance')
    try {
      await audioRef.current.play()
      setPlaying(true)
    } catch {
      setAudioError(true)
      notify('Add a local audio file in habeebaData.ts to enable playback')
    }
  }
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  return <div className="app-body distance-body"><audio ref={audioRef} src={habeebaData.audio.distanceFm.src || undefined} onEnded={() => setPlaying(false)} onError={() => setAudioError(true)} /><div className="signal-visual"><div className={`record ${playing ? 'spinning' : ''}`}><Disc3 size={72} strokeWidth={1} /><span>FM</span></div><div className="signal-lines"><i /><i /><i /><i /><i /></div></div><span className="eyebrow">LIVE FROM SOMEWHERE CLOSE</span><h1>A song for the<br /><em>distance between us.</em></h1><p className="app-copy">Tune the private frequency. Playback only begins after you press play.</p><div className="player-controls"><button className={`play-button ${complete ? 'done' : ''}`} onClick={toggle} aria-label={playing ? 'Pause Distance FM' : 'Play Distance FM'}>{playing ? <Pause size={22} /> : complete ? <Sparkles size={21} /> : <Play size={22} fill="currentColor" />}</button><div><strong>{playing ? 'Now transmitting' : complete ? 'Signal acknowledged' : audioError || !habeebaData.audio.distanceFm.src ? 'Signal waiting' : 'Ready when you are'}</strong><small>{audioError || !habeebaData.audio.distanceFm.src ? 'Optional audio · edit habeebaData.ts' : 'Distance FM · private channel'}</small></div></div><label className="volume-control"><Volume2 size={15} /><input aria-label="Distance FM volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => onVolume(Number(event.target.value))} /><span>{Math.round(volume * 100)}%</span></label><div className="app-footnote"><Clock3 size={14} /> {remaining.days ? `The birthday signal arrives in ${remaining.days} days.` : 'The birthday signal is live.'}</div></div>
}

function Transmission({ read, volume, onVolume, onRead, notify }: { read: boolean; volume: number; onVolume: (volume: number) => void; onRead: (id: string) => void; notify: (message: string) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const toggle = async () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    try {
      await audioRef.current.play()
      setPlaying(true)
      onRead('transmission')
    } catch {
      setError(true)
      notify('No recording yet — add the voice note path in habeebaData.ts')
    }
  }
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  return <div className="app-body transmission-body"><audio ref={audioRef} src={habeebaData.audio.transmission.src || undefined} onEnded={() => setPlaying(false)} onError={() => setError(true)} /><div className="message-hero"><div className={`message-orb ${playing ? 'speaking' : ''}`}><Headphones size={34} /></div><div><span className="eyebrow">VOICE CHANNEL // OPTIONAL</span><h3>{playing ? 'A voice from the archive' : 'A message, in your voice.'}</h3><p>{error || !habeebaData.audio.transmission.src ? 'No recording attached yet. The written letter below is always available.' : 'Press play when you are ready.'}</p></div></div><div className="letter-card"><div className="letter-stamp"><Sparkles size={18} /><span>04<br />11</span></div><span className="eyebrow">{habeebaData.transmission.eyebrow}</span><h1>{habeebaData.transmission.title}</h1>{habeebaData.transmission.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="letter-signature">{habeebaData.transmission.signature}</div></div><div className="voice-controls"><button className="voice-play" onClick={toggle} aria-label={playing ? 'Pause voice message' : 'Play voice message'}>{playing ? <Pause size={19} /> : <Play size={19} fill="currentColor" />}</button><div><strong>{playing ? 'Playing voice note' : 'Play voice note'}</strong><small>{habeebaData.audio.transmission.src ? 'Tap to hear the recording' : 'Optional · no recording attached'}</small></div><Volume2 size={15} /><input aria-label="Voice note volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => onVolume(Number(event.target.value))} /></div><button className={`complete-button ${read ? 'complete' : ''}`} onClick={() => { onRead('transmission'); notify('Transmission saved as read') }}>{read ? 'Transmission archived ✓' : 'Mark transmission as read'}</button></div>
}

function Constellation({ readItems, onRead }: { readItems: string[]; onRead: (id: string) => void }) {
  const [selected, setSelected] = useState<DataItem | null>(null)
  return <div className="app-body constellation-body"><p className="app-copy">Four stars in her orbit. Tap one to bring it closer.</p><div className="star-map">{habeebaData.constellation.map((item, index) => <button key={item.id} className={`star-node node-${index + 1} ${readItems.includes(item.id) ? 'visited' : ''}`} onClick={() => { setSelected(item); onRead(item.id) }}><span className="star-glow"><Star size={index === 0 ? 24 : 17} fill="currentColor" /></span><small>{item.title}</small></button>)}</div>{selected ? <div className="reveal-card"><span className="eyebrow">{selected.meta}</span><h3>{selected.title}</h3><p>{selected.body}</p><button className="text-button" onClick={() => setSelected(null)}>Return to the map</button></div> : <div className="map-hint"><Sparkles size={16} /> {readItems.filter((id) => habeebaData.constellation.some((item) => item.id === id)).length}/4 stars discovered</div>}</div>
}

function Vault({ readItems, draft, onDraft, onRead }: { readItems: string[]; draft: string; onDraft: (value: string) => void; onRead: (id: string) => void }) {
  const [selected, setSelected] = useState<DataItem | null>(null)
  const isLetter = selected?.id === 'note-1'
  return <div className="app-body vault-body"><div className="vault-intro"><LockKeyhole size={22} /><div><span className="eyebrow">SECURE DIRECTORY</span><p>Your editable birthday letter lives in file 01.</p></div></div><div className="vault-list">{habeebaData.vault.map((item) => <button key={item.id} className="vault-file" onClick={() => { setSelected(item); onRead(item.id) }}><span className="file-number">{item.id.slice(-1).padStart(2, '0')}</span><span><small>{item.meta}</small><strong>{item.title}</strong></span>{item.id === 'note-1' ? <Edit3 size={16} /> : <ChevronRight size={17} />}</button>)}</div>{selected && <div className="vault-modal"><div className={`vault-paper ${isLetter ? 'editable-paper' : ''}`}><button className="icon-button" onClick={() => setSelected(null)}><X size={17} /></button><span className="eyebrow">{selected.meta}</span><h3>{selected.title}</h3>{isLetter ? <><textarea aria-label="Editable birthday letter" value={draft} onChange={(event) => onDraft(event.target.value)} placeholder="Write the birthday letter here..." /><button className="save-letter" onClick={() => setSelected(null)}><Save size={15} /> Save letter</button></> : <p>{selected.body}</p>}<div className="vault-seal"><LockKeyhole size={15} /> 0411 / PRIVATE</div></div></div>}<div className="app-footnote"><LockKeyhole size={14} /> {readItems.filter((id) => habeebaData.vault.some((item) => item.id === id)).length} of 3 files opened</div></div>
}

function TimeCapsule({ step, readItems, onStep, onRead }: { step: number; readItems: string[]; onStep: (step: number) => void; onRead: (id: string) => void }) {
  const current = habeebaData.capsule[step]
  const opened = readItems.includes(current.id)
  return <div className="app-body capsule-body"><div className="capsule-orbit"><div className="capsule-core"><TimerReset size={30} /><span>{String(step + 1).padStart(2, '0')}</span></div></div><span className="eyebrow">{current.meta}</span><h1>{current.title}</h1><p className="capsule-copy">{current.body}</p><button className="open-capsule" onClick={() => onRead(current.id)}><BookHeart size={17} /> {opened ? 'Capsule opened ✓' : 'Open this capsule'}</button><div className="capsule-nav"><button disabled={step === 0} onClick={() => onStep(step - 1)}>Previous</button><div>{habeebaData.capsule.map((item, index) => <button aria-label={`Go to capsule ${index + 1}`} className={index === step ? 'active' : ''} key={item.id} onClick={() => onStep(index)} />)}</div><button disabled={step === habeebaData.capsule.length - 1} onClick={() => onStep(step + 1)}>Next</button></div></div>
}
