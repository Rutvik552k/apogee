import { retryDelayForAttempt } from "./withTimeout.js";

export function retryProgressText(attempt, maxAttempts) {
  return `Download hiccup - retrying (attempt ${attempt + 1} of ${maxAttempts})...`;
}

export async function retryWithBackoff({
  maxAttempts,
  baseDelayMs,
  isTransient,
  onRetry,
  task,
}) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task(attempt);
    } catch (err) {
      if (!isTransient(err) || attempt >= maxAttempts) throw err;
      await onRetry?.(attempt, err);
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelayForAttempt(baseDelayMs, attempt)),
      );
    }
  }
}
