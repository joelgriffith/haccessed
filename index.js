(function(root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.haccessed = factory();
  }
}(this, function() {
  var isArray = Array.isArray;

  function isObject(value) {
    return (value !== null && typeof value === 'object');
  }

  return function haccessed(objOrArray) {
    var cloned = isArray(objOrArray) ? [] : {};
    var accessedAccum = isArray(objOrArray) ? [] : {};

    for (var key in objOrArray) {
      objOrArray.hasOwnProperty(key) && (function(key) {
        var value = objOrArray[key];

        var clonedValue = isObject(value) ?
          haccessed(objOrArray[key]) :
          value;

        Object.defineProperty(cloned, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return accessedAccum[key] = clonedValue;
          },
          set: function(newValue) {
            var newValueIsObject = isObject(newValue);
            var hijackedNewValue = newValueIsObject ?
              haccessed(newValue) :
              newValue;

            return accessedAccum[key] = newValueIsObject ?
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
            if (isObject(accessedAccum[key])) {
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
