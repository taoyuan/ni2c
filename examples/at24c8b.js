const hex = require('hex');
const {I2C} = require("../lib");

(async () => {
  const i2c = new I2C(0x50);
  const buf = Buffer.alloc(512);
  buf.fill(0xFF);

  await i2c.writeBytes(0x00, buf);

  await i2c.writeBytes(0x00,
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  const data = await i2c.readBytes(0x00, Buffer.alloc(256));
  hex(data);

  i2c.close();
})();

