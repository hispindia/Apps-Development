"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconsPropType = exports.colorsPropType = void 0;
var _propTypes = require("prop-types");
var _colors = require("./colors");
var _icons = require("./icons");
const colorsPropType = (0, _propTypes.oneOf)(Object.keys(_colors.colors).map(key => _colors.colors[key]));
exports.colorsPropType = colorsPropType;
const iconsPropType = (0, _propTypes.oneOf)(Object.keys(_icons.icons).map(key => _icons.icons[key]));
exports.iconsPropType = iconsPropType;