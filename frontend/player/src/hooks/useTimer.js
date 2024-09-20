import { useState, useEffect, useRef } from "react";

const useTimer = (initialTime, onTimeUp) => {
  const [timer, setTimer] = useState(initialTime);
  const [splitTime, setSplitTime] = useState(initialTime);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        } else if (prev < 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [initialTime, onTimeUp]);

  const recordSplitTime = () => {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTimeRef.current) / 1000;
    setSplitTime(elapsedTime.toFixed(2));
  };

  return { timer, setTimer, splitTime, recordSplitTime };
};

export default useTimer;
