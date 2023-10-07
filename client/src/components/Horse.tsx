import { CSSProperties } from 'react';
import ghost from '../assets/ghost.png';

export const Horse = ({ styles }: { styles?: CSSProperties }) => {
  return (
    <div className="absolute w-10 h-10 z-20" style={styles}>
      <img src={ghost} alt="ghost" className="w-10 h-10" />
    </div>
  );
};
