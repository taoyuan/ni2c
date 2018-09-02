import {EventEmitter} from "events";
import {arrnum, bulkit, fromCallback, sleep, tick} from "./utils";
import repl = require('repl');

const wire = require('bindings')('i2c.node');
const debug = require('debug')('i2c');

const READ_CHUNK_SIZE = 32;
const WRITE_CHUNK_SIZE = 16;

export class I2C extends EventEmitter {

  history: any = [];

  protected address: number;
  protected cbytes: number;

  protected opened: boolean;
  protected opening: boolean;

  constructor(address: number, opts?: { busnum?: number, cbytes?: number, autoOpen?: boolean, debug?: boolean }) {
    super();
    opts = opts || {};
    const {cbytes = 1, busnum = 1, autoOpen = true, debug = false} = opts;

    this.address = address;
    this.cbytes = cbytes;

    if (debug) {
      repl.start({
        prompt: 'i2c > '
      }).context.wire = this;
      process.stdin.emit('data', '');
    }

    this.on('data', data => this.history.push(data));
    this.on('error', err => console.log(`Error: ${err}`));

    if (autoOpen) {
      this.open(busnum);
    }
  }

  get isOpen() {
    return this.opened;
  }

  setAddress(address: number) {
    wire.setAddress(address);
    this.address = address;
  }

  sureAddress() {
    this.setAddress(this.address);
  }

  async scan(): Promise<number[]> {
    const data = await fromCallback(cb => wire.scan(cb));
    return data.filter(num => num > 0);
  }

  async open(busnum: number) {
    if (this.opened) {
      throw new Error('Port is already open');
    }

    if (this.opening) {
      throw new Error('Port is opening');
    }

    this.opening = true;

    const device = `/dev/i2c-${busnum}`;
    debug('opening', `path: ${device}`);

    await fromCallback(cb => wire.open(device, cb));
    this.opening = false;
    this.opened = true;
  }

  close() {
    return wire.close();
  }

  async write(data: Buffer | any[] | string) {
    this.sureAddress();

    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(<any[]>data);
    }

    const answer = await fromCallback(cb => wire.write(data, cb));
    await tick();
    return answer;
  }

  async writeByte(byte: number) {
    this.sureAddress();

    const answer = await fromCallback(cb => wire.writeByte(byte, cb));
    await tick();
    return answer;
  }

  async writeBytes(cmd: number, data: Buffer | any[] | string) {
    this.sureAddress();

    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(<any[]>data);
    }

    await bulkit(data, WRITE_CHUNK_SIZE, async (buf: Buffer, length: number, position: number) => {
      if (this.cbytes === 1) {
        await fromCallback(cb => wire.writeBlock(cmd + position, buf, cb));
      } else {
        const b = Buffer.allocUnsafe(this.cbytes + length);
        arrnum(cmd + position, this.cbytes, b);
        buf.copy(b, this.cbytes);
        await this.write(b);
      }

      await sleep(10);
    });
  }

  async read(len: number) {
    this.sureAddress();

    const answer = await fromCallback(cb => wire.read(len, cb));
    await tick();
    return answer;
  }

  async readByte() {
    this.sureAddress();

    const answer = await fromCallback(cb => wire.readByte(cb));
    await tick();
    return answer;
  }

  async readByteData(position: number) {
    this.sureAddress();

    const answer = await fromCallback(cb => wire.readByteData(position, cb));
    await tick();
    return answer;
  }

  async readBytes(cmd: number, len: number) {
    this.sureAddress();

    if (this.cbytes === 1) {
      const {buffer} = await bulkit(new Buffer(len), READ_CHUNK_SIZE, async (buf: Buffer, length: number, position: number) => {
        const answer = <Buffer> await fromCallback(cb => wire.readBlock(cmd + position, length, null, cb));
        answer.copy(buf);
        await sleep(10);
      });
      return buffer;
    } else {
      const cmds = arrnum(cmd, this.cbytes);
      await this.write(cmds);
      return await this.read(len);
    }
  }

  stream(cmd: number, length: number, delay: number = 100) {
    if (this.cbytes > 1) {
      throw new Error('stream is not supported cbytes more than 1. current cbytes is ' + this.cbytes);
    }

    this.sureAddress();

    return wire.readBlock(cmd, length, delay, (err, data) => {
      if (!err) {
        return this.emit('error', err);
      }
      this.emit('data', {
        data,
        cmd,
        length,
        address: this.address,
        timestamp: Date.now(),
      })
    });
  }
}
