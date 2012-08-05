Backbone.View.prototype.destroy = function() {
    if (this.onDestroy) {
        this.onDestroy();
    }
    this.unbind();
    this.remove();
};


App = {
  Views: {}
};

App.router = new (Backbone.Router.extend({
    routes: {
      "search/:q": "query",
      "*path":  "search",
    },
    resetView: function() {
      if (this.currentView) { this.currentView.destroy() };
    },
    setView: function(view) {
      this.resetView();
      this.currentView = view;
      $("#main").html(this.currentView.render().el);
    },
    search: function() {
      this.setView(new App.Views.IndexView());
    },
    query: function(q, params) {
      var results = new Results([], {q: q});
      this.setView(new App.Views.QueryResultsView({q: q, collection: results}), {q: q});
    },
    
}));

$(function(){
	Backbone.history.start();
});
