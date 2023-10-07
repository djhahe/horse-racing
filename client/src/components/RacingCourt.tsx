import { RacingLine } from './RacingLine';
import { THorse } from '../App';
import { useCallback } from 'react';

export const RacingCourt = ({
  isRacing,
  raceTime,
  horses,
  onFinished,
}: {
  isRacing: boolean;
  raceTime: number;
  horses: THorse[];
  onFinished: (id: number) => void;
}) => {
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
        return <RacingLine key={id} isRacing={isRacing} raceTime={raceTime} onFinished={onRaceFinished} horseId={id} />;
      })}

      <div className="end-line absolute h-full w-3 z-10 right-[9%] bg-white"></div>
    </div>
  );
};
