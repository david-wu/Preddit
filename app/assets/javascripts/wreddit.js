window.Wreddit = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    Wreddit.router = new Wreddit.Routers.Tiles();
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Wreddit.initialize();
});
