'use strict';

const hex = require('hex');
const {I2C} = require("../lib");

(async () => {
  const i2c = new I2C(0x50, {cbytes: 2});
  const buf = Buffer.alloc(512);
  buf.fill(0xFF);

  await i2c.writeBytes(0x00, buf);

  await i2c.writeBytes(0x00,
    'As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications. In the following "hello world" example, many connections can be handled concurrently. Upon each connection the callback is fired, but if there is no work to be done, Node will sleep.');
  const data = await i2c.readBytes(0x0000, 512);
  hex(data);

  i2c.close();
})();

