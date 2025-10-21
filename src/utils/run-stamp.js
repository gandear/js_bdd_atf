// src/utils/run-stamp.js
export function getRunStamp() {
  const envDate = process.env.RUN_DATE;
  const envTime = process.env.RUN_TIME;

  if (envDate && envTime) {
    return { RUN_DATE: envDate, RUN_TIME: envTime };
  }

  const now = new Date();
  const RUN_DATE = now.toISOString().slice(0, 10);
  const RUN_TIME = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  
  return { RUN_DATE, RUN_TIME };
}

export default getRunStamp;