import {I2cBus, I2cBusFuncs, open} from "i2c-bus";
import {bulkrw, fromCallback} from "./utils";

export const RW_BLOCK_SIZE = 32;

export class I2C {

  static open(busnum: number = 1): Promise<I2C> {
    return new Promise((resolve, reject) => {
      const i2c = open(busnum, err => {
        if (err) {
          return reject(err);
        }
        resolve(new I2C(i2c));
      })
    });
  }

  protected constructor(protected bus: I2cBus) {
  }

  async close() {
    return fromCallback(cb => this.bus.close(cb));
  }

  async i2cFuncs(): Promise<I2cBusFuncs> {
    return fromCallback(cb => this.bus.i2cFuncs(cb));
  }

  async scan(): Promise<number> {
    return fromCallback(cb => this.bus.scan(cb));
  }

  async i2cRead(address: number, length: number, buffer: Buffer): Promise<{bytesRead: number, buffer: Buffer}> {
    const [bytesRead, buf] = await fromCallback(cb => this.bus.i2cRead(address, length, buffer, cb), {multiArgs: true});
    return {bytesRead, buffer: buf};
  }

  async i2cWrite(address: number, length: number, buffer: Buffer): Promise<{bytesWrite: number, buffer: Buffer}> {
    const [bytesWrite, buf] = await fromCallback(cb => this.bus.i2cWrite(address, length, buffer, cb), {multiArgs: true});
    return {bytesWrite, buffer: buf};
  }

  readByte(address: number, command: number): Promise<number> {
    return fromCallback(cb => this.bus.readByte(address, command, cb));
  }

  readWord(address: number, command: number): Promise<number> {
    return fromCallback(cb => this.bus.readWord(address, command, cb));
  }

  async readI2cBlock(address: number, command: number, length: number, buffer: Buffer): Promise<{bytesRead: number, buffer: Buffer}> {
    const {count, buffer: buf} = await bulkrw(buffer, RW_BLOCK_SIZE, async (buf, len, pos) => {
      return await fromCallback(cb => this.bus.readI2cBlock(address, command + pos, len, buf, cb));
    });

    return {bytesRead: count, buffer: buf};
  }

  receiveByte(address: number): Promise<number> {
    return fromCallback(cb => this.bus.receiveByte(address, cb));
  }

  sendByte(address: number, byte: number): Promise<void> {
    return fromCallback(cb => this.bus.sendByte(address, byte, cb));
  }

  writeByte(address: number, command: number, byte: number) {
    return fromCallback(cb => this.bus.writeByte(address, command, byte, cb));
  }

  writeWord(address: number, command: number, word: number) {
    return fromCallback(cb => this.bus.writeWord(address, command, word, cb));
  }

  writeQuick(address: number, command: number, bit: number) {
    return fromCallback(cb => this.bus.writeQuick(address, command, bit, cb));
  }

  async writeI2cBlock(address: number, command: number, length: number, buffer: Buffer): Promise<{bytesWrite: number, buffer: Buffer}> {
    const {count, buffer: buf} = await bulkrw(buffer, RW_BLOCK_SIZE, async (buf, len, pos) => {
      return await fromCallback(cb => this.bus.writeI2cBlock(address, command + pos, len, buf, cb));
    });

    return {bytesWrite: count, buffer: buf};
  }
}
