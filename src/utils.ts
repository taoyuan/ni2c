export const ZERO_BUF = Buffer.allocUnsafe(0);

export interface FromCallbackOptions {
  multiArgs?: boolean;
}

export function fromCallback(fn: (cb) => void, opts?: FromCallbackOptions): Promise<any> {
  return new Promise(function (resolve, reject) {
    fn(function (err, ...results) {
      if (err) return reject(err);
      if (opts && opts.multiArgs) {
        resolve(results);
      } else {
        resolve(results[0]);
      }
    });
  });
}

export function sleep(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const _tick = process.nextTick || setImmediate;
export function tick(): Promise<void> {
  return new Promise(_tick)
}

export function arrnum(num: number, bytes: number, buf?: Buffer | any[]) {
  buf = buf || [];
  for (let i = 0; i < bytes; i++) {
    buf[i] = (num >> ((bytes - i - 1)) * 8) & 0xFF;
  }
  return buf;
}

export interface Iterator {
  (buf: Buffer, length: number, position: number): Promise<any>;
}

export async function bulkit(buffer: Buffer, fn: Iterator): Promise<{count: number, buffer: Buffer}>;
export async function bulkit(buffer: Buffer, chunkSize: number, fn: Iterator): Promise<{count: number, buffer: Buffer}>;
export async function bulkit(buffer: Buffer, chunkSizeOrFn: number | Iterator, fn?: Iterator): Promise<{count: number, buffer: Buffer}> {
  let chunkSize: number = buffer.length;
  if (typeof chunkSizeOrFn === 'function') {
    fn = chunkSizeOrFn;
  } else {
    chunkSize = chunkSizeOrFn;
  }

  if (!fn) {
    return {count: 0, buffer: Buffer.from(ZERO_BUF)};
  }

  if (buffer.length <= chunkSize) {
    return fn(buffer, buffer.length, 0);
  }

  let i = 0;

  while (i < buffer.length) {
    const buf = buffer.slice(i, i + chunkSize);
    await fn(buf, buf.length, i);
    i += chunkSize;
  }

  return {count: buffer.length, buffer};
}

