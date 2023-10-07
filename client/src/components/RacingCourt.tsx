import { RacingLine } from './RacingLine';

export const RacingCourt = ({ isRacing, raceTime }: { isRacing: boolean; raceTime: number }) => {
  return (
    <div className="bg-green-400 w-[100vw] h-[50vh] mt-10 flex flex-col justify-around relative">
      <div className="start-line absolute h-full w-5 z-10 left-20 bg-red-200"></div>
      {new Array(4).fill(undefined).map((_, index) => {
        return <RacingLine key={index} isRacing={isRacing} raceTime={raceTime} />;
      })}

      <div className="end-line absolute h-full w-3 z-10 right-[9%] bg-white"></div>
    </div>
  );
};
