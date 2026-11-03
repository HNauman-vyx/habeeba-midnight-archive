export type Photo = {
  id: string
  src: string
  alt: string
  caption: string
  tone: 'peach' | 'sun' | 'coral' | 'pink'
}

export type Surprise = {
  id: string
  label: string
  title: string
  message: string
  color: 'orange' | 'pink' | 'gold' | 'coral'
}

export type DialogueLine = {
  speaker: 'mimi' | 'puppy' | 'together'
  text: string
}

export const habeebaData = {
  /**
   * PERSONALISATION GUIDE
   * - Replace every ALL-CAPS placeholder with something true about Habeeba.
   * - Add images to public/images and reference them as "/images/filename.jpg".
   * - Keep an image src empty when you do not have a photo yet; the gallery renders a graceful placeholder.
   * - Keep the copy focused on her birthday, joy, confidence, dreams, and the things that make her wonderful.
   */
  name: 'Habeeba',
  birthday: {
    month: 11,
    day: 4,
    year: 2026,
    timezone: 'Asia/Kolkata',
  },
  opening: {
    kicker: 'A whole universe, made for one wonderful person',
    headline: 'HAPPY BIRTHDAY',
    subheadline: 'HABEEBA!',
    message: 'Today is yours. Every colour, sparkle and little surprise on this page is here to celebrate you.',
  },
  world: {
    intro: 'The world is brighter with Habeeba in it.',
    paragraphs: [
      'Use this space to describe her in the words that feel most like her: the energy she brings into a room, the way she makes people feel, and the details that make her completely herself.',
      'This is her day to be celebrated loudly, gently, joyfully and without holding back.',
    ],
    compliments: [
      { label: 'Her magic', text: 'ADD A SPECIFIC QUALITY THAT MAKES HER GLOW', icon: '✦' },
      { label: 'Her spark', text: 'ADD SOMETHING ABOUT HER PERSONALITY', icon: '✹' },
      { label: 'Her joy', text: 'ADD ONE OF HER FAVOURITE THINGS OR LITTLE HABITS', icon: '♡' },
    ],
    favourites: [
      'ADD A FAVOURITE COLOUR',
      'ADD A FAVOURITE FOOD',
      'ADD A FAVOURITE SONG OR ARTIST',
      'ADD AN INTEREST OR DREAM',
    ],
  },
  photos: [
    { id: 'photo-1', src: '', alt: 'Habeeba photo one', caption: 'A moment that feels unmistakably her.', tone: 'peach' },
    { id: 'photo-2', src: '', alt: 'Habeeba photo two', caption: 'Add a favourite memory in one line.', tone: 'sun' },
    { id: 'photo-3', src: '', alt: 'Habeeba photo three', caption: 'A little snapshot of her wonderful world.', tone: 'coral' },
    { id: 'photo-4', src: '', alt: 'Habeeba photo four', caption: 'One more reason to celebrate her.', tone: 'pink' },
  ] satisfies Photo[],
  surprises: [
    { id: 'surprise-1', label: 'Open me first', title: 'A wish for her year', message: 'MAY THIS YEAR BRING YOU MORE JOY, CONFIDENCE, PEACE AND BEAUTIFUL SURPRISES THAN YOU EXPECT.', color: 'orange' },
    { id: 'surprise-2', label: 'A tiny secret', title: 'The best kind of reminder', message: 'YOU DO NOT HAVE TO BECOME ANYONE ELSE TO BE EXTRAORDINARY. YOU ALREADY ARE.', color: 'pink' },
    { id: 'surprise-3', label: 'For the big dreams', title: 'Permission to shine', message: 'TAKE UP SPACE. TRY THE THING. LET YOURSELF BE PROUD OF HOW FAR YOU HAVE COME.', color: 'gold' },
  ] satisfies Surprise[],
  wishes: [
    'More moments that make you laugh until your cheeks hurt.',
    'More confidence in every beautiful thing you are becoming.',
    'More doors opening for the dreams you keep close.',
    'More softness, colour, rest and reasons to celebrate.',
    'A year that feels as special as you are.',
  ],
  letter: {
    salutation: 'Dear Habeeba,',
    paragraphs: [
      'Today is a celebration of you: your light, your courage, your imagination and every small detail that makes you completely unforgettable.',
      'I hope this next year gives you room to grow into every dream, to choose joy without apology, and to see yourself with the same warmth and admiration that the people around you feel.',
      'May your days be full of beautiful surprises, meaningful wins, ridiculous laughter and the confidence to keep becoming exactly who you want to be.',
    ],
    signoff: 'With every good wish for your brightest year yet,',
    signature: 'YOUR NAME HERE',
  },
  optionalAudio: {
    src: '',
    label: 'Optional birthday voice note',
  },
  finale: {
    mimi: {
      name: 'Mimi the Kitty',
      src: '/images/mimi.png',
      alt: 'Reference image of Mimi the Kitty',
      bubble: 'Hi Habeeba! 💗',
    },
    puppy: {
      name: 'Puppy',
      src: '/images/puppy.png',
      alt: 'Reference image of Puppy',
      bubble: 'Yay, it is your day! 🎂',
    },
    referenceSheet: '/images/mimi-puppy-reference.png',
    speech: 'HAPPY BIRTHDAY HABEEBA!! 🎂💗',
    spokenWish: 'Happy birthday, Habeeba! We have been waiting all day to celebrate you! We hope your birthday is filled with beautiful surprises, happiness, laughter and everything your heart wishes for! Keep smiling, keep shining and never forget how special you are! Happy birthday Habeeba! We love you!',
    spokenSegments: [
      { speaker: 'Puppy', text: 'Happy birthday, Habeeba! We have been waiting all day to celebrate you!' },
      { speaker: 'Mimi', text: 'We hope your birthday is filled with beautiful surprises, happiness, laughter and everything your heart wishes for!' },
      { speaker: 'Puppy', text: 'Keep smiling, keep shining and never forget how special you are!' },
      { speaker: 'Mimi and Puppy', text: 'Happy birthday Habeeba! We love you!' },
    ],
  },
  dialogue: {
    hero: [
      { speaker: 'puppy', text: "Mimi! Today's the BIG day!" },
      { speaker: 'mimi', text: "HABEEBA'S BIRTHDAYYYYY!" },
      { speaker: 'together', text: 'Quick! Get the fireworks ready!!' },
    ],
    world: [
      { speaker: 'mimi', text: "Let's remind her how special she is." },
      { speaker: 'puppy', text: 'She deserves to hear it every day!' },
    ],
    gallery: [
      { speaker: 'puppy', text: 'Look at these lovely pictures!' },
      { speaker: 'mimi', text: 'I want to see all of them!' },
    ],
    surprises: [
      { speaker: 'mimi', text: 'PRESENT TIME!' },
      { speaker: 'puppy', text: 'I wonder what is inside!' },
    ],
    wishes: [
      { speaker: 'mimi', text: 'She deserves so many beautiful things!' },
      { speaker: 'puppy', text: 'Especially happiness and lots of treats!' },
    ],
    letter: [
      { speaker: 'puppy', text: 'We have one more special message.' },
      { speaker: 'mimi', text: "Let's make this one count." },
    ],
    clicks: {
      mimi: ['You are absolutely wonderful, Habeeba! 💗', 'Mimi approves this birthday energy! ✨', 'Keep shining, birthday star!'],
      puppy: ['Birthday hugs incoming! 🎂', 'You deserve the biggest celebration!', 'Puppy says: more cake, more joy!'],
      together: ['HAPPY BIRTHDAY HABEEBA!! 💗', 'We love celebrating you!', 'Best birthday ever, right now!'],
    },
    conversations: [
      [{ speaker: 'puppy', text: 'Mimiiii, are you sleeping again?' }, { speaker: 'mimi', text: 'Just five more minutes...' }, { speaker: 'puppy', text: "But it is Habeeba's birthday!" }, { speaker: 'mimi', text: 'WAIT WHAT?! WE NEED TO CELEBRATE!' }],
      [{ speaker: 'mimi', text: 'I wonder what Habeeba is doing.' }, { speaker: 'puppy', text: 'Probably exploring all her beautiful birthday surprises!' }, { speaker: 'mimi', text: 'I hope she likes everything!' }],
      [{ speaker: 'puppy', text: 'Look at all these flowers!' }, { speaker: 'mimi', text: "They are almost as pretty as today's birthday girl!" }],
      [{ speaker: 'mimi', text: 'Should we prepare another surprise?' }, { speaker: 'puppy', text: 'Already on it! Fireworks, please!' }],
      [{ speaker: 'puppy', text: 'Do you think she saw the cake?' }, { speaker: 'mimi', text: 'If not, we should add more sparkles!' }],
      [{ speaker: 'mimi', text: 'This whole website feels so joyful.' }, { speaker: 'puppy', text: 'Because it was made for Habeeba!' }],
      [{ speaker: 'puppy', text: 'I found another heart!' }, { speaker: 'mimi', text: 'Keep it safe for the birthday girl.' }],
      [{ speaker: 'mimi', text: 'Gallery time!' }, { speaker: 'puppy', text: 'Every picture deserves a little celebration!' }],
      [{ speaker: 'puppy', text: 'I hear a wish coming.' }, { speaker: 'mimi', text: 'Quick, make it a wonderful one!' }],
      [{ speaker: 'mimi', text: 'We are getting close to the finale.' }, { speaker: 'puppy', text: 'Then we need our biggest birthday voices!' }],
    ] satisfies DialogueLine[][],
    galleryReactions: [
      'OMGGGG! LOOK AT HOW BEAUTIFUL SHE IS!! 💗',
      "She's literally glowing!",
      'Look at that smileeeee!',
      'Every picture is prettier than the last one!',
      'WE NEED MORE PICTURES!',
      'This photo feels full of joy!',
    ],
  },
}
