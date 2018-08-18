import {I2cBus, I2cBusFuncs, open} from "i2c-bus";
import {fromCallback} from "./utils";

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

  async i2cRead(address: number, length: number, buffer: Buffer): Promise<[number, Buffer]> {
    return fromCallback(cb => this.bus.i2cRead(address, length, buffer, cb));
  }

  async i2cWrite(address: number, length: number, buffer: Buffer): Promise<[number, Buffer]> {
    return fromCallback(cb => this.bus.i2cWrite(address, length, buffer, cb));
  }

  readByte(address: number, command: number): Promise<number> {
    return fromCallback(cb => this.bus.readByte(address, command, cb));
  }

  readWord(address: number, command: number): Promise<number> {
    return fromCallback(cb => this.bus.readWord(address, command, cb));
  }

  readI2cBlock(address: number, command: number, length: number, buffer: Buffer) {
    return fromCallback(cb => this.bus.readI2cBlock(address, command, length, buffer, cb));
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

  writeI2cBlock(address: number, command: number, length: number, buffer: Buffer) {
    return fromCallback(cb => this.bus.writeI2cBlock(address, command, length, buffer, cb));
  }
}
