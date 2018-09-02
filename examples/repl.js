'use strict';

const hex = require('hex');
const {I2C} = require("../lib");

(async () => {
  const i2c = new I2C(0x50, {debug: true});
})();

