const formatTime = (sec: number) => {
  return (sec - (sec %= 60)) / 60 + (9 < sec ? ":" : ":0") + Math.round(sec);
};

export default formatTime;
