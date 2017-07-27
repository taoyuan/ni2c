const _ = require('underscore');
const { EventEmitter } = require('events');

const wire = require('../build/Release/i2c');

const tick = setImmediate || process.nextTick;

class i2c extends EventEmitter {
    constructor(address, { debug = false, device = '/dev/i2c-1' }, callback) {
        super();

        this.history = [];

        this.address = address;

        if (debug) {
            require('repl').start({
                prompt: 'i2c > '
            }).context.wire = this;

            process.stdin.emit('data', ''); // trigger repl
        }

        this.on('data', data => this.history.push(data));
        this.on('error', err => console.log(`Error: ${err}`));

        this.open(device, (err) => {
            if (err == null) {
                this.setAddress(this.address);
            }

            if (callback) {
                callback(err);
            }
        });
    }

    scan(callback) {
        return wire.scan((err, data) => tick(() => callback(err, _.filter(data, num => num >= 0))));
    }

    setAddress(address) {
        wire.setAddress(address);

        this.address = address;
    }

    open(device, callback) {
        return wire.open(device, err => tick(() => callback(err)));
    }

    close() {
        return wire.close();
    }

    write(buf, callback) {
        this.setAddress(this.address);

        if (!Buffer.isBuffer(buf)) {
            buf = new Buffer(buf);
        }

        return wire.write(buf, err => tick(() => callback(err)));
    }

    writeByte(byte, callback) {
        this.setAddress(this.address);

        return wire.writeByte(byte, err => tick(() => callback(err)));
    }

    writeBytes(cmd, buf, callback) {
        this.setAddress(this.address);

        if (!Buffer.isBuffer(buf)) {
            buf = new Buffer(buf);
        }

        return wire.writeBlock(cmd, buf, err => tick(() => callback(err)));
    }

    read(len, callback) {
        this.setAddress(this.address);

        return wire.read(len, (err, data) => tick(() => callback(err, data)));
    }

    readByte(callback) {
        this.setAddress(this.address);

        return wire.readByte((err, data) => tick(() => callback(err, data)));
    }

    readByteData(position, callback) {
        this.setAddress(this.address);

        return wire.readByteData(position, (err, data) => tick(() => callback(err, data)));
    }

    readBytes(cmd, len, callback) {
        this.setAddress(this.address);

        return wire.readBlock(cmd, len, null, (err, actualBuffer) => tick(() => callback(err, actualBuffer)));
    }

    stream(cmd, len, delay = 100) {
        this.setAddress(this.address);

        return wire.readBlock(cmd, len, delay, (err, data) => {
            if (err != null) {
                return this.emit('error', err);
            }

            return this.emit('data', {
                data,
                cmd,
                length: len,
                address: this.address,
                timestamp: Date.now()
            });
        });
    }
}

module.exports = i2c;
