import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { RacingCourt } from './components/RacingCourt';
import { Modal, Button } from 'antd';

const raceTime = 5000;
const horses: THorse[] = [
  { id: 0, name: 'Ghost 1' },
  { id: 1, name: 'Ghost 2' },
  { id: 2, name: 'Ghost 3' },
  { id: 3, name: 'Ghost 4' },
];

export type THorse = { id: number; name: string };

function App() {
  const [isRacing, setIsRacing] = useState(false);
  const [result, setResult] = useState<{ id: number; position: number }[]>([]);
  const [selectedHorse, setSelectedHorse] = useState<number>(0);
  const [selectedStake, setSelectedStake] = useState<number>(100);
  const [status, setStatus] = useState<'win' | 'lose' | undefined>();

  useEffect(() => {
    if (result.length === horses.length) {
      setIsRacing(false);
      setStatus(result[0].id === selectedHorse ? 'win' : 'lose');
    }
  }, [result, selectedHorse]);

  const onFinished = useCallback((horseId: number) => {
    setResult((prev) => {
      return [...prev, { id: horseId, position: prev.length + 1 }];
    });
  }, []);

  const onStart = () => {
    if (!isRacing) {
      setResult([]);
      setIsRacing(true);
    }
  };

  const onSelectHorse = (e: any) => {
    setSelectedHorse(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold">Ghost Racing</div>
      <div className="flex flex-col justify-center items-center gap-4 mt-4">
        <div>Choose your racer</div>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <div>Ghost:</div>
            <select className="w-20" onChange={onSelectHorse} value={selectedHorse}>
              {horses.map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex gap-2">
            <div>Stake:</div>
            <input
              className="w-20"
              value={selectedStake}
              type="number"
              onChange={(e) => setSelectedStake(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="px-4 cursor-pointer mt-2 rounded-lg bg-red-400" onClick={onStart}>
        {isRacing ? 'Racing...' : 'Start'}
      </div>
      <div className="flex justify-start pl-10 w-full mt-4">
        <div className="pr-10 pl-2 w-fit rounded-lg border border-solid border-white">
          <div className="font-bold">Result</div>
          {horses.map(({ id, name }) => {
            const horseResult = result.find((res) => res.id === id);
            return (
              <div key={id}>
                {name} - {horseResult?.position}
              </div>
            );
          })}
        </div>
      </div>
      <RacingCourt isRacing={isRacing} raceTime={raceTime} horses={horses} onFinished={onFinished} />
      <Modal
        open={status !== undefined}
        footer={
          <div>
            <Button type="primary" className="bg-blue-400" onClick={() => setStatus(undefined)}>
              Ok
            </Button>
          </div>
        }
        className="bg-black"
      >
        {status === 'win' ? (
          <div>
            <div className="font-bold text-2xl">Congratulation!</div>
            <div>
              You won {selectedStake * 3} on {horses[selectedHorse].name}
            </div>
          </div>
        ) : (
          <div>
            <div className="font-bold text-2xl">Sorry!</div>
            <div>Better luck next time!</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;