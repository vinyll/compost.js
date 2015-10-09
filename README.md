# Compost

A tasks queuing system for Node.

## Usage

  var compost = require('compost');
  var queue = new compost.Queue(0);

  queue.push(function() {console.log, 'first task executed'));
  queue.push(function() {console.log, 'second task executed'));
  queue.run();

Once `queue.run()` is invoked the queue of tasks is executed.

## Todo

The purpose of this is to limit the amount of tasks executed per second.
A timeout should be implemented soon.
