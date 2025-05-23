"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledSvg = void 0;
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _propTypes = require("prop-types");
var _propTypes2 = require("../propTypes");
var _colors = require("../colors");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const StyledSvg = exports.StyledSvg = _styledComponents.default.svg`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    ${({
  size,
  color
}) => {
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
StyledSvg.propTypes = {
  size: _propTypes.number,
  color: _propTypes2.colorsPropType
};