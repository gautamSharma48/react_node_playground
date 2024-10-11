import React, { useEffect, useState } from "react";


const maxValue = 128.0;
const NoiseMeter = () => {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [max_noise_level, setMaxNoiseLevel] = useState(1);
  const [analyser, setAnalyser] = useState(null);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);

      source.connect(analyserNode);
      // analyserNode.fftSize = 1024;
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.fftSize = 512;
      analyserNode.minDecibels = -90;
      analyserNode.maxDecibels = -10;
      analyserNode.smoothingTimeConstant = 0.4;
      // analyserNode.smoothingTimeConstant = 0.4;

    //   setAudioStream(stream);
    //   setAudioContext(context);
      setAnalyser(analyserNode);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };
  useEffect(() => {
    if (true) {
      startMicrophone();
    } else {
    //   stopMicrophone();
    }

    return () => {
    //   stopMicrophone();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (analyser ) {
      interval = setInterval(() => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        const normalizedLevel = (average / maxValue) * 10;
        // const norm = average / 2.56;
        if (normalizedLevel >= max_noise_level) {
          // console.log(average,normalizedLevel,norm,"-=norm")
          // console.log(normalizedLevel,"normalizedLevel",norm);
        //   playSound();
        }

        setNoiseLevel(normalizedLevel);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [analyser, max_noise_level]);

  return (
    <GaugeMeter
      value={noiseLevel}
      height={600}
      width={600}
      max_value={max_noise_level}
    />
  );
};

const GaugeMeter = ({ value, width, height, max_value }) => {
  const normalizeValue = (value) => {
    return Math.max(0, Math.min(10, value)); // Ensures value is between 0 and 10
  };

  const calculateRotation = (value) => {
    // Converts value to an angle between -90 (min) and 90 (max) degrees
    console.log(Math.min(Math.max((value / 5) * 180 - 90, -90), 90));
    return Math.min(Math.max((value / 5) * 180 - 90, -90), 90);
    return (value / 5) * 180 - 90;
    // return -90 + (value / 10) * 180;
    // return Math.max(-90, Math.min(90, (value / 5) * 180 - 90));
    // console.log((value / 5) * 180 - 90)

  };

  const normalizedValue = normalizeValue(value);
  const rotation = calculateRotation(normalizedValue);

  return (
    <svg width={width} height={height} viewBox="0 0 100 30">
      <path
        d="M 10 40 A 40 40 0 0 1 90 40"
        fill="none"
        stroke="#1eaec7"
        strokeWidth="15"
      />
      <path
        d="M 10 40 A 40 40 0 0 1 90 40"
        fill="none"
        stroke={max_value && value > max_value ? "red" : "#00d6d3"}
        strokeWidth="15"
        strokeDasharray="251"
        strokeDashoffset={251 * (1 - normalizedValue / 10)}
      />
      <polygon
        points="50,40 48,10 50,5 52,10"
        fill="#020b52"
        transform={`rotate(${rotation} 50 40)`}
      />
      {/* Rounded bottom */}
      {/* <line x1="50" y1="40" x2="50" y2="20" transform={`rotate(${rotation} 50 40)`} stroke="#fff" strokeWidth="3" strokeLinecap="round" /> */}
      {/* Sharp top */}
      {/* <line x1="50" y1="20" x2="50" y2="5" transform={`rotate(${rotation} 50 40)`} stroke="#fff" strokeWidth="3" strokeLinecap="butt" /> */}
    </svg>
  );
};

export default NoiseMeter;
