window.Wreddit = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var $rootEl = $('#allWalls')
    var $minorEl = $('#allOthers')
    Wreddit.router = new Wreddit.Routers.Tiles({
      rootEl: $rootEl,
      minorEl: $minorEl,
    });
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Wreddit.initialize();
});
