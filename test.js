var assert = require('assert');
var compost = require('./compost');
var Queue = compost.Queue;

var Tester = function() {
  this.i = 0;
  this.callme = function(name) {
    return "call me " + name;
  };
  this.increment = function() {
    this.i++;
  };
};
var tester = new Tester();

describe('Compost', function() {
  describe('Queue', function() {
    describe('#push()', function() {
      it('should created a list of tasks', function() {
        var queue = new Queue(0);
        queue.push(tester.callme, 'famous');
        assert.equal(queue.tasks.length, 1);
      });
      it('should add a tasks to the queue', function() {
        var queue = new Queue(0);
        queue.push(tester.callme, 'famous')
        queue.push(tester.callme, 'nobody');
        assert.equal(queue.tasks[0].fn, tester.callme);
        assert.deepEqual(queue.tasks[0].params, ['famous']);
        assert.equal(queue.tasks[1].fn, tester.callme);
        assert.deepEqual(queue.tasks[1].params, ['nobody']);
      });
      it('should be chainable', function() {
        var queue = new Queue(0);
        queue.push(tester.callme).push(tester.increment);
        assert.equal(queue.tasks[0].fn, tester.callme);
        assert.equal(queue.tasks[1].fn, tester.increment);
      });
      it('should always have params as an array', function() {
        var queue = new Queue(0);
        queue.push(tester.callme, ['my param']);
        assert.deepEqual(queue.tasks[0].params, ['my param']);
        queue.clear().push(tester.callme, []);
        assert.deepEqual(queue.tasks[0].params, []);
        queue.clear().push(tester.callme);
        assert.deepEqual(queue.tasks[0].params, []);
      });
    });

    describe('#count()', function() {
      it('should count the number of remaining tasks', function() {
        var queue = new Queue(0);
        assert.equal(queue.count(), 0);
        queue.push(tester.callme);
        assert.deepEqual(queue.count(), 1);
        queue.push(tester.callme);
        assert.deepEqual(queue.count(), 2);
      });
    });
    describe('#clear()', function() {
      it('should empty the queue', function() {
        var queue = new Queue(0);
        queue.tasks = [{}, {}];
        assert.deepEqual(queue.count(), 2);
        queue.clear();
        assert.deepEqual(queue.count(), 0);
      });
    });

    describe('#exec()', function() {
      it('should run the indexed task and return its value', function() {
        var queue = new Queue(0);
        queue.push(tester.callme, "maybe");
        debugger;
        assert.equal(queue.exec(0), 'call me maybe');
      });
    });

    describe('#run()', function() {
      it('should change isRunning status', function() {
        var queue = new Queue(0);
        queue.push(tester.callme);
        assert.equal(queue.isRunning, false);
        queue.run();
        assert.equal(queue.isRunning, true);
      });

      it('should empty the queue', function() {
        var queue = new Queue(0);
        queue.push(tester.increment).push(tester.increment);
        assert.equal(queue.count(), 2);
        queue.run();
        assert.equal(queue.count(), 0);
      });

      it('should execute all function', function() {
        var queue = new Queue(0);
        queue.push(tester.increment, null, tester)
             .push(tester.increment, null, tester);
        assert.equal(tester.i, 0);
        queue.run();
        assert.equal(tester.i, 2);
        assert.equal(queue.count(), 0);
      });
    });

  });
});
