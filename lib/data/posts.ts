import { Author, Post } from '../types/post';
import { mockLivePosts } from './mockLivePosts';

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
    title: 'An Early Morning Run',
    author: maya,
    content:
      'Finally got outside for a morning run. The fresh air was worth the early alarm.',
    createdAt: '2026-10-28T07:15:00.000Z',
  },
  {
    id: 'post-002',
    title: 'The Comeback That Changed Everything',
    author: leo,
    content: `Last night's Counter-Strike 2 match was one of the most intense games I've played in months. We started terribly, losing almost every opening duel and struggling to communicate. By halftime, we were down 3–9, and everyone was getting frustrated.

Instead of giving up, we decided to change our approach. We slowed down our attacks, started using utility properly, and focused on playing together rather than chasing individual kills.

The turning point came when our last surviving teammate won an impossible 1v3 clutch. Suddenly, everyone was talking again, calling positions, sharing information, and actually enjoying the game.

We eventually won 13–11. It wasn't our cleanest performance, but it reminded me why I love competitive gaming. Sometimes teamwork and a positive attitude matter more than individual skill.`,
    createdAt: '2026-10-28T08:05:00.000Z',
  },
  {
    id: 'post-003',
    title: 'A Reminder to Take a Break',
    author: amara,
    content: 'A small reminder to take a break, stretch, and drink some water.',
    createdAt: '2026-10-28T08:42:00.000Z',
  },
  {
    id: 'post-004',
    title: 'The Road to FACEIT Level 10',
    author: maya,
    content: `After months of grinding ranked matches, I finally reached FACEIT Level 10! It's been a long journey filled with frustrating losses, unexpected winning streaks, and plenty of moments when I questioned whether I was actually improving.

The biggest difference came when I stopped obsessing over my rating and started reviewing my own gameplay. Watching recorded matches helped me identify positioning mistakes, poor decisions, and situations where I was taking unnecessary risks.

I also completely changed my practice routine. Instead of spending hours playing deathmatch, I started doing shorter, more focused sessions covering aim, movement, utility lineups, and communication.

Reaching Level 10 feels amazing, but I'm more proud of the improvement along the way. There's still so much to learn, and I'm excited to see how far I can push myself next season.`,
    createdAt: '2026-10-27T17:30:00.000Z',
  },
  {
    id: 'post-005',
    title: 'Our First Community Tournament',
    author: leo,
    content: `Our team participated in its first community Counter-Strike tournament this weekend. We went in with very modest expectations because we'd only been practising together for a few weeks, and some of us had never played in an organised competition.

The first match was a disaster. We lost several rounds because of basic communication mistakes, missed rotations, and poor coordination. Playing under pressure felt completely different from our normal matchmaking sessions.

Things improved significantly during the second match. We started trusting each other's calls, stopped making unnecessary solo plays, and managed to take a much more experienced team into overtime.

We didn't make it to the finals, but the experience was absolutely worth it. We've already identified several areas to work on and are planning another practice session next week. Looking forward to the next tournament!`,
    createdAt: '2026-10-27T12:20:00.000Z',
  },
  {
    id: 'post-006',
    title: 'Cooking with Music',
    author: amara,
    content:
      'The best part of cooking at home is having music on while everything simmers.',
    createdAt: '2026-10-27T19:10:00.000Z',
  },
  {
    id: 'post-007',
    title: 'An Unforgettable Book Ending',
    author: maya,
    content:
      'Finished the book I started last week. That ending is going to stay with me.',
    createdAt: '2026-10-26T20:45:00.000Z',
  },
  {
    id: 'post-008',
    title: 'A Fresh Start at My Desk',
    author: leo,
    content: 'A clear desk makes Monday feel a little more manageable.',
    createdAt: '2026-10-26T09:00:00.000Z',
  },
  {
    id: 'post-009',
    title: 'A Productive Afternoon at the Library',
    author: amara,
    content:
      'Found a quiet corner at the library and got through my whole reading list.',
    createdAt: '2026-10-25T15:35:00.000Z',
  },
  {
    id: 'post-010',
    title: 'A Detour to the Farmers Market',
    author: maya,
    content: 'Weekend walk turned into a detour through the farmers market.',
    createdAt: '2026-10-25T11:25:00.000Z',
  },
  {
    id: 'post-011',
    title: 'Pancakes for No Reason',
    author: leo,
    content: 'Made pancakes for breakfast. No occasion needed.',
    createdAt: '2026-10-24T09:12:00.000Z',
  },
  {
    id: 'post-012',
    title: 'The Joy of a Good Conversation',
    author: amara,
    content: 'A good conversation can make an ordinary afternoon feel special.',
    createdAt: '2026-10-24T16:50:00.000Z',
  },
  {
    id: 'post-013',
    title: 'Catching the Last Light',
    author: maya,
    content: 'Took the scenic route home and caught the last bit of sunset.',
    createdAt: '2026-10-23T18:22:00.000Z',
  },
  {
    id: 'post-014',
    title: 'Finally Organising My Photos',
    author: leo,
    content: 'Finally organized the photos on my phone. It only took a year.',
    createdAt: '2026-10-23T20:05:00.000Z',
  },
  {
    id: 'post-015',
    title: 'Trying a New Soup Recipe',
    author: amara,
    content:
      'Testing a new soup recipe tonight. The kitchen already smells amazing.',
    createdAt: '2026-10-22T17:40:00.000Z',
  },
  {
    id: 'post-016',
    title: 'A Morning Stretching Routine',
    author: maya,
    content:
      'Tried a short stretching routine before starting work. Keeping this habit.',
    createdAt: '2026-10-22T07:50:00.000Z',
  },
  {
    id: 'post-017',
    title: 'The Perfect Rainy Evening',
    author: leo,
    content: 'Rainy evening, warm tea, and absolutely no plans. Perfect.',
    createdAt: '2026-10-21T19:30:00.000Z',
  },
  {
    id: 'post-018',
    title: 'Fresh Flowers, Better Mood',
    author: amara,
    content: 'Picked up a few flowers for the table. Such a simple mood boost.',
    createdAt: '2026-10-21T14:15:00.000Z',
  },
  {
    id: 'post-019',
    title: 'A New Podcast Obsession',
    author: maya,
    content:
      'A friend shared a podcast recommendation, and now I have five new episodes queued.',
    createdAt: '2026-10-20T18:05:00.000Z',
  },
  {
    id: 'post-020',
    title: 'Taking a Proper Lunch Break',
    author: leo,
    content: 'Took a proper lunch break away from my screen. Highly recommend.',
    createdAt: '2026-10-20T12:45:00.000Z',
  },
  {
    id: 'post-021',
    title: 'Why I Took a Break from Gaming',
    author: amara,
    content: `I've realised that spending every evening playing competitive games isn't necessarily making me a better player. Recently, I found myself getting frustrated much more easily, making careless mistakes, and struggling to enjoy matches that I would normally love.

Last week, I decided to take a few days away from Counter-Strike. Instead of sitting at my desk after work, I went cycling, caught up with some friends, and finally finished a book that had been sitting on my shelf for months.

When I returned to gaming, the difference was surprisingly noticeable. My concentration was better, I felt more patient with teammates, and losing a round no longer seemed like the end of the world.

It's easy to forget that improvement requires recovery as well as practice. I'm going to start scheduling proper breaks and treating gaming as something I enjoy rather than another obligation.`,
    createdAt: '2026-10-19T16:18:00.000Z',
  },
  {
    id: 'post-022',
    title: 'Discovering a New Artist',
    author: maya,
    content:
      'Went to a small gallery opening and discovered a new favorite artist.',
    createdAt: '2026-10-19T20:10:00.000Z',
  },
  {
    id: 'post-023',
    title: 'Looking for Two CS2 Teammates',
    author: leo,
    content: `We're looking for two more players to join our Counter-Strike 2 team. We're a small group of friends who enjoy competitive matches and want to improve together without turning every evening into an overly serious training session.

Ideally, we're looking for players who are comfortable communicating in English, have a reasonable understanding of utility usage, and are willing to learn new strategies. You don't need incredible statistics or thousands of hours of experience.

We normally play three evenings a week and occasionally participate in community tournaments. Our main priorities are consistency, teamwork, and maintaining a friendly atmosphere, even when matches aren't going our way.

If you're interested, leave a comment with your preferred role and approximate FACEIT level. We're happy to play a few casual matches first to see whether everyone gets along. Good communication is more important to us than a perfect win rate.`,
    createdAt: '2026-10-18T10:35:00.000Z',
  },
  {
    id: 'post-024',
    title: 'Sunday Meal Prep',
    author: amara,
    content: 'Sunday meal prep is done, and future me is already grateful.',
    createdAt: '2026-10-18T17:25:00.000Z',
  },
  {
    id: 'post-025',
    title: 'Why Gaming Means More Than Winning',
    author: maya,
    content: `I've been playing video games for as long as I can remember, and it's incredible how much the experience has changed over the years. What started as a simple way to relax after school eventually became one of my favourite ways to connect with people.

Some of my closest friendships actually started in online matches. We've spent countless evenings competing together, laughing at ridiculous mistakes, celebrating unlikely victories, and occasionally arguing about whose fault that last round really was.

The technology has improved dramatically, with better graphics, faster matchmaking, and competitive platforms that bring players together from around the world. But the thing that keeps me coming back hasn't really changed.

For me, gaming has never been entirely about winning or climbing rankings. It's about shared experiences, memorable moments, and meeting people I probably wouldn't have encountered otherwise. That's what makes the gaming community special.`,
    createdAt: '2026-10-17T08:28:00.000Z',
  },
  {
    id: 'post-026',
    title: 'Learning a New Language',
    author: leo,
    content:
      'Started learning a few phrases in a new language. One day at a time.',
    createdAt: '2026-10-17T21:00:00.000Z',
  },
  {
    id: 'post-027',
    title: 'Catching Up with Family',
    author: amara,
    content: 'Made time for a long phone call with family tonight.',
    createdAt: '2026-10-16T19:42:00.000Z',
  },
  {
    id: 'post-028',
    title: 'Coffee After a Chilly Walk',
    author: maya,
    content: 'The first sip of coffee after a chilly walk really hit the spot.',
    createdAt: '2026-10-16T09:18:00.000Z',
  },
  {
    id: 'post-029',
    title: 'Fixing a Wobbly Chair',
    author: leo,
    content: 'Fixed the wobbly chair I kept ignoring. Small household victory.',
    createdAt: '2026-10-15T18:55:00.000Z',
  },
  {
    id: 'post-030',
    title: 'Rediscovering Old Ideas',
    author: amara,
    content:
      'Found an old notebook full of ideas I had completely forgotten about.',
    createdAt: '2026-10-15T13:05:00.000Z',
  },
  {
    id: 'post-031',
    title: 'Taking the Stairs',
    author: maya,
    content: 'Took the stairs today and somehow felt proud about it.',
    createdAt: '2026-10-14T11:10:00.000Z',
  },
  {
    id: 'post-032',
    title: 'A Playlist for a Friend',
    author: leo,
    content:
      'Made a tiny playlist for a friend who needed a lift. Music is a good gift.',
    createdAt: '2026-10-14T20:32:00.000Z',
  },
  {
    id: 'post-033',
    title: 'Drawing Without Expectations',
    author: amara,
    content:
      'Tried drawing for twenty minutes without worrying about getting it right.',
    createdAt: '2026-10-13T18:12:00.000Z',
  },
  {
    id: 'post-034',
    title: 'A Slow Afternoon with a Book',
    author: maya,
    content:
      'A sunny window seat and a good book made for a very slow afternoon.',
    createdAt: '2026-10-13T15:45:00.000Z',
  },
  {
    id: 'post-035',
    title: 'Homemade Granola for Dinner',
    author: leo,
    content: 'Made a batch of granola and immediately had a bowl for dinner.',
    createdAt: '2026-10-12T19:08:00.000Z',
  },
  {
    id: 'post-036',
    title: 'Finding a Hidden Park',
    author: amara,
    content: 'Walked a different route today and found a lovely little park.',
    createdAt: '2026-10-12T10:22:00.000Z',
  },
  {
    id: 'post-037',
    title: 'Finishing a Long-Term Project',
    author: maya,
    content:
      'Wrapped up a project I have been chipping away at for weeks. On to the next.',
    createdAt: '2026-10-11T16:40:00.000Z',
  },
  {
    id: 'post-038',
    title: 'Pasta and a Familiar Film',
    author: leo,
    content:
      'Tonight’s plan: homemade pasta and a movie I have seen a dozen times.',
    createdAt: '2026-10-11T18:30:00.000Z',
  },
  {
    id: 'post-039',
    title: 'An Evening Away from My Phone',
    author: amara,
    content: 'Put my phone away for the evening and finished a puzzle instead.',
    createdAt: '2026-10-10T21:15:00.000Z',
  },
  {
    id: 'post-040',
    title: 'A Slow Start to the Weekend',
    author: maya,
    content: 'A good week deserves a slow start to the weekend.',
    createdAt: '2026-10-10T09:05:00.000Z',
  },
];

export function getPostById(id: string): Post | undefined {
  return (
    posts.find((post) => post.id === id) ??
    mockLivePosts.find((post) => post.id === id)
  );
}
