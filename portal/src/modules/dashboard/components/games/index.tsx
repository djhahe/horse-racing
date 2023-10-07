import React from 'react';

import { GameCard } from '@/components/common/game-card';
import { GAMES } from '@/configs/game-config';

export const Games = () => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-between">
      {GAMES.map((game) => (
        <GameCard name={game.name} slug={game.slug} key={game.slug} />
      ))}
    </div>
  );
};
