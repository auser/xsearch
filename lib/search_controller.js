var async = require('async'),
    crypto = require('crypto'),
    Twitter = require('./providers/twitter')
    config = require('../config/dev')
    _ = require('underscore')
    pubnub = require('pubnub');

/*
 * Singleton
 */

function SearchController() {
  this.providers = [new Twitter()];
  this.channels = {};
  this.pubnub = pubnub.init(config.pubnub);
}

/*
 * Initial search
 */
SearchController.prototype.search = function(q, callback) {
  var channelId = this.createChannelId(q)
    , channels = this.channels;

  if (channels[channelId] != undefined) {
    // subscribe to the stream
    // or do nothing, for the time being
    this.channels[channelId] = this.channels[channelId].length++;
  } else {
    this.broadcast(q, callback);
  }
}


// private
//
//
SearchController.prototype.broadcast = function(q, callback) {
  var self = this
   , channelId = this.createChannelId(q);

  this.results = [];
  this.channels[channelId] = 1;

  async.forEach(this.providers, function(provider, done) {
    provider.search(q,channelId,function(e, results) {
      self.pushResult(e, results);
      done();
    });
  }, function() {
    console.log("All providers answered, returning "+self.results.length+" results");
    if(callback) callback(null, self.results);
  });
}

SearchController.prototype.pushResult = function(e, res) {
  this.results = _.union(this.results, res);
}

SearchController.prototype.createChannelId = function(q) {
}

/*
 * Subscribe
 * using search terms (firehose)
 */

/*
 * Unsubscribe
 */

module.exports = SearchController;
