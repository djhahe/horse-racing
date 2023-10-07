import { useEffect, useState } from 'react';
import { Horse } from './Horse';

export const RacingLine = ({ isRacing, raceTime = 10000 }: { isRacing: boolean; raceTime: number }) => {
  const [horsePosition, setHorsePosition] = useState(4);

  useEffect(() => {
    if (isRacing) {
      const interval = setInterval(() => {
        // random speed
        // after racetime the horse position will be the same

        const speed = Math.random();

        setHorsePosition((prev) => {
          const nextPos = prev + speed;
          if (nextPos > 100) {
            return 100;
          } else {
            return nextPos;
          }
        });
      }, 1000);
      if (horsePosition === 100) {
        clearInterval(interval);
      }
    }
  }, [isRacing, horsePosition]);

  return (
    <div className="w-full bg-green-700 h-10 z-0 flex items-center">
      <div className="actual-race w-11/12 h-full flex items-center relative">
        <Horse styles={{ left: `${horsePosition}%` }} />
      </div>
    </div>
  );
};
