/**
 * Converts milliseconds to string of format 'mm:ss'
 *
 * @param {number} ms - milliseconds
 * @returns {string} - string of format 'mm:ss'
 */
const msToMin = (ms: number): string => {
  const minutes: number = Math.floor(ms / 60000);
  const seconds: string = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
};

export default msToMin;
