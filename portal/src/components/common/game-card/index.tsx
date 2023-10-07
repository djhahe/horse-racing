import React from 'react';

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PathsEnum } from '@/enums/paths';

type Props = {
  name: string;
  slug: string;
  isPlay?: boolean;
  image?: string;
};

export const GameCard = ({ name, slug, isPlay, image }: Props) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(PathsEnum.GAME_DETAIL.replace(':id', slug));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="min-w-full p-2 text-2xl font-bold text-center text-transparent rounded bg-clip-text caret-pink-600 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lime-200 via-blue-500 to-orange-200">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <img src={image} alt={name} className="h-[400px] rounded-sm" />
      </CardContent>
      <CardFooter className="flex justify-center">
        {isPlay && <Button onClick={handleOnClick}>Play</Button>}
      </CardFooter>
    </Card>
  );
};
