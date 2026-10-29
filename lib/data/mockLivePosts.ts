import type { Author, Post } from '@/lib/types/post';

const alex: Author = {
  id: 'author-live',
  name: 'Alex Morgan',
  username: 'alexmorgan',
  avatarUrl: '',
};

const jordan: Author = {
  id: 'author-jordan',
  name: 'Jordan Lee',
  username: 'jordanlee',
  avatarUrl: 'https://api.dicebear.com/10.x/voxel-art/svg?seed=jordanlee',
};

const priya: Author = {
  id: 'author-priya',
  name: 'Priya Shah',
  username: 'priyashah',
  avatarUrl: '',
};

const ethan: Author = {
  id: 'author-ethan',
  name: 'Ethan Brooks',
  username: 'ethanbrooks',
  avatarUrl: 'https://api.dicebear.com/10.x/voxel-art/svg?seed=ethanbrooks',
};

export const mockLivePosts: Post[] = [
  {
    id: 'live-001',
    title: 'An Incredible CS2 Comeback',
    content: 'We were losing 4–11 before pulling off an unbelievable comeback.',
    author: alex,
    createdAt: '2026-10-29T16:00:00.000Z',
  },
  {
    id: 'live-002',
    title: 'Finally Reached Level 10',
    content: 'After months of practice, I finally reached FACEIT Level 10.',
    author: alex,
    createdAt: '2026-10-29T16:05:00.000Z',
  },
  {
    id: 'live-003',
    title: 'First Ace of the Week',
    content:
      'Just landed my first ace of the week on Mirage! I was holding the B site when the entire enemy team pushed through apartments. Somehow managed to win every duel without reloading. My teammates were absolutely losing their minds.',
    author: jordan,
    createdAt: '2026-10-29T16:10:00.000Z',
  },
  {
    id: 'live-004',
    title: 'Looking for a FACEIT Stack',
    content:
      'Looking for three players to join our FACEIT stack this evening. We are around levels 7–9 and mainly play Mirage, Inferno and Ancient. Good communication and a positive attitude are much more important than individual statistics.',
    author: priya,
    createdAt: '2026-10-29T16:15:00.000Z',
  },
  {
    id: 'live-005',
    title: 'The Perfect Smoke Lineup',
    content:
      'Spent an hour practising smoke lineups on Ancient and finally found one that completely blocks the defender rotation. Tried it in a match and it worked perfectly. Sometimes the smallest details make the biggest difference.',
    author: ethan,
    createdAt: '2026-10-29T16:20:00.000Z',
  },
  {
    id: 'live-006',
    title: 'Five Wins in a Row',
    content:
      'Five consecutive FACEIT wins today! The best part is that none of the matches felt particularly difficult because everyone was communicating and playing their roles. Teamwork really does make everything easier.',
    author: alex,
    createdAt: '2026-10-29T16:25:00.000Z',
  },
  {
    id: 'live-007',
    title: 'Time to Upgrade My Mouse?',
    content:
      'My gaming mouse has started double-clicking after three years of heavy use. Thinking about switching to something wireless and lightweight. Any recommendations for competitive CS2 that will not cost a fortune?',
    author: jordan,
    createdAt: '2026-10-29T16:30:00.000Z',
  },
  {
    id: 'live-008',
    title: 'An Unexpected Overtime Victory',
    content:
      'Just finished a ridiculous overtime match on Inferno. Both teams kept trading rounds and nobody could establish a lead. We eventually won 19–17 after nearly an hour of playing. I think I need a proper break before queuing again.',
    author: priya,
    createdAt: '2026-10-29T16:35:00.000Z',
  },
  {
    id: 'live-009',
    title: 'Improving My Aim Routine',
    content:
      'Changed my aim practice from one long deathmatch session to three shorter exercises focusing on tracking, flicking and crosshair placement. After two weeks, my consistency feels noticeably better. Quality practice beats mindless repetition.',
    author: ethan,
    createdAt: '2026-10-29T16:40:00.000Z',
  },
  {
    id: 'live-010',
    title: 'A Friendly Reminder About Tilt',
    content:
      'If you lose three competitive matches in a row, consider taking a break instead of immediately queuing for another. I learned this the hard way yesterday. A fresh mindset can make more difference than another hour of practice.',
    author: alex,
    createdAt: '2026-10-29T16:45:00.000Z',
  },
  {
    id: 'live-011',
    title: 'Our Team Finally Has a Name',
    content:
      'After weeks of debating names in Discord, our little CS2 team finally settled on one. We are putting together a logo and planning to enter our first online tournament next month. It is starting to feel like a proper team!',
    author: jordan,
    createdAt: '2026-10-29T16:50:00.000Z',
  },
  {
    id: 'live-012',
    title: 'Trying Valorant for the First Time',
    content:
      'After years of playing Counter-Strike, I finally gave Valorant a proper try. The shooting mechanics feel familiar, but learning all the agent abilities is overwhelming. Still, I can understand why so many people enjoy it.',
    author: priya,
    createdAt: '2026-10-29T16:55:00.000Z',
  },
  {
    id: 'live-013',
    title: 'A Lesson in Communication',
    content:
      'We lost a match today despite having significantly better individual statistics than our opponents. Looking back, almost every lost round involved poor communication or unnecessary solo plays. Winning duels means very little without coordination.',
    author: ethan,
    createdAt: '2026-10-29T17:00:00.000Z',
  },
  {
    id: 'live-014',
    title: 'Finally Fixed My Frame Drops',
    content:
      'Spent the afternoon troubleshooting inconsistent frame rates in CS2. Turned out an unnecessary background application was consuming far more resources than expected. The game feels dramatically smoother now.',
    author: alex,
    createdAt: '2026-10-29T17:05:00.000Z',
  },
  {
    id: 'live-015',
    title: 'The Most Wholesome Random Team',
    content:
      'Queued solo expecting the usual chaos and ended up with four incredibly friendly teammates. Everyone communicated, encouraged each other and laughed about mistakes. We lost the match, but it was easily the most enjoyable game of the day.',
    author: jordan,
    createdAt: '2026-10-29T17:10:00.000Z',
  },
  {
    id: 'live-016',
    title: 'Learning to Play as an IGL',
    content:
      'I have started taking the in-game leader role for our team. Calling strategies while concentrating on my own gameplay is much harder than I expected. It has given me a completely new appreciation for professional IGLs.',
    author: priya,
    createdAt: '2026-10-29T17:15:00.000Z',
  },
  {
    id: 'live-017',
    title: 'My First Community Tournament Win',
    content:
      'We just won our first small community tournament! Nothing professional, just eight teams competing over a weekend, but it feels incredible. Everyone contributed something important and we managed to stay calm during the final.',
    author: ethan,
    createdAt: '2026-10-29T17:20:00.000Z',
  },
  {
    id: 'live-018',
    title: 'Rediscovering an Old Favourite',
    content:
      'Took a break from competitive shooters and started replaying The Witcher 3. I had forgotten how enjoyable it is to explore a world without worrying about rankings, reaction times or teammates. Sometimes a single-player adventure is exactly what you need.',
    author: alex,
    createdAt: '2026-10-29T17:25:00.000Z',
  },
  {
    id: 'live-019',
    title: 'Does Monitor Refresh Rate Matter?',
    content:
      'Recently upgraded from a 60Hz monitor to a 165Hz display, and the difference is much bigger than I expected. Movement feels smoother and tracking targets seems easier. I genuinely wish I had made the switch years ago.',
    author: jordan,
    createdAt: '2026-10-29T17:30:00.000Z',
  },
  {
    id: 'live-020',
    title: 'Weekend Gaming Plans',
    content:
      'Planning a relaxed gaming weekend with friends. A few FACEIT matches, some co-op games and probably far too much pizza. It will be nice to play together without worrying about winning every single match.',
    author: priya,
    createdAt: '2026-10-29T17:35:00.000Z',
  },
  {
    id: 'live-021',
    title: 'Why I Started Reviewing My Demos',
    content:
      'Watching my recorded matches has been uncomfortable but incredibly useful. I keep noticing mistakes that I never recognise while playing, especially poor positioning and unnecessary peeks. Reviewing one demo teaches me more than playing three matches on autopilot.',
    author: ethan,
    createdAt: '2026-10-29T17:40:00.000Z',
  },
  {
    id: 'live-022',
    title: 'A New Personal Best',
    content:
      'Just finished a FACEIT match with 34 kills and my highest performance rating so far. More importantly, we won because everyone stayed focused during the difficult rounds. Definitely one of those gaming sessions I will remember for a while.',
    author: alex,
    createdAt: '2026-10-29T17:45:00.000Z',
  },
];
