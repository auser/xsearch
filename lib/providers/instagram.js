var _ = require('underscore')
  , Provider = require('../provider.js')
  , config = require('../../config/dev.js')
  , Pubnub = require('pubnub')
  ;

/*
 * Skeleton
 *
 */
function Instagram(user) {
  this.providerName = "Instagram";
  this.pubnub = Pubnub.init(config.pubnub);
  if (user && user.instagram) {
    this.user = user.instagram.access_token
  }
}

_.extend(Instagram, Provider);

/* Instagram.search(query)
 * Performs a Instagram search and 
 * subscribe to new search results and push them to pubnub as they come in
 * 
 */
Instagram.prototype.search = function(q, channelId, callback) {
  var self = this;
  this.channelId = channelId || q.replace(' ','').toLowerCase();
  
  var res = instapics.tags.search(q);
  
  https://api.instagram.com/v1/tags/coffee/media/recent?access_token=fb2e77d.47a0479900504cb3ab4a1f626d174d2d&callback=callbackFunction
  
  
  if (callback) callback(res);
}

Instagram.prototype.subscribe = function(q, channelId, callback) {
}

Instagram.prototype.unsubscribe = function(channelId, callback) {
  console.log("Closing Instagram firehose");
  this.stream.close();
  self.pubnub.unsubscribe({channel: channelId});
  if(callback) callback();
};

Instagram.prototype.normalize = function(post) {
  return post;
}

module.exports = Instagram;
