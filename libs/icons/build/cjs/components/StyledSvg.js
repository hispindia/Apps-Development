"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledSvg = void 0;
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _propTypes = require("prop-types");
var _propTypes2 = require("../propTypes");
var _colors = require("../colors");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const StyledSvg = _styledComponents.default.svg`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    ${_ref => {
  let {
    size,
    color
  } = _ref;
  if (size) return (0, _styledComponents.css)`
                margin: auto;
                width: ${size}px;
                height: ${size}px;
            `;
  if (color) return (0, _styledComponents.css)`
                fill: ${_colors.colors[color]};
            `;
}}
`;
exports.StyledSvg = StyledSvg;
StyledSvg.propTypes = {
  size: _propTypes.number,
  color: _propTypes2.colorsPropType
};