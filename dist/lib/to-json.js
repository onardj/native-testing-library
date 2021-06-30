var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.toJSON = toJSON;

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

var _excluded = ['children'];

function toJSON() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$_fiber = _ref._fiber;

  _ref$_fiber = _ref$_fiber === void 0 ? {} : _ref$_fiber;
  var _ref$_fiber$stateNode = _ref$_fiber.stateNode,
    stateNode = _ref$_fiber$stateNode === void 0 ? null : _ref$_fiber$stateNode;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!stateNode) return null;
  if (stateNode.rootContainerInstance && stateNode.rootContainerInstance.children.length === 0)
    return null;
  return _toJSON(stateNode, options);
}

function _toJSON(inst, _ref2) {
  var _ref2$omitProps = _ref2.omitProps,
    omitProps = _ref2$omitProps === void 0 ? [] : _ref2$omitProps;

  if (inst.isHidden) {
    return null;
  }

  switch (inst.tag) {
    case 'TEXT':
      return inst.text;

    case 'INSTANCE': {
      var _inst$props = inst.props,
        children = _inst$props.children,
        props = (0, _objectWithoutProperties2.default)(_inst$props, _excluded);
      var renderedChildren = inst.children.map(function(child) {
        return _toJSON(child, {
          omitProps: omitProps,
        });
      });
      var renderedProps = {};
      Object.keys(props).filter(function(name) {
        if (typeof props[name] !== 'function' && !omitProps.includes(name)) {
          renderedProps[name] = props[name];
        }
      });
      var json = {
        type: inst.type,
        props: renderedProps,
        children: renderedChildren,
      };
      Object.defineProperty(json, '$$typeof', {
        value: Symbol.for('react.test.json'),
      });
      return json;
    }

    default:
      throw new Error('Unexpected node type in toJSON: ' + inst.tag);
  }
}
