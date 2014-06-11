Wreddit.Routers.Tiles = Backbone.Router.extend({

  _formatWallName: function (name){
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    return name;
  },
  initialize: function (options){
    this.$rootEl = options.rootEl;
    this.$minorEl = options.minorEl;
    this.subs = {};
    this.feeds = {};
    this.navBar = new NavBar();
  },
  routes: {
    "": "visitDefaultWall",
    "r/:sub": "visitSubWall",
    "f/:feed": "visitFeed",
    "newUser": "signUp",
    "newSession": "signIn",
    "destroySession": "signOut",
    "editSettings": "editSettings",
    "viewAbout": "viewAbout",
  },
  visitDefaultWall: function(){
    Wreddit.router.navigate('#r/All', {trigger:true});
  },
  visitSubWall: function(subName){
    subName = this._formatWallName(subName);
    if(!this.subs[subName]){
      this.subs[subName] = new Wall(subName, 'sub')
    }
    this._swapWall(this.subs[subName]);
    this.subs[subName].view.render();
    this._refreshSession();
    $('#subreddit-field').focus();
  },
  visitFeed: function(feedName){
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
    // document.cookie =
    // "sessionToken=a; expires=Thu, 18 Dec 2000 12:00:00 GMT; path=/";
    this.currentUser = new Wreddit.Models.User();
    this.navBar.refreshNavBar(this.currentUser);
    this.$rootEl.html('');
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
    if(this._currentWall){
      this._currentWall.lastPos = $(window).scrollTop();
    }
    this._currentWall = showWall;
    $(window).scrollTop(showWall.lastPos);

    //call loadMore() until page is full
    var attemptsLeft = 4;
    function initialLoadMore () {
      attemptsLeft--;
      if (attemptsLeft <= 0 || $(document).height() > $(window).height()*1.5) {
        return false;
      } else if(!showWall.view.loading){
        showWall.view.loading = true;
        showWall.view.loadMore();
      }
      window.setTimeout(initialLoadMore, 1000)
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
