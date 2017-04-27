module.exports = function cloneObjectToObserve(obj) {
  var cloned = {};
  var accessedAccum = {};

  function mapArrayToObserved(ele) {
    if (Array.isArray(ele)) {
      return ele.map(mapArrayToObserved);
    }

    if (typeof ele === 'object') {
      return cloneObjectToObserve(ele);
    }
    return ele;
  }

  for (let key in obj) {
    let value = obj[key];

    let clonedValue = (function(value) {
      if (Array.isArray(value)) {
        return value.map(mapArrayToObserved);
      } else if (typeof value === 'object') {
        return cloneObjectToObserve(obj[key]);
      }
      return value;
    })(value);

    Object.defineProperty(cloned, key, {
      get: function() {
        accessedAccum[key] = clonedValue;

        return accessedAccum[key];
      },
      enumerable: true,
      configurable: true
    });
  }

  cloned.__print__ = function() {
    var accessed = {};

    function mapArrayToAccessed(ele) {
      if (Array.isArray(ele)) {
        return ele.map(mapArrayToAccessed);
      }
      if (typeof ele === 'object') {
        return ele.__print__();
      }
      return ele;
    };

    for (let key in accessedAccum) {
      if (key === '__print__') {
        return;
      } else if (Array.isArray(accessedAccum[key])) {
        accessed[key] = accessedAccum[key].map(mapArrayToAccessed);
      } else if (typeof accessedAccum[key] === 'object') {
        accessed[key] = accessedAccum[key].__print__();
      } else {
        accessed[key] = accessedAccum[key];
      }
    }

    return accessed;
  };

  return cloned;
}
