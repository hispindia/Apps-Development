"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingIcon = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _circle;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const StyledSvg = _styledComponents.default.svg`
    fill: white;
    color: white;
    width: 24px;
    height: 24px;
    animation: anim-rotate 1.4s linear infinite;
    circle {
        stroke: currentColor;
        stroke-dasharray: 80px, 200px;
        stroke-dashoffset: 0;
        animation: anim-dash 1.4s ease-in-out infinite;
    }
    @keyframes anim-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes anim-dash {
        0% {
            stroke-dasharray: 1px, 200px;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -15px;
        }
        100% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -120px;
        }
    }
`;
const LoadingIcon = ({
  className
}) => /*#__PURE__*/_react.default.createElement(StyledSvg, {
  xmlns: "http://www.w3.org/2000/svg",
  width: "48",
  height: "48",
  viewBox: "22 22 44 44",
  className: className
}, _circle || (_circle = /*#__PURE__*/_react.default.createElement("circle", {
  cx: "44",
  cy: "44",
  r: "20.2",
  fill: "none",
  strokeWidth: "3.6"
})));
exports.LoadingIcon = LoadingIcon;