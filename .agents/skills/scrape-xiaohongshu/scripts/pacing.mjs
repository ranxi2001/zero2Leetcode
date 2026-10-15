// One serial budget for actions that can load remote content. DOM reads are local.
export function createPacer(delay = 10000, { now = Date.now, sleep = ms => new Promise(r => setTimeout(r, ms)), log = console.log } = {}) {
  if (!Number.isInteger(delay) || delay < 5000) throw Error('delay 必须为 >= 5000 的整数');
  let next = 0, actions = 0, failures = 0;
  return {
    async before() {
      const wait = Math.max(0, next - now());
      if (wait) {
        log(`访问节流：等待 ${Math.ceil(wait / 1000)} 秒`);
        // Keep individual timers short, including longer failure cooldowns.
        for (let remaining = wait; remaining > 0; remaining -= 30000) await sleep(Math.min(remaining, 30000));
      }
      actions++;
      next = now() + Math.max(delay, actions % 10 === 0 ? 60000 : 0);
    },
    success() { failures = 0; },
    failure() {
      failures++;
      next = Math.max(next, now() + Math.min(300000, 30000 * 2 ** (failures - 1)));
      return failures >= 3;
    },
  };
}
