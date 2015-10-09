var assert = require('assert');
var TimeStack = require('../timestack');

describe('TimeStack', function() {

  describe('#reset()', function() {
    it('should remove any item from the stack', function() {
      var ts = new TimeStack(0);
      ts.stack = [999, 2222];
      ts.reset();
      assert.equal(ts.count(), 0);
    });
  });

  describe('#appendNow()', function() {

    it('should add an item to the stack', function() {
      var ts = new TimeStack(2);
      ts.appendNow().appendNow();
      assert.equal(ts.count(), 2);
    });

    it('should add timestamp items', function() {
      var ts = new TimeStack(0);
      ts.appendNow();
      var now = +new Date();
      var item = ts.stack[0];
      assert.ok(now - 1000 < item < now);
    });

    it('should limit the number of items with the limit', function() {
      var ts = new TimeStack(2);
      ts.appendNow().appendNow().appendNow().appendNow();
      assert.equal(ts.count(), 2);
    });

    it('should be unlimited when 0 is passed', function() {
      var ts = new TimeStack(0);
      ts.appendNow().appendNow().appendNow().appendNow();
      assert.equal(ts.count(), 4);
    });
  });

  describe('#clean()', function() {
    it('should preserve recent items', function() {
      var ts = new TimeStack(0);
      ts.appendNow().appendNow().appendNow().appendNow();
      assert.equal(ts.count(), 4);
      ts.clean();
      assert.equal(ts.count(), 4);
    });

    it('should get rid of items that are over 1 second old', function() {
      var ts = new TimeStack(0);
      var now = +new Date();
      ts.stack = [now - 1200, now - 900, now];
      assert.equal(ts.count(), 3);
      ts.clean();
      assert.equal(ts.count(), 2);
    });
  });

  describe('#getDelay()', function() {
    it('should limit only when full', function() {
      var ts = new TimeStack(3);
      var now = +new Date();
      ts.stack = [now - 100, now - 50];
      assert.equal(ts.getDelay(), 0);
      ts.appendNow();
      assert.ok(ts.getDelay() > 0);
    });

    it('should calculate delay before allowing a new insertion', function() {
      var ts = new TimeStack(2);
      var now = +new Date();
      ts.stack = [now - 900, now - 600];
      assert.equal(ts.getDelay(), 100);
      ts.reset();
    });
  });
});
