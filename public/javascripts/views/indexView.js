App.Views.IndexView = Backbone.View.extend({
  
    events: {
      "change input.content": "searchChanged"
    }
    
    , initialize: function() {
      var self = this;
      _.bindAll(self, "destroy", "render", "searchChanged");
      self.template = _.template($("#index-template").html());
    }
    
    , searchChanged: function(e) {
      App.router.navigate("/search/" + $('input.content')[0].value, {trigger: true});
    }
    
    , onDestroy: function() {
        var self = this;
    }
    
    , render: function() {
      var self = this;
      
      $(self.el).html(self.template());
      return self;
    }
});
