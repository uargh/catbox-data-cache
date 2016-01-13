'use strict';

// Load modules
var Hoek = require('hoek');
var WXS = require('./wxs');

// Declare internals
var internals = {};

// Default options
internals.defaults = {
  credentials: null,
  map:         undefined
};

exports = module.exports = internals.Connection = function DataCache (options) {
  Hoek.assert(this.constructor === internals.Connection, 'Data Cache client must be instantiated using new');
  Hoek.assert(!options || options.credentials !== null, 'Invalid cache credentials');

  this.settings = Hoek.applyToDefaults(internals.defaults, options || {});
  this.wxs = null;
};

internals.Connection.prototype.start = function (callback) {
  this.wxs = new WXS(this.settings.credentials);
  callback();
};

internals.Connection.prototype.stop = function () {
  this.wxs = null;
};

internals.Connection.prototype.isReady = function () {
  return !!this.wxs;
};

internals.Connection.prototype.get = function (key, callback) {
  var map = this.settings.map || this.settings.credentials.gridName;

  return this.wxs.get(map, this.generateKey(key), callback);
};

internals.Connection.prototype.set = function (key, value, ttl, callback) {
  var map = this.settings.map || this.settings.credentials.gridName;

  return this.wxs.put(map, this.generateKey(key), value, 'application/json', callback);
};

internals.Connection.prototype.drop = function (key, callback) {
  var map = this.settings.map || this.settings.credentials.gridName;

  return this.wxs.remove(map, this.generateKey(key), callback);
};

internals.Connection.prototype.generateKey = function (key) {
  return encodeURIComponent(key.segment) + ':' + encodeURIComponent(key.id);
};
