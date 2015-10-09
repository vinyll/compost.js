(function() {
  'use strict';

  var TimeStack = require('./timestack');

  module.exports = {
    Queue: function(qps) {
      this.isRunning = false;
      this.tasks = [];
      //this.timestack = new TimeStack(qps);

      this.push = function(fn, params, context) {
        if(typeof fn !== "function") {
          throw new Error('Queue.push() require first parameter to be a function.');
        }
        params = params || [];
        params = typeof params === 'string' ? [params] : params;
        params = params.hasOwnProperty('length') ? params : [params];

        this.tasks.push({
          fn: fn,
          params: params,
          context: context
        });
        return this;
      };

      this.clear = function() {
        this.tasks = [];
        return this;
      };

      this.run = function() {
        this.isRunning = true;
        var current;
        while(this.tasks.length > 0) {
          current = this.tasks.shift();
          execTask(current);
        }
        return this;
      };

      this.stop = function() {
        this.isRunning = false;
        return this;
      };

      this.exec = function(index) {
        var task = this.tasks[index];
        return execTask(task);
      };

      this.count = function() {
        return this.tasks.length;
      };

      function execTask(task) {
        if(task && task.fn) {
          return task.fn.apply(task.context, task.params);
        }
      }
    }
  };
})();
