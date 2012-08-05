
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express();

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
  app.use(express.methodOverride());
  
  
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
