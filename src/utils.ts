export function fromCallback(fn: (cb) => void): Promise<any> {
  return new Promise(function (resolve, reject) {
    fn(function (err, ...args) {
      if (err)
        return reject(err);
      args.length > 1 ? resolve(args) : resolve(args[0]);
    });
  })
}
