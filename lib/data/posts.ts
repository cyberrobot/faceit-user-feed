import { Author, Post } from '../types/post';

export const authors: Author[] = [
  {
    id: 'author-001',
    name: 'Maya Chen',
    username: 'mayachen',
    avatarUrl: 'https://api.dicebear.com/10.x/dylan/svg?seed=mayachen',
  },
  {
    id: 'author-002',
    name: 'Leo Martin',
    username: 'leomartin',
    avatarUrl: 'https://api.dicebear.com/10.x/dylan/svg?seed=leomartin',
  },
  {
    id: 'author-003',
    name: 'Amara Okafor',
    username: 'amaraokafor',
    avatarUrl: '',
  },
];

const [maya, leo, amara] = authors;

export const posts: Post[] = [
  {
    id: 'post-001',
    author: maya,
    content:
      'Finally got outside for a morning run. The fresh air was worth the early alarm.',
    createdAt: '2026-10-28T07:15:00.000Z',
  },
  {
    id: 'post-002',
    author: leo,
    content:
      'Just finished an incredible Counter-Strike 2 match! We were down 4-11 at halftime but managed to turn things around with some great teamwork and clutch plays. Definitely one of the best comebacks this season.',
    createdAt: '2026-10-28T08:05:00.000Z',
  },
  {
    id: 'post-003',
    author: amara,
    content: 'A small reminder to take a break, stretch, and drink some water.',
    createdAt: '2026-10-28T08:42:00.000Z',
  },
  {
    id: 'post-004',
    author: maya,
    content:
      'Looking for three experienced players to join our competitive squad. We usually practise in the evenings and participate in weekly tournaments. Good communication and a positive attitude are essential.',
    createdAt: '2026-10-27T17:30:00.000Z',
  },
  {
    id: 'post-005',
    author: leo,
    content:
      'After spending the last two weeks working on my aim and positioning, I finally reached FACEIT Level 10! The grind was challenging, but reviewing demos and practising consistently made a huge difference.',
    createdAt: '2026-10-27T12:20:00.000Z',
  },
  {
    id: 'post-006',
    author: amara,
    content:
      'The best part of cooking at home is having music on while everything simmers.',
    createdAt: '2026-10-27T19:10:00.000Z',
  },
  {
    id: 'post-007',
    author: maya,
    content:
      'Finished the book I started last week. That ending is going to stay with me.',
    createdAt: '2026-10-26T20:45:00.000Z',
  },
  {
    id: 'post-008',
    author: leo,
    content: 'A clear desk makes Monday feel a little more manageable.',
    createdAt: '2026-10-26T09:00:00.000Z',
  },
  {
    id: 'post-009',
    author: amara,
    content:
      'Found a quiet corner at the library and got through my whole reading list.',
    createdAt: '2026-10-25T15:35:00.000Z',
  },
  {
    id: 'post-010',
    author: maya,
    content: 'Weekend walk turned into a detour through the farmers market.',
    createdAt: '2026-10-25T11:25:00.000Z',
  },
  {
    id: 'post-011',
    author: leo,
    content: 'Made pancakes for breakfast. No occasion needed.',
    createdAt: '2026-10-24T09:12:00.000Z',
  },
  {
    id: 'post-012',
    author: amara,
    content: 'A good conversation can make an ordinary afternoon feel special.',
    createdAt: '2026-10-24T16:50:00.000Z',
  },
  {
    id: 'post-013',
    author: maya,
    content: 'Took the scenic route home and caught the last bit of sunset.',
    createdAt: '2026-10-23T18:22:00.000Z',
  },
  {
    id: 'post-014',
    author: leo,
    content: 'Finally organized the photos on my phone. It only took a year.',
    createdAt: '2026-10-23T20:05:00.000Z',
  },
  {
    id: 'post-015',
    author: amara,
    content:
      'Testing a new soup recipe tonight. The kitchen already smells amazing.',
    createdAt: '2026-10-22T17:40:00.000Z',
  },
  {
    id: 'post-016',
    author: maya,
    content:
      'Tried a short stretching routine before starting work. Keeping this habit.',
    createdAt: '2026-10-22T07:50:00.000Z',
  },
  {
    id: 'post-017',
    author: leo,
    content: 'Rainy evening, warm tea, and absolutely no plans. Perfect.',
    createdAt: '2026-10-21T19:30:00.000Z',
  },
  {
    id: 'post-018',
    author: amara,
    content: 'Picked up a few flowers for the table. Such a simple mood boost.',
    createdAt: '2026-10-21T14:15:00.000Z',
  },
  {
    id: 'post-019',
    author: maya,
    content:
      'A friend shared a podcast recommendation, and now I have five new episodes queued.',
    createdAt: '2026-10-20T18:05:00.000Z',
  },
  {
    id: 'post-020',
    author: leo,
    content: 'Took a proper lunch break away from my screen. Highly recommend.',
    createdAt: '2026-10-20T12:45:00.000Z',
  },
  {
    id: 'post-021',
    author: amara,
    content:
      'Had an amazing experience at the esports tournament this weekend. The atmosphere was electric, the competition was fierce, and we got to meet some incredibly talented players from across Europe.',
    createdAt: '2026-10-19T16:18:00.000Z',
  },
  {
    id: 'post-022',
    author: maya,
    content:
      'Went to a small gallery opening and discovered a new favorite artist.',
    createdAt: '2026-10-19T20:10:00.000Z',
  },
  {
    id: 'post-023',
    author: leo,
    content:
      'Does anyone else feel like the latest Counter-Strike 2 update has changed the weapon balance significantly? I have noticed some differences in recoil patterns and would love to hear what others think.',
    createdAt: '2026-10-18T10:35:00.000Z',
  },
  {
    id: 'post-024',
    author: amara,
    content: 'Sunday meal prep is done, and future me is already grateful.',
    createdAt: '2026-10-18T17:25:00.000Z',
  },
  {
    id: 'post-025',
    author: maya,
    content:
      'Our team has been experimenting with new strategies on Mirage, especially around mid control and early rotations. The results have been promising so far, but we still need to improve our coordination.',
    createdAt: '2026-10-17T08:28:00.000Z',
  },
  {
    id: 'post-026',
    author: leo,
    content:
      'Started learning a few phrases in a new language. One day at a time.',
    createdAt: '2026-10-17T21:00:00.000Z',
  },
  {
    id: 'post-027',
    author: amara,
    content: 'Made time for a long phone call with family tonight.',
    createdAt: '2026-10-16T19:42:00.000Z',
  },
  {
    id: 'post-028',
    author: maya,
    content: 'The first sip of coffee after a chilly walk really hit the spot.',
    createdAt: '2026-10-16T09:18:00.000Z',
  },
  {
    id: 'post-029',
    author: leo,
    content: 'Fixed the wobbly chair I kept ignoring. Small household victory.',
    createdAt: '2026-10-15T18:55:00.000Z',
  },
  {
    id: 'post-030',
    author: amara,
    content:
      'Found an old notebook full of ideas I had completely forgotten about.',
    createdAt: '2026-10-15T13:05:00.000Z',
  },
  {
    id: 'post-031',
    author: maya,
    content: 'Took the stairs today and somehow felt proud about it.',
    createdAt: '2026-10-14T11:10:00.000Z',
  },
  {
    id: 'post-032',
    author: leo,
    content:
      'Made a tiny playlist for a friend who needed a lift. Music is a good gift.',
    createdAt: '2026-10-14T20:32:00.000Z',
  },
  {
    id: 'post-033',
    author: amara,
    content:
      'Tried drawing for twenty minutes without worrying about getting it right.',
    createdAt: '2026-10-13T18:12:00.000Z',
  },
  {
    id: 'post-034',
    author: maya,
    content:
      'A sunny window seat and a good book made for a very slow afternoon.',
    createdAt: '2026-10-13T15:45:00.000Z',
  },
  {
    id: 'post-035',
    author: leo,
    content: 'Made a batch of granola and immediately had a bowl for dinner.',
    createdAt: '2026-10-12T19:08:00.000Z',
  },
  {
    id: 'post-036',
    author: amara,
    content: 'Walked a different route today and found a lovely little park.',
    createdAt: '2026-10-12T10:22:00.000Z',
  },
  {
    id: 'post-037',
    author: maya,
    content:
      'Wrapped up a project I have been chipping away at for weeks. On to the next.',
    createdAt: '2026-10-11T16:40:00.000Z',
  },
  {
    id: 'post-038',
    author: leo,
    content:
      'Tonight’s plan: homemade pasta and a movie I have seen a dozen times.',
    createdAt: '2026-10-11T18:30:00.000Z',
  },
  {
    id: 'post-039',
    author: amara,
    content: 'Put my phone away for the evening and finished a puzzle instead.',
    createdAt: '2026-10-10T21:15:00.000Z',
  },
  {
    id: 'post-040',
    author: maya,
    content: 'A good week deserves a slow start to the weekend.',
    createdAt: '2026-10-10T09:05:00.000Z',
  },
];
