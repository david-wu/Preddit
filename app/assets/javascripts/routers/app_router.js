Wreddit.Routers.Tiles = Backbone.Router.extend({
  routes: {
    "": "visitDefaultWall",
    "r/:sub": "visitSub",
    "f/:feed": "visitFeed",
    "newUser": "signUp",
    "newSession": "signIn",
    "destroySession": "signOut",
    "editSettings": "editSettings",
    "viewAbout": "viewAbout",
  },
  initialize: function (options){
    var that = this;
    this.$otherViews = $('#otherViews');
    this.$allWalls = $('#wall');
    this.$navBar = $('#navBar');
    this.subs = {};
    this.feeds = {};

    this.currentUser = new Wreddit.Models.User(JSON.parse(Cookie.get("user")));
    this.navBar = new Wreddit.Views.NavBar({
      user: this.currentUser
    });
    this.$navBar.html(this.navBar.render().$el);
  },
  visitDefaultWall: function(){
    Wreddit.router.navigate('#r/Aww', {trigger:true});
  },
  visitSub: function(subName){
    subName = this._formatWallName(subName);
    if(!this.subs[subName]){
      this.navBar.appendWall(subName, 'sub');
      this.subs[subName] = new Wreddit.Views.Wall({
        wallName: subName,
        type: 'sub',
      })
    }
    this._swapWall(this.subs[subName]);
    $('#subreddit-field').focus();
  },
  visitFeed: function(feedName){

    feedName = this._formatFeedName(feedName);
    if(this.feeds[feedName]){
      this.feeds[feedName].remove();
    }else{
      this.navBar.appendWall(feedName, 'feed');
    }
    this.feeds[feedName] = new Wreddit.Views.Wall({
      wallName: feedName,
      type: 'feed',
    })
    this._swapWall(this.feeds[feedName]);
    $('#subreddit-field').focus();
  },
  signUp: function () {
    this.newUserView = new Wreddit.Views.SignUp({
      user: this.currentUser
    })
    this._swapView(this.newUserView);
    this.newUserView.render();
    $('#username-field').focus();
  },
  signIn: function () {
    this.newSessionView = new Wreddit.Views.SignIn({
      user: this.currentUser
    })
    this._swapView(this.newSessionView);
    this.newSessionView.render();
    $('#username-field').focus();
  },
  editSettings: function () {
    this.newSettingsView = new Wreddit.Views.Settings({})
    this._swapView(this.newSettingsView);
    this.newSettingsView.render();
    $('#email-input').focus();
  },
  viewAbout: function () {
    this.aboutView = new Wreddit.Views.About({})
    this._swapView(this.aboutView);
    this.aboutView.render();
    $('#subreddit-field').focus();
  },
  signOut: function () {
    this.currentUser.clear();
    this.navBar.render();
    this.$allWalls.html('');
    this.subs = {};
    this.feeds = {};
    Cookie.delete('user')
    Cookie.delete('subs')
    Cookie.delete('feeds')
    this.navigate('#newSession', {trigger:true});
    $('#username-field').focus();
  },
  _refreshSession: function (){
    // replace this with api
    if(Cookie.get('feeds')){
      _.each(Cookie.get('feeds').split(','), function(subName){
        if(!that.feeds[subName]){
          that.feeds[subName] = new Wreddit.Views.Feed(subName, 'feed')
        }
      })
    }
    if(Cookie.get('subs')){
      _.each(Cookie.get('subs').split(','), function(subName){
        if(!that.subs[subName]){
          that.subs[subName] = new Wreddit.Views.Wall(subName, 'sub')
        }
      })
    }
  },
  _swapWall: function (showWall){
    var that = this;
    this.$otherViews.hide();
    this.$allWalls.show();
    // remember wall's lastPos, replaces html, moves back to lastPos
    if(this._currentWall){
      this._currentWall.onDom = false;
      this._currentWall.lastPos = $(window).scrollTop();
      this.$allWalls.html('')
      this._currentWall.mason.layout();
    }
    this.$allWalls.html(showWall.render().$el);
    imagesLoaded(showWall.$el).on('done', function(){
      showWall.mason.layout();
      $(window).scrollTop(showWall.lastPos);
    });
    // debugger

    this._updateAutoLoader(showWall);
    this._currentWall = showWall;
  },
  _swapView: function (view){
    $(window).scrollTop(0);
    this.$otherViews.show();
    this.$allWalls.hide();
    console.log("_swapView("+view+")")
    this.$allWalls.html('');
    clearInterval(this.autoLoader);
    if (this._currentView) {
      this._currentView.remove();
    }
    this._currentView = view;
    this.$otherViews.html(view.render().$el);
  },
  _updateAutoLoader: function(showWall){
    clearInterval(this.autoLoader);
    this.autoLoader = setInterval(function(){
      if(showWall.mason.options.isOriginTop === true){
        if (!showWall.loading && $(window).scrollTop() >= ($(document).height() - $(window).height()*5)){
          showWall.collection.getMore();
        }
      }else{
        if (!showWall.loading && $(window).scrollTop() <= $(window).height()*1){
          showWall.collection.getMore();
        }
      }
    }, 1000)
    showWall.onDom = true;
  },
  _formatWallName: function (name){
    name = name.replace(/[^a-zA-Z]/g, '');
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    return name;
  },
  _formatFeedName: function (name){
    name = name.replace(/[^a-zA-Z]/g, '');
    return name;
  },
})
