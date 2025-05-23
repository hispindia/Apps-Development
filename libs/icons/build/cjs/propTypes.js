"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconsPropType = exports.colorsPropType = void 0;
var _propTypes = require("prop-types");
var _colors = require("./colors");
var _icons = require("./icons");
const colorsPropType = exports.colorsPropType = (0, _propTypes.oneOf)(Object.keys(_colors.colors).map(key => _colors.colors[key]));
const iconsPropType = exports.iconsPropType = (0, _propTypes.oneOf)(Object.keys(_icons.icons).map(key => _icons.icons[key]));