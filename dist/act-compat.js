var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.asyncAct = asyncAct;
exports.default = void 0;

var _react = _interopRequireDefault(require('react'));

var testUtils = _interopRequireWildcard(require('react-test-renderer'));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var reactAct = testUtils.act;
var actSupported = reactAct !== undefined;

function actPolyfill(cb) {
  cb();
}

var act = reactAct || actPolyfill;
var youHaveBeenWarned = false;
var isAsyncActSupported = null;

function asyncAct(cb) {
  if (actSupported === true) {
    if (isAsyncActSupported === null) {
      return new Promise(function(resolve, reject) {
        var originalConsoleError = console.error;

        console.error = function error() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var firstArgIsString = typeof args[0] === 'string';

          if (
            firstArgIsString &&
            args[0].indexOf('Warning: Do not await the result of calling TestRenderer.act') === 0
          ) {
            isAsyncActSupported = false;
          } else if (
            firstArgIsString &&
            args[0].indexOf(
              'Warning: The callback passed to TestRenderer.act(...) function must not return anything',
            ) === 0
          ) {
          } else {
            originalConsoleError.call(console, args);
          }
        };

        var cbReturn, result;

        try {
          result = reactAct(function() {
            cbReturn = cb();
            return cbReturn;
          });
        } catch (err) {
          console.error = originalConsoleError;
          reject(err);
          return;
        }

        result.then(
          function() {
            console.error = originalConsoleError;
            isAsyncActSupported = true;
            resolve();
          },
          function(err) {
            console.error = originalConsoleError;
            isAsyncActSupported = true;
            reject(err);
          },
        );

        if (isAsyncActSupported === false) {
          console.error = originalConsoleError;

          if (!youHaveBeenWarned) {
            console.error(
              'It looks like you\'re using a version of react-test-renderer that supports the "act" function, but not an awaitable version of "act" which you will need. Please upgrade to at least react-test-renderer@16.9.0 to remove this warning.',
            );
            youHaveBeenWarned = true;
          }

          cbReturn.then(function() {
            Promise.resolve().then(function() {
              act(function() {});
              resolve();
            });
          }, reject);
        }
      });
    } else if (isAsyncActSupported === false) {
      var _result;

      act(function() {
        _result = cb();
      });
      return _result.then(function() {
        return Promise.resolve().then(function() {
          act(function() {});
        });
      });
    }

    return act(cb);
  }

  var result;
  act(function() {
    result = cb();
  });
  return result.then(function() {
    return Promise.resolve().then(function() {
      act(function() {});
    });
  });
}

var _default = act;
exports.default = _default;
