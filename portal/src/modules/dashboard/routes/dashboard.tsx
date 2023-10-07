import { Games } from '../components/games';

export const Dashboard = () => {
  return (
    <div className="bg relative flex flex-col h-screen items-center justify-between">
      <Games />
    </div>
  );
};
