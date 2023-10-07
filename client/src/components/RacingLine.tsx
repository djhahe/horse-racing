import { useEffect, useRef, useState } from 'react';
import { Horse } from './Horse';

export const RacingLine = ({
  isRacing,
  onFinished,
  horseId,
}: {
  horseId: number;
  isRacing: boolean;
  raceTime: number;
  onFinished: (horseId: number) => void;
}) => {
  const [horsePosition, setHorsePosition] = useState(0);
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (horsePosition === 100) {
      onFinished(horseId);
      if (interval.current) {
        clearInterval(interval.current);
      }
    }
  }, [horsePosition, horseId, onFinished]);

  useEffect(() => {
    if (isRacing) {
      interval.current = setInterval(() => {
        // random speed
        // after racetime the horse position will be the same

        const speed = Math.random() * 10;

        setHorsePosition((prev) => {
          const nextPos = prev + speed;
          if (nextPos > 100) {
            return 100;
          } else {
            return nextPos;
          }
        });
      }, 100);
    } else {
      setHorsePosition(4);
    }
  }, [isRacing]);

  return (
    <div className="w-full bg-green-700 h-10 z-0 flex items-center">
      <div className="actual-race w-11/12 h-full flex items-center relative">
        <div className="ml-2">{horseId + 1}</div>
        <Horse styles={{ left: `${horsePosition}%` }} />
      </div>
    </div>
  );
};
