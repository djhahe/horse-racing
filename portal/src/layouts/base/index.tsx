import { PropsWithChildren } from 'react';

import { Header } from './header';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="flex flex-col items-center justify-center w-full">
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
};
