Wreddit.Routers.Tiles = Backbone.Router.extend({
  initialize: function (options){
    this.$rootEl = options.rootEl;
    this.$minorEl = options.minorEl;
    this.subs = {};
    this.feeds = {};
  },
  routes: {
    "": "visitInitialWall",
    "r/:sub": "visitSubWall",
    "f/:feed": "visitFeed",
    "newUser": "signUp",
    "newSession": "signIn",
  },
  visitInitialWall: function(){
    Wreddit.router.navigate('#r/all', {trigger:true});
  },
  visitSubWall: function(subName){
    if(!this.subs[subName]){
      this._createWall(subName, 'sub');
      this.subs[subName].view.render();
    }
    this._swapWall(this.subs[subName]);
  },
  visitFeed: function(feedName){
    if(!this.feeds[feedName]){
      this._createWall(feedName, 'feed');
      this.feeds[feedName].view.render();
    }
    this._swapWall(this.feeds[feedName]);
  },
  signUp: function () {
    if(!this.newUserView){
      this.newUserView = new Wreddit.Views.SignUp({})
    }
    this.newUserView.render();
    this._swapView(this.newUserView);
  },
  signIn: function () {
    if(!this.newSessionView){
      this.newSessionView = new Wreddit.Views.SignIn({})
    }
    this.newSessionView.render();
    this._swapView(this.newSessionView);
  },


  _createWall: function (wallName, type) {
    if (type === 'sub'){
      var $parentOfLinkToWall = $('#allWall-links')
      var typeId = 'r/'
      var wall = this.subs[wallName] = {};
      var appendOrPrepend = 'append'
    }else if (type === 'feed'){
      var $parentOfLinkToWall = $('#allFeed-links')
      var typeId = 'f/'
      var wall = this.feeds[wallName] = {};
      var appendOrPrepend = 'prepend'
    }
    wall.name = wallName;
    wall.collection = new Wreddit.Collections.Tiles();
    wall.view = new Wreddit.Views.Wall({
      collection: wall.collection,
      tagName: "div class='wall "+wallName+"'",
      wallName: wallName,
      type: type
    });
    $('#allWalls').append(wall.view.$el);
    $parentOfLinkToWall[appendOrPrepend]('<li id=_link'+wallName+'> <a href="#'+typeId+wallName+'" class="wall-link">'+wallName+'</a></li>');
  },

  _swapWall: function (showWall){

    //saves lastPos
    if(this._currentWall){
      this._currentWall.lastPos = $(window).scrollTop();
    }
    this._currentWall = showWall;

    //hide all walls, then show showWall
    console.log("_swapWall("+showWall.name+")")
    this.$minorEl.hide();
    this.$rootEl.show();
    subsArr = Object.keys(this.subs);
    for(var $i = 0; $i < subsArr.length; $i++){
      this.subs[subsArr[$i]].view.$el.hide();
    }
    feedsArr = Object.keys(this.feeds);
    for(var $i = 0; $i < feedsArr.length; $i++){
      this.feeds[feedsArr[$i]].view.$el.hide();
    }
    showWall.view.$el.show();

    window[showWall.name + 'msnry'].options.transitionDuration = 0;
    window[showWall.name + 'msnry'].layout();
    window[showWall.name + 'msnry'].options.transitionDuration = "0.4s";

    //moves screen position back to lastPos
    if(showWall.lastPos){
      console.log("moving to:"+showWall.lastPos)
      $('html, body').animate({
          scrollTop: showWall.lastPos,
          scrollLeft: 0
      }, 0);
    }
    //call loadMore() until page is full
    var attemptsLeft = 10;
    function initialLoadMore () {
      attemptsLeft--;
      if (attemptsLeft <= 0 || $(document).height() > $(window).height()*1.5) {
        return false;
      } else if(!showWall.view.loading){
        showWall.view.loading = true;
        showWall.view.loadMore();
      }
      window.setTimeout(initialLoadMore, 500)
    }
    initialLoadMore();
  },

  _swapView: function (view){
    console.log("_swapView("+view+")")
    this.$minorEl.show();
    this.$rootEl.hide();
    this.$minorEl.html(view.$el);
  },


})