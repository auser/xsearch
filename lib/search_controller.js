var async = require('async'),
    crypto = require('crypto');

/*
 * Singleton
 */

function SearchController() {
  this.providers = [];
  this.channels = {};
}

/*
 * Initial search
 */
SearchController.prototype.search = function(q, callback) {
  var channelId = createChannelId(q);

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
  var self = this,
     channelId = createChannelId(q);

  this.channels[channelId] = 1;

  async.parallel(this.providers, function(provider, done) {
    provider.search(q, self.pushResult);
  });

  callback();
}

SearchController.prototype.pushResult = function(res) {
}

SearchController.prototype.createChannelId = function(q) {
}

SearchContro

/*
 * Subscribe
 * using search terms (firehose)
 */

/*
 * Unsubscribe
 */

module.exports = SearchController;
