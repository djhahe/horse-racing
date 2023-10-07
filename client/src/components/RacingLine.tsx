import { useEffect, useRef, useState } from 'react';
import { Horse } from './Horse';

export const RacingLine = ({
  isRacing,
  onFinished,
  horseId,
  result,
  currentPosition,
  onMove,
}: {
  horseId: number;
  isRacing: boolean;
  raceTime: number;
  onFinished: (horseId: number) => void;
  result?: number;
  currentPosition: number;
  onMove: (id: number, distance: number) => void;
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
        let speed: number = Math.random() / 4;
        if (result && currentPosition > result) {
          speed = speed * 10;
        } else
          setHorsePosition((prev) => {
            const nextPos = prev + speed;
            if (nextPos > 100) {
              onMove(horseId, 100);
              return 100;
            } else {
              onMove(horseId, nextPos);
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
