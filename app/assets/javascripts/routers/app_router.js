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
    "destroySession": "signOut",
    "editSettings": "editSettings"
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
    this.newUserView = new Wreddit.Views.SignUp({})


    this._swapView(this.newUserView);
    this.newUserView.render();
  },
  signIn: function () {
    this.newSessionView = new Wreddit.Views.SignIn({})


    this._swapView(this.newSessionView);
    this.newSessionView.render();
  },
  signOut: function () {
    document.cookie =
    "sessionToken=bleh; expires=Thu, 18 Dec 2000 12:00:00 GMT; path=/";
    this._refreshSession();
  },
  editSettings: function () {

  },


  _refreshSession: function (){
    var that = this;
    that.currentUser = new Wreddit.Models.User()
    Wreddit.Models.User.currentUser(document.cookie, function(resp){
      console.log(resp)
      if(resp.user){
        that.currentUser = new Wreddit.Models.User(resp.user)
        console.log(that.currentUser)
      }
      that._refreshNavBar(that.currentUser);
    })
  },




  _refreshNavBar: function (user){
    if(user.id){
      console.log("refreshing", user)
      $('#current_user_in_nav_bar').html(user.username);
      $('#main-nav-dropdown').html('<li><a href="#destroySession">Sign Out</a></li><li class="divider"></li><li><a href="#editSettings">Settings</a></li>');
    }else{
      console.log("refreshing nil user")
      $('#current_user_in_nav_bar').html("Account");
      $('#main-nav-dropdown').html('<li><a href="#newUser">Sign up</a></li><li><a href="#newSession">Log In</a></li>');
    }
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
    if (this._currentView) {
      this._currentView.remove();
    }
    this._currenView = view;
    this.$minorEl.show();
    this.$rootEl.hide();
    this.$minorEl.html(view.$el);
  },


})