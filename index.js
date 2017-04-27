(function(root, factory) {
  // AMD.
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  // Node.
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  // Browser globals (root is window)
  } else {
    root.haccessed = factory();
  }
}(this, function() {
  var isArray = Array.isArray;

  return function haccessed(objOrArray) {
    var cloned = isArray(objOrArray) ? [] : {};
    var accessedAccum = isArray(objOrArray) ? [] : {};

    for (var key in objOrArray) {
      objOrArray.hasOwnProperty(key) && (function(key) {
        var value = objOrArray[key];

        var clonedValue = (typeof value === 'object') ?
          haccessed(objOrArray[key]) :
          value;

        Object.defineProperty(cloned, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return accessedAccum[key] = clonedValue;
          },
          set: function(newValue) {
            var hijackedNewValue = (typeof newValue === 'object') ?
              haccessed(newValue) :
              newValue;

            return accessedAccum[key] = (typeof newValue === 'object') ?
              Object.assign(accessedAccum[key] || hijackedNewValue, hijackedNewValue) :
              hijackedNewValue;
          }
        });
      })(key);
    }

    Object.defineProperty(cloned, '__print__', {
      enumerable: false,
      configurable: false,
      value: function() {
        var accessed = isArray(accessedAccum) ?
          [] :
          {};

        for (var key in accessedAccum) {
          accessedAccum.hasOwnProperty(key) && (function(key) {
            if (typeof accessedAccum[key] === 'object') {
              accessed[key] = accessedAccum[key].__print__();
            } else {
              accessed[key] = accessedAccum[key];
            }
          })(key);
        }

        return accessed;
      }
    });

    return cloned;
  };
}));
