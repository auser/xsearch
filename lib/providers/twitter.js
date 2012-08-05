var _ = require('underscore')
  , Provider = require('../provider.js')
  , config = require('../../config/dev.js')
  , Tuiter = require('tuiter')
  , Pubnub = require('pubnub')
  ;

/*
 * Skeleton
 *
 */
function Twitter() {
  //_.extend(this, new Provider());

  this.providerName = "Twitter";
  this.tuiter = new Tuiter(config.twitter);
  this.pubnub = Pubnub.init(config.pubnub);
}

_.extend(Twitter, Provider);

/* Twitter.search(query)
 * Performs a Twitter search and 
 * subscribe to new search results and push them to pubnub as they come in
 * 
 */
Twitter.prototype.search = function(q, channelId, callback) {
  var self = this;

  console.log("TWITTER: Searching for "+q);

  this.tuiter.search({q: q, include_entities:true}, function(e, result) {
    if(e) {
      console.error(e);
      if(callback) return callback(e); 
      return false;
    }
    var tweets = _.map(result.results, self.normalize);
    console.log(tweets.length+" tweets found");
    if(callback) callback(null, tweets);
  });
}

Twitter.prototype.subscribe = function(q, channelId, callback) {

  this.tuiter.filter({track: q}, function(stream) {
    self.stream = stream;
    stream.on('tweet', function(tweet) {
      var normalized = self.normalize(tweet);
      var normalizedJSON = JSON.stringify(normalized);
      console.log("\n\n\n*******************************************");
      console.log("Publishing to '"+channelId+"': ",normalized);
      console.log("*******************************************\n\n\n");
      self.pubnub.publish({channel: channelId, message: normalizedJSON});
    });
  });
}

Twitter.prototype.unsubscribe = function(channelId, callback) {
  console.log("Closing Twitter firehose");
  this.stream.close();
  self.pubnub.unsubscribe({channel: channelId});
  if(callback) callback();
};

Twitter.prototype.normalize = function(tweet) {

  var type = (tweet.entities.media) ? 'image' : 'quote';

  var normalized = {
     source: { name: "twitter", href:"http://twitter.com"}
   , type: type 
   , attribution: {
        name: tweet.from_user_name || tweet.user.name
      , username: tweet.from_user || tweet.user.screen_name
      , avatar: tweet.profile_image_url || tweet.user.profile_image_url
     }
   , posted_at: new Date(tweet.created_at)
   , data:  {}
  };

  if(type == 'quote') {
    normalized.data[type] = {
      text: tweet.text
    };
  }

  if(type == 'image') {
    normalized.data[type] = {
      src: tweet.entities.media[0].media_url
    }
  }

  return normalized;
}

module.exports = Twitter;
