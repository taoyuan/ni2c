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

export interface BulkResult {
  count: number;
  buffer: Buffer;
}

export interface RW {
  (buf: Buffer, length: number, position: number): Promise<any>;
}

export async function bulkrw(buffer: Buffer, fn: RW): Promise<BulkResult>;
export async function bulkrw(buffer: Buffer, chunkSize: number, fn: RW): Promise<BulkResult>;
export async function bulkrw(buffer: Buffer, chunkSizeOrFn: number | RW, fn?: RW): Promise<BulkResult> {
  let chunkSize: number = buffer.length;
  if (typeof chunkSizeOrFn === 'function') {
    fn = chunkSizeOrFn;
  } else {
    chunkSize = chunkSizeOrFn;
  }

  if (!fn) {
    return {count: 0, buffer: ZERO_BUF};
  }

  if (buffer.length <= chunkSize) {
    return fn(buffer, buffer.length, 0);
  }

  let i = 0;

  while (i < buffer.length) {
    const buf = buffer.slice(i, i + chunkSize);
    await fn(buf, chunkSize, i);
    i += chunkSize;
  }

  return {count: buffer.length, buffer};
}
