
import LinearProgress from '@mui/material/LinearProgress';
import React, { useCallback, useEffect, useState } from "react";

const TimeProgressBar = ({ startTime = "12:00", endTime = "13:00" }) => {
  const [progress, setProgress] = useState(0);

  const progressHandler = useCallback(() => {
    const start = new Date();
    const end = new Date();
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);

    const currentTime = new Date();

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = currentTime.getTime() - start.getTime();

    if (elapsedDuration <= 0) {
      return 0;
    } else if (elapsedDuration >= totalDuration) {
      return 100;
    } else {
      return (elapsedDuration / totalDuration) * 100;
    }
  }, [startTime, endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progressHandler());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [progressHandler]);

  return (
    <LinearProgress
      className="msgSndLine"
      style={{ width: "70%", color: "green"}}
      variant="determinate"
      value={progress}
    />
  );
};

export default TimeProgressBar;
