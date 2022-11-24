export function chunkEvery<T = any>(
  arr: T[],
  count: number,
  step?: number | undefined,
  leftover?: T[] | string
): Array<Array<T>> {
  if (!arr.length) {
    return [];
  }

  step = step || count;

  const retArr = [];
  for (let i = 0; i < arr.length; i += step) {
    retArr.push(arr.slice(i, i + count));
  }

  const lastIndex = retArr.length - 1;

  if (leftover === 'discard' && retArr[lastIndex].length < count) {
    return retArr.slice(0, lastIndex);
  }

  if (Array.isArray(leftover) && leftover?.length) {
    retArr[lastIndex] = retArr[lastIndex].concat(leftover).slice(0, count);
  }

  return retArr;
}

export function terminate(msg: string, reason = 1): never {
  console.error(msg);
  process.exit(reason);
}

export function delay(duration: number) {
  return new Promise(r => setTimeout(r, duration));
}
