import React from 'react';

import { useAccount } from '@casperdash/usewallet';

import { GameCard } from '@/components/common/game-card';
import { GAMES } from '@/configs/game-config';

export const Games = () => {
  const { publicKey } = useAccount();

  return (
    <div className="relative flex flex-col h-screen items-center justify-between gap-10">
      {GAMES.map((game) => (
        <GameCard
          name={game.name}
          slug={game.slug}
          key={game.slug}
          isPlay={!!publicKey}
          image={game.image}
        />
      ))}
    </div>
  );
};
