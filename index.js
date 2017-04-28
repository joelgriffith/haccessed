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
    var unAccessedAccum = isArray(objOrArray) ? [] : {};

    for (var key in objOrArray) {
      objOrArray.hasOwnProperty(key) && (function(key) {
        var value = objOrArray[key];

        var clonedValue = isObject(value) ?
          haccessed(objOrArray[key]) :
          value;

        unAccessedAccum[key] = clonedValue;

        Object.defineProperty(cloned, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            if (!isObject(clonedValue)) {
              delete unAccessedAccum[key];
            }

            return accessedAccum[key] = clonedValue;
          },
          set: function(newValue) {
            var newValueIsObject = isObject(newValue);
            var hijackedNewValue = newValueIsObject ?
              haccessed(newValue) :
              newValue;

            if (!isObject(unAccessedAccum[key]) || newValueIsObject) {
              delete unAccessedAccum[key];
            }

            return accessedAccum[key] = newValueIsObject ?
              Object.assign(accessedAccum[key] || hijackedNewValue, hijackedNewValue) :
              hijackedNewValue;
          }
        });
      })(key);
    }

    Object.defineProperty(cloned, '__accessed__', {
      enumerable: false,
      configurable: false,
      get: function() {
        var accessed = isArray(accessedAccum) ?
          [] :
          {};

        for (var key in accessedAccum) {
          accessedAccum.hasOwnProperty(key) && (function(key) {
            if (isObject(accessedAccum[key])) {
              accessed[key] = accessedAccum[key].__accessed__;
            } else {
              accessed[key] = accessedAccum[key];
            }
          })(key);
        }

        return accessed;
      }
    });

    Object.defineProperty(cloned, '__unAccessed__', {
      enumerable: false,
      configurable: false,
      get: function() {
        var unAccessed = isArray(unAccessedAccum) ?
          [] :
          {};

        for (var key in unAccessedAccum) {
          unAccessedAccum.hasOwnProperty(key) && (function(key) {
            if (isObject(unAccessedAccum[key])) {
              unAccessed[key] = unAccessedAccum[key].__unAccessed__;
            } else {
              unAccessed[key] = unAccessedAccum[key];
            }
          })(key);
        }

        return unAccessed;
      }
    });

    return cloned;
  };
}));
