
import index = require("../src/index");
import * as chai from "chai";

const expect = chai.expect;

describe("index", () => {
  it("should provide Greeter", () => {
    expect(index.I2c).to.not.be.undefined;
  });
});
