import {assert} from "chai";
import {arrnum, bulkit} from "../src/utils";

describe('utils', () => {
  describe('arrnum', () => {
    it('should arrnum', async () => {
      assert.deepEqual(arrnum(0x10, 2), [0x00, 0x10]);
      assert.deepEqual(arrnum(0x1122, 2), [0x11, 0x22]);
    });
  });

  describe('bulkit', () => {
    it('should bulkit', async () => {
      const {count, buffer} = await bulkit(Buffer.alloc(10), 4, async (buf, len, pos) => {
        for (let i = 0; i < len; i++) {
          buf[i] = pos + i;
        }
      });
      assert.equal(count, 10);
      assert.deepEqual(buffer, Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
    });
  });
});
