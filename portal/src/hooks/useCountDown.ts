import { useEffect, useState } from 'react';

type Params = {
  targetDate: string | number | Date;
  enabled: boolean;
};

export const useCountdown = ({ targetDate, enabled }: Params) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    targetDate ? countDownDate - new Date().getTime() : 0
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return {
    ...getReturnValues(countDown),
    isRunning: countDown > 0 && enabled,
  };
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
