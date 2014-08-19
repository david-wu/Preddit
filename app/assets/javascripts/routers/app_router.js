Wreddit.Routers.Tiles = Backbone.Router.extend({

  initialize: function (options){
    this.$allWalls = $('#allWalls');
    this.$minorEl = $('#allOthers');
    this.$navBar = $('#navBar');
    this.subs = {};
    this.feeds = {};
    this.navBar = new Wreddit.Views.NavBar();
    this.$navBar.html(this.navBar.render().$el);
  },
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
  visitDefaultWall: function(){
    Wreddit.router.navigate('#r/Aww', {trigger:true});
  },
  visitSub: function(subName){
    subName = this.formatWallName(subName);
    if(!this.subs[subName]){
      this.subs[subName] = new Wall(subName, 'sub')
    }
    this._swapWall(this.subs[subName]);
    this.subs[subName].view.render();
    this._refreshSession();
    $('#subreddit-field').focus();
  },
  visitFeed: function(feedName){
    feedName = this.formatFeedName(feedName);
    if(!this.feeds[feedName]){
      this.feeds[feedName] = new Wall(feedName, 'feed')
    }
    this._swapWall(this.feeds[feedName]);
    this.feeds[feedName].view.render();
    this._refreshSession();
    $('#subreddit-field').focus();
  },
  signUp: function () {
    this.newUserView = new Wreddit.Views.SignUp({})
    this._swapView(this.newUserView);
    this.newUserView.render();
    this._refreshSession();
    $('#username-field').focus();
  },
  signIn: function () {
    this.newSessionView = new Wreddit.Views.SignIn({})
    this._swapView(this.newSessionView);
    this.newSessionView.render();
    this._refreshSession();
    $('#username-field').focus();
  },
  editSettings: function () {
    this.newSettingsView = new Wreddit.Views.Settings({})
    this._swapView(this.newSettingsView);
    this.newSettingsView.render();
    this._refreshSession();
    $('#email-input').focus();
  },
  viewAbout: function () {
    this.aboutView = new Wreddit.Views.About({})
    this._swapView(this.aboutView);
    this.aboutView.render();
    this._refreshSession();
    $('#subreddit-field').focus();
  },
  signOut: function () {
    this.currentUser = new Wreddit.Models.User();
    this.navBar.refreshNavBar(this.currentUser);
    this.$allWalls.html('');
    this.$minorEl.html('');
    $('#allWall-links').html('')
    $('#allFeed-links').html('')
    this.subs = {};
    this.feeds = {};
    Cookie.delete('sessionToken')
    Cookie.delete('subs')
    Cookie.delete('feeds')
    this.navigate('#newSession', {trigger:true});
    this._refreshSession();
    $('#username-field').focus();
  },
  _refreshSession: function (){
    var that = this;
    if(!this.currentUser){
      this.currentUser = new Wreddit.Models.User()
    }
    Wreddit.Models.User.currentUser(document.cookie, function(response){
      if(response.id){
        that.currentUser = new Wreddit.Models.User(response);
      }else{
        console.log("Not valid login");
      }
      that.navBar.refreshNavBar(that.currentUser);
    })

    // replace this with api
    if(Cookie.get('feeds')){
      _.each(Cookie.get('feeds').split(','), function(subName){
        if(!that.feeds[subName]){
          that.feeds[subName] = new Wall(subName, 'feed')
        }
      })
    }
    if(Cookie.get('subs')){
      _.each(Cookie.get('subs').split(','), function(subName){
        if(!that.subs[subName]){
          that.subs[subName] = new Wall(subName, 'sub')
        }
      })
    }

  },

  _swapWall: function (showWall){

    //remembers wall's lastPos
    if(this._currentWall){
      this._currentWall.lastPos = $(window).scrollTop();
    }

    //hide all walls, then show showWall
    console.log("_swapWall("+showWall.name+")")
    this.$minorEl.hide();
    this.$allWalls.show();
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
    this._currentWall = showWall;
    $(window).scrollTop(showWall.lastPos);

    // reset autoLoader
    showWall.view.loading = true;
    showWall.view.loadMore();
    clearInterval(this.autoLoader);
    this.autoLoader = setInterval(function(){
      if (!showWall.view.loading && $(window).scrollTop() >= ( $(document).height() -
      $(window).height()*2)){
        showWall.view.loading = true;
        showWall.view.loadMore();
      }
      var allTiles = $('.tile');
      if(allTiles.length > 300){
        window[showWall.view.wallName + 'msnry'].remove($('.tile').slice(0,25));
      }
    }, 1000)
  },
  _swapView: function (view){
    console.log("_swapView("+view+")")
    clearInterval(this.autoLoader);
    if (this._currentView) {
      this._currentView.remove();
    }
    this._currentView = view;
    this.$minorEl.show();
    this.$allWalls.hide();
    this.$minorEl.html(view.$el);
  },
  formatWallName: function (name){
    name = name.replace(/[^a-zA-Z]/g, '');
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    return name;
  },
  formatFeedName: function (name){
    name = name.replace(/[^a-zA-Z]/g, '');
    return name;
  },
})
