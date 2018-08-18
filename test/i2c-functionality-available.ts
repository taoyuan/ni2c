'use strict';

import {I2C} from "../src";

(async () => {
  const i2c1 = await I2C.open(1);
  const i2cfuncs = await i2c1.i2cFuncs();
  const platform = i2cfuncs.smbusQuick ? 'Raspberry Pi?' : 'BeagleBone?';

  await i2c1.close();

  console.log('ok - i2c-functionality-available - ' + platform);
})();


