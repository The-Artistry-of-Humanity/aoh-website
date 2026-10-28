// Shared content for the AOH site. Keynotes, testimonials and the client list
// come from Ian's speaker profile (Claude Design, Oct 2026); the pillars and
// the Sherpany results from the previous site.

/** Ian's showreel on YouTube ("Watch Ian live"). */
export const VIDEO = 'iV0k9AT4i3U';

export const CLIENTS = ['Cisco', 'DHL', 'Datasite', 'Boston Scientific', 'Northrop', 'USI Insurance Services'];

export const KEYNOTES = [
  {
    title: 'The Art of Being Human', tag: 'Signature', sub: 'Resilience, inside out', img: '/assets/keynote.jpg',
    hook: 'Resilience isn’t the ability to endure more pressure. It’s understanding ourselves, managing our capacity and owning how we respond.',
    text: 'Resilience isn’t the ability to endure more pressure. It’s understanding ourselves, managing our capacity, recovering intentionally and owning how we respond. Audiences score themselves live against the Five Pillars of Fulfilment.',
    leave: ['A framework for navigating pressure', 'An honest picture of their life across the Five Pillars', 'A nervous-system reset they can use anytime'],
  },
  {
    title: 'The Energy Effect', tag: 'Keynote', sub: 'Own it. Protect it. Elevate it.', img: '/assets/keynote-energy.png',
    hook: 'Who, or what, is stealing your energy? How energy is gained, drained and transferred, and how it becomes culture.',
    text: 'Who, or what, is stealing your energy? Starting with Energy Vampires and Energy Boosters, this lively session shows how energy is gained, drained and transferred, and how individual energy becomes collective culture.',
    leave: ['A clear read on their energy drains and boosters', 'Practical ways to protect their capacity', 'What leaders do to lift a whole team'],
  },
  {
    title: 'The Gold in the Cracks', tag: 'Keynote', sub: 'Inspired by kintsugi', img: '/assets/keynote-kintsugi.png',
    hook: 'Our cracks can become a source of strength, and leaders decide whether people feel safe enough to show them.',
    text: 'Our cracks can become a source of strength. Contrasting kintsugi with karōshi, this session examines the role leaders play in creating environments where people feel seen, heard and safe to speak honestly.',
    leave: ['Why hiding the cracks costs more than showing them', 'How to use vulnerability appropriately at work', 'The warning signs a culture is missing'],
  },
];

export const BOOK_IAN = [
  ['A room that opens up', 'Ian goes first with his own story, hard parts included, and that gives people permission to be honest too. Polite rooms end up laughing, reflecting and saying things they didn’t expect to.'],
  ['Emotion and substance', 'Thirty years in operational leadership means Ian speaks the language of performance as fluently as the language of people. Audiences feel something; leaders get something they can defend in a boardroom.'],
  ['Something that outlasts the day', 'Most keynotes are forgotten by Monday. Ian leaves people with a framework and one clear action, so the conversation carries on long after he’s left the stage.'],
  ['Shaped around your room', 'No two sessions are the same. Ian tailors every keynote to your audience and context, then reads the room live and adapts.'],
];

export const TESTIMONIALS = [
  { name: 'Andreas Bicking', org: 'Head of eCommerce, DHL', quote: 'I have never met a person with Ian’s level of positive energy and the gift to engage others.' },
  { name: 'Sorin Popa', org: 'VP of Engineering, Datasite', quote: 'This wasn’t another wellbeing workshop. It was a genuine shift in how our leadership team thinks about culture, people, and performance.' },
  { name: 'Cassie Fleming', org: 'Talent Acquisition Director, Cisco', quote: 'Ian is an incredibly experienced, genuine and skilled leader and facilitator who cares deeply about enabling teams to be their best.' },
];

export const PILLARS = [
  { name: 'Health & Fitness', short: 'Physical vitality as the foundation: energy, movement and the body–mind connection.' },
  { name: 'Internal Work', short: 'Self-awareness, emotional regulation, purpose and identity. How we show up.' },
  { name: 'Love & Relationships', short: 'The quality of our closest connections, and their effect on everything we do.' },
  { name: 'Social Connection', short: 'Community, friendship and belonging beyond our innermost circle.' },
  { name: 'Work & Life Flow', short: 'Not balance but integration: ambition and fulfilment reinforcing each other.' },
];
