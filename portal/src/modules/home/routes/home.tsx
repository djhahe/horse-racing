import { Games } from '../components/games';
import { BaseLayout } from '@/layouts/base';

export const Home = () => {
  return (
    <BaseLayout>
      <div className="p-10">
        <Games />
      </div>
    </BaseLayout>
  );
};
