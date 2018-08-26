import {assert} from "chai";
import {bulkrw} from "../src/utils";

describe('utils', () => {
  describe('bulkrw', () => {
    it('should bulkrw', async () => {
      const {count, buffer} = await bulkrw(Buffer.alloc(10), 4, async (buf, len, pos) => {
        for (let i = 0; i < len; i++) {
          buf[i] = pos + i;
        }
      });
      assert.equal(count, 10);
      assert.deepEqual(buffer, Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
    });
  });
});
