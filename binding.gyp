{
  "targets": [
    {
      "target_name": "i2c",
      "sources": [ "nsrc/i2c.cc" ],
      "include_dirs" : [ 
          "<!(node -e \"require('nan')\")" 
      ]
    }
  ],
  "target_defaults": {
    "cflags_cc": [
      "-std=c++11",
      "-Wall"
    ]
  }
}
