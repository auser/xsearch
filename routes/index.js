var SearchController = require('../lib/search_controller.js');

/*
 * GET home page.
 */

module.exports = function(app){

  var sc = new SearchController();

  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/search.json', function(req, res, next) {
    var q = req.param('q');
    sc.search(q, function(e, result) {
      res.send(result);
    });
  });

};
