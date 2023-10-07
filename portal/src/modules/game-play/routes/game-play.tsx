import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import 'ghost-racing-game/dist/index.css';

import { GAMES } from '@/configs/game-config';
import { BaseLayout } from '@/layouts/base';

export const GamePlay = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const foundGame = GAMES.find((game) => game.slug === id);

  return (
    <BaseLayout>
      {React.cloneElement(foundGame?.children as React.ReactElement, {
        queryClient,
      })}
    </BaseLayout>
  );
};
