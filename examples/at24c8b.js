const hex = require('hex');
const {I2C} = require("../lib");

(async () => {
  const i2c = new I2C(0x50);

  await i2c.writeBytes(0x00, "hello world");
  const data = await i2c.readBytes(0x00, 256);
  hex(data);

  i2c.close();
})();

