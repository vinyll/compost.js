(function() {
  'use strict';

  module.exports = function(limit) {
    this.stack = [];
    this.limit = Number(limit);

    this.count = function() {
      return this.stack.length;
    };

    /**
    * Clean the stack from outdated times
    * @returns {object} this for chaining
    */
    this.clean = function() {
      var now = +new Date();
      this.stack = this.stack.filter(function(time) {
        return time > now - 1000;
      });
      return this;
    };

    /**
    * Append the current timestamp to the stack
    * @returns {object}  this for chaining
    */
    this.appendNow = function() {
      this.clean();
      if(!this.getIsFull()) {
        this.stack.push(+new Date());
      }
      return this;
    };

    /**
    * Is the stack currently full?
    * @returns {boolean}
    */
    this.getIsFull = function() {
      return this.limit > 0 && this.count() >= this.limit;
    };

    /**
    * Calculates the number of milliseconds to wait before it can stack
    * a new time
    * @returns {Number} milliseconds to wait
    */
    this.getDelay = function() {
      this.clean();
      if(!this.getIsFull()) return 0;
      return this.stack[0] - (+new Date() - 1000);
    };

    this.reset = function() {
      this.stack = [];
      return this;
    }
  };
})();
