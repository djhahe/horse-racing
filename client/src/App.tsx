import { useState } from 'react';
import './App.css';
import { RacingCourt } from './components/RacingCourt';

const raceTime = 5000;

function App() {
  const [isRacing, setIsRacing] = useState(false);

  const onStart = () => {
    if (!isRacing) {
      setIsRacing(true);
      // stop after raceTime
      setTimeout(() => {
        setIsRacing(false);
      }, raceTime);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold">Horse Racing</div>
      <div className="px-4 cursor-pointer mt-2 rounded-lg bg-red-400" onClick={onStart}>
        {isRacing ? 'Racing...' : 'Start'}
      </div>
      <RacingCourt isRacing={isRacing} raceTime={raceTime} />
    </div>
  );
}

export default App;
