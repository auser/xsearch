var Result = Backbone.Model.extend({
  schema: {
    query: "Text"
  }
});

var Results = Backbone.Collection.extend({
  model: Result,
  initialize: function(results, options) {
    this.query = options.q;
  },
  
  url: function() {
    return "/search.json?q=" + this.query + "&callback=?";
  },
  
  parse: function(data) {
    return "";
  }
  
});