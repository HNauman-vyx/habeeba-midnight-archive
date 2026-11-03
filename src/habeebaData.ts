export type DataItem = {
  id: string
  title: string
  body: string
  meta?: string
  accent?: string
}

export const habeebaData = {
  // PERSONALISATION GUIDE
  // 1. Replace the marked text below with your own words.
  // 2. Put local images in public/images and reference them as "/images/filename.jpg".
  // 3. Put local audio in public/audio and reference it as "/audio/filename.mp3".
  // 4. Keep placeholders until you have real content; the interface will remain safe and usable.
  recipientName: 'Habeeba',
  subtitle: 'A private little universe, saved for midnight.',
  personalisation: {
    senderName: 'YOUR NAME HERE',
    photoSlots: [
      { id: 'photo-1', label: 'Optional hero photo', src: '' },
      { id: 'photo-2', label: 'Optional constellation photo', src: '' },
    ],
    memories: 'Add only real shared memories in the constellation entries below.',
    reasons: 'Add specific, honest reasons in the constellation entries below.',
    letters: 'Replace the Transmission and Vault letter copy with your own writing.',
    audio: 'Add audio paths below. Playback never starts automatically.',
  },
  birthday: {
    year: 2026,
    month: 11,
    day: 4,
    timezone: 'Asia/Kolkata',
  },
  audio: {
    distanceFm: {
      label: 'Distance FM audio',
      src: '',
    },
    transmission: {
      label: 'Optional voice note',
      src: '',
    },
  },
  transmission: {
    eyebrow: 'TRANSMISSION // 001',
    title: 'For the person who makes ordinary days glow.',
    paragraphs: [
      'This archive is a small, deliberately over-designed way of saying: you matter here.',
      'Replace these lines with your own letter, inside joke, or the thing you have been meaning to say.',
    ],
    signature: '— YOUR NAME HERE',
  },
  constellation: [
    { id: 'memory-1', title: 'A favourite memory', body: 'Replace with a shared memory.', meta: 'PLACEHOLDER' },
    { id: 'memory-2', title: 'A quality I love', body: 'Replace with something specific and true.', meta: 'PLACEHOLDER' },
    { id: 'memory-3', title: 'A future wish', body: 'Replace with a gentle wish for the year ahead.', meta: 'PLACEHOLDER' },
    { id: 'memory-4', title: 'A tiny detail', body: 'Replace with an oddly specific detail only you notice.', meta: 'PLACEHOLDER' },
  ] satisfies DataItem[],
  vault: [
    { id: 'note-1', title: 'Birthday letter', body: 'Write your longer birthday letter here. This text is editable inside the Vault.', meta: 'EDITABLE LETTER' },
    { id: 'note-2', title: 'Evidence of good taste', body: 'Add a photo filename or a link to something that feels like her.', meta: 'OPTIONAL FILE' },
    { id: 'note-3', title: 'A future unlock', body: 'Add something to revisit after the birthday.', meta: 'OPTIONAL FILE' },
  ] satisfies DataItem[],
  capsule: [
    { id: 'capsule-1', title: 'Open when you need a soft place', body: 'Write something comforting here.', meta: '01 / 03' },
    { id: 'capsule-2', title: 'Open when you need a laugh', body: 'Write something silly here.', meta: '02 / 03' },
    { id: 'capsule-3', title: 'Open when you forget', body: 'Write the reminder she should always have.', meta: '03 / 03' },
  ] satisfies DataItem[],
}

export type AppId = 'distance' | 'transmission' | 'constellation' | 'vault' | 'capsule'
