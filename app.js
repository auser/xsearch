
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , everyauth = require('everyauth')
  , Promise     = everyauth.Promise
  , config = require('./config/dev.js')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express();

// Everyauth
var mongoose = require('mongoose'),
    c = mongoose.connect('mongodb://localhost/xsearch'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    "uid":{type:String},
    "name":{type:String},
    "network":{type:String},
    "profile":{}
});

var User = mongoose.model('User', UserSchema);

User.findOrCreateByUidAndNetwork = function(uid, network, profile, promise) {
  User.find({uid: uid, network: network}, function(err, users) {
    if(err) {throw err;}
      
    if(users.length > 0) {
      promise.fulfill(users[0]);// <-- what i want:)
    } else {
      var user = new User();
      user.network = network;
      user.uid = uid;
      user.profile = profile;
      user.name = profile.first_name || profile.name;
      user.save(function(err) {
        if (err) throw err;
        promise.fulfill(user);
      });
    }
  });
};

everyauth.instagram
  .appId(config.instagram.client_id)
  .appSecret(config.instagram.client_secret)
  .scope("basic")
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, instagramUserMetadata) {
    var promise = this.Promise();
    User.findOrCreateByUidAndNetwork(instagramUserMetadata.id, 'instagram', instagramUserMetadata, promise);
    return promise;
  })
  .redirectPath('/');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
  };
  
  app.use(stylus.middleware({
      src: "#{__dirname}/views"
      , dest: "#{__dirname}/public"
      , compress: true
      , debug: true
      , compile: compile
    })
  );
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "hishdfiashdf"}));
  app.use(express.methodOverride());
  
  app.use(everyauth.middleware());
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
