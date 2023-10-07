import { RacingLine } from './RacingLine';
import { THorse } from '../App';
import { useCallback, useState } from 'react';

export const RacingCourt = ({
  isRacing,
  raceTime,
  horses,
  onFinished,
  deployResult,
}: {
  isRacing: boolean;
  raceTime: number;
  horses: THorse[];
  onFinished: (id: number) => void;
  deployResult: { id: number; position: number }[];
}) => {
  const [currentHorsePosition, setCurrentHorsesPosition] = useState<{ id: number; distance: number }[]>([]);

  const onMove = useCallback((id: number, distance: number) => {
    setCurrentHorsesPosition((prev) => {
      const horse = prev.find((h) => h.id === id);
      if (horse) {
        return prev.map((h) => {
          if (h.id === id) {
            return { ...h, distance: distance };
          } else {
            return h;
          }
        });
      } else {
        return [...prev, { id, distance }];
      }
    });
  }, []);

  const onRaceFinished = useCallback(
    (id: number) => {
      onFinished(id);
    },
    [onFinished],
  );
  return (
    <div className="bg-green-400 w-[100vw] h-[50vh] mt-10 flex flex-col justify-around relative">
      <div className="start-line absolute h-full w-5 z-10 left-24 bg-red-200"></div>
      {horses.map(({ id }) => {
        const position = currentHorsePosition.findIndex((h) => h.id === id);
        return (
          <RacingLine
            key={id}
            isRacing={isRacing}
            raceTime={raceTime}
            onFinished={onRaceFinished}
            horseId={id}
            result={deployResult.find((rs) => rs.id === id)?.position}
            currentPosition={position}
            onMove={onMove}
          />
        );
      })}

      <div className="end-line absolute h-full w-3 z-10 right-[9%] bg-white"></div>
    </div>
  );
};
