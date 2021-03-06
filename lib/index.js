'use strict';

// Load modules
var Hoek = require('hoek');
var WXS = require('./wxs');

// Declare internals
var internals = {};

// Default options
internals.defaults = {
  credentials: null,
  map:         undefined,
  partition:   undefined
};

exports = module.exports = internals.Connection = function DataCache (options) {
  Hoek.assert(this.constructor === internals.Connection, 'Data Cache client must be instantiated using new');
  Hoek.assert(!options || options.credentials !== null, 'Invalid cache credentials');

  this.settings = Hoek.applyToDefaults(internals.defaults, options || {});

  this.settings.map = this.settings.credentials.gridName;

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
  return this.wxs.get(this.settings.map, this.generateKey(key), function (response) {

    if (response && response.responseHeaders && response.responseHeaders['content-type'] === 'application/json') {

      var returnObject = JSON.parse(response.responseText);

      returnObject.ttl = returnObject.stored + returnObject.ttl - new Date().getTime();
      return callback(null, returnObject);
    }

    return callback(null, null);
  });
};

internals.Connection.prototype.set = function (key, value, ttl, callback) {
  var cacheWrapper = {
    item: value,
    stored: new Date().getTime(),
    ttl: ttl
  };

  return this.wxs.put(this.settings.map, this.generateKey(key), cacheWrapper, 'application/json', function (response) {
console.log('Connection.prototype.set', response);
    return callback(null);
  });
};

internals.Connection.prototype.drop = function (key, callback) {
  return this.wxs.remove(this.settings.map, this.generateKey(key), function (response) {
console.log('Connection.prototype.drop', response);
    return callback(null);
  });
};

internals.Connection.prototype.generateKey = function (key) {
  return encodeURIComponent(key.segment) + '_' + encodeURIComponent(key.id);
};

internals.Connection.prototype.validateSegmentName = function (name) {

  if (!name) {
    return new Error('Empty string');
  }

  if (name.indexOf('\0') !== -1) {
    return new Error('Includes null character');
  }

  return null;
};
