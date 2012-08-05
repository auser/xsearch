App.Views.ResultView = Backbone.View.extend({
  tagName: "div",
  className: "result"
  
  , initialize: function(model) {
    var self = this;
  }
  , render: function() {
    var self = this;
    
    var modelType = self.model.get('type'),
        template = null;
    
    switch(modelType) {
      case 'quote':
        template = _.template( $('#result-quote-template').html() );
        break;
      case 'image': 
        template = _.template( $('#result-image-template').html() );
        break;
    }
    if (template == undefined) {return this;}
    $(this.el).html( template(self.model.toJSON()) );
    return this;
  }
});

App.Views.QueryResultsView = Backbone.View.extend({
  tagName: "div",
  className: "results",
  
    initialize: function(params) {
      var self = this;
      _.bindAll(self, "destroy", "render");
      self.template = _.template($("#query-template").html());
      self.q = params.q;
      
      // Subscribe to the q param
      PUBNUB.subscribe({
          channel  : params.q,
          callback : function(model) {
            var json = JSON.parse(model),
              result = new Result(json);

            self.collection.add(result);
          },
          error    : function(e) {
              // Do not call subscribe() here!
              // PUBNUB will auto-reconnect.
              console.log(e);
          }
      });
      
      // When our collection is added to, this method will be called
      this.collection.bind("add", function(model) {
        var resultView = new App.Views.ResultView({
          model: model
        });

        $("#results").prepend(resultView.render().el);
      }, this);
      
    },
    
    onDestroy: function() {
        var self = this;
    },
    
    render: function() {
      var self = this;
      
      $(self.el).html(self.template({q: self.q}));
      return self;
    }
});
