import { createBrowserRouter } from 'react-router-dom';

import { PathsEnum } from '@/enums/paths';
import { GamePlay } from '@/modules/game-play/routes/game-play';
import { Home } from '@/modules/home/routes/home';

export const browserRouter = createBrowserRouter([
  {
    path: PathsEnum.HOME,
    element: <Home />,
  },
  {
    path: PathsEnum.GAME_DETAIL,
    element: <GamePlay />,
  },
]);
