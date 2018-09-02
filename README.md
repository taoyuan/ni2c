# ni2c

> Bindings for i2c-dev. Plays well with Raspberry Pi and Beaglebone.

## Install

````bash
$ npm install ni2c
````

## Usage

```js

const i2c = require('ni2c');
const address = 0x50;
const wire = new i2c(address, {busnum: 1}); // point to your i2c address, debug provides REPL interface

(async () => {
  
  await wire.scan();
  await wire.writeByte(byte);
  
  await wire.writeBytes(command, [byte0, byte1]);
  
  await wire.readByte() // result is single byte })
  
  await wire.readBytes(command, length);
  
  wire.on('data', function(data) {
    // result for continuous stream contains data buffer, address, length, timestamp
  });
  
  wire.stream(command, length, delay); // continuous stream, delay in ms
  
  // plain read/write
 
  await wire.write([byte0, byte1]);
  
  await wire.read(length);

})();

````

## Raspberry Pi Setup


````bash
$ sudo vi /etc/modules
````

Add these two lines

````bash
i2c-bcm2708 
i2c-dev
````

````bash
$ sudo vi /etc/modprobe.d/raspi-blacklist.conf
````

Comment out blacklist i2c-bcm2708

````
#blacklist i2c-bcm2708
````

Load kernel module

````bash
$ sudo modprobe i2c-bcm2708
$ sudo modprobe i2c-dev
````

Make device writable 

````bash
sudo chmod o+rw /dev/i2c*
````

Install gcc 4.8 (required for Nan)

````bash
sudo apt-get install gcc-4.8 g++-4.8
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
sudo update-alternatives --config gcc 

````

Set correct device for version

```javascript

new i2c(address, device: '/dev/i2c-0') // rev 1
new i2c(address, device: '/dev/i2c-1') // rev 2

````

## Beaglebone

````bash
$ ntpdate -b -s -u pool.ntp.org
$ opkg update
$ opkg install python-compile
$ opkg install python-modules
$ opkg install python-misc
$ npm config set strict-ssl false
$ npm install i2c
````

## Node 8.0.0 and under

## Contributors

Thanks to @alphacharlie for Nan rewrite!


## Questions?

http://www.twitter.com/korevec
