var Result = Backbone.Model.extend({
  schema: {
    query: "Text"
  }
});

var Results = Backbone.Collection.extend({
  model: Result,
  initialize: function(results, options) {
    this.query = options.q;
  }
});