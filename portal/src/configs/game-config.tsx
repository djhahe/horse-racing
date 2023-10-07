import { GhostRacingGame } from 'ghost-racing-game';

import HorseRacingImg from '@/assets/images/horse-racing.jpeg';

export const GAMES = [
  {
    slug: 'hores-racing',
    name: 'Horse Racing',
    description: 'Horse Racing Game',
    children: <GhostRacingGame />,
    image: HorseRacingImg,
  },
  // {
  //   slug: 'hores-racing',
  //   name: 'Horse Racing',
  //   description: 'Horse Racing Game',
  //   children: <div>Game</div>,
  //   image: HorseRacingImg,
  // },
];
