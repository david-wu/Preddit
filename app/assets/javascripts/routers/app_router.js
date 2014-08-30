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
    this.$allWalls = $('#wall');
    this.$minorEl = $('#allOthers');
    this.$navBar = $('#navBar');
    this.subs = {};
    this.feeds = {};

    this.currentUser = new Wreddit.Models.User();
    this.navBar = new Wreddit.Views.NavBar({
      user: this.currentUser
    });
    this.$navBar.html(this.navBar.render().$el);

    this.navBar.appendWall('Aww','sub');
    this.navBar.appendWall('All','sub');
    this.navBar.appendWall('dawu','feed');
  },
  visitDefaultWall: function(){
    Wreddit.router.navigate('#r/Aww', {trigger:true});
  },
  visitSub: function(subName){
    subName = this.formatWallName(subName);
    if(!this.subs[subName]){
      this.subs[subName] = new Wreddit.Views.Wall({
        wallName: subName,
        type: 'sub',
      })
    }
    this._swapWall(this.subs[subName]);
    $('#subreddit-field').focus();
  },
  visitFeed: function(feedName){
    feedName = this.formatFeedName(feedName);
    if(!this.feeds[feedName]){
      this.feeds[feedName] = new Wreddit.Views.Wall({
        wallName: feedName,
        type: 'feed',
      })
    }
    this._swapWall(this.feeds[feedName]);
    $('#subreddit-field').focus();
  },
  signUp: function () {
    this.newUserView = new Wreddit.Views.SignUp({
      user: this.currentUser
    })
    this._swapView(this.newUserView);
    this.newUserView.render();
    this._refreshSession();
    $('#username-field').focus();
  },
  signIn: function () {
    this.newSessionView = new Wreddit.Views.SignIn({
      user: this.currentUser
    })
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
    // if(Cookie.get('feeds')){
    //   _.each(Cookie.get('feeds').split(','), function(subName){
    //     if(!that.feeds[subName]){
    //       that.feeds[subName] = new Wreddit.Views.Feed(subName, 'feed')
    //     }
    //   })
    // }
    // if(Cookie.get('subs')){
    //   _.each(Cookie.get('subs').split(','), function(subName){
    //     if(!that.subs[subName]){
    //       that.subs[subName] = new Wreddit.Views.Wall(subName, 'sub')
    //     }
    //   })
    // }

  },

  _swapWall: function (showWall){
    var that = this;

    // remember wall's lastPos, replaces html, moves back to lastPos
    if(this._currentWall){
      this._currentWall.onDom = false;
      this._currentWall.lastPos = $(window).scrollTop();
    }
    this.$allWalls.html(showWall.render().$el);
    showWall.mason.layout();
    $(window).scrollTop(showWall.lastPos);

    // loading should be kept true until number of loading images drops below 30
    clearInterval(this.autoLoader);
    this.autoLoader = setInterval(function(){
      if(showWall.mason.options.isOriginTop === true){
        if (!showWall.loading && $(window).scrollTop() >= ( $(document).height() -
        $(window).height()*5)){
          showWall.collection.getMore();
        }
      }else{
        if (!showWall.loading && $(window).scrollTop() <= $(window).height()*1){
          showWall.collection.getMore();
        }
      }
    }, 1000)
    showWall.onDom = true;
    this._currentWall = showWall;
  },
  _swapView: function (view){
    console.log("_swapView("+view+")")
    clearInterval(this.autoLoader);
    if (this._currentView) {
      this._currentView.remove();
    }
    this._currentView = view;
    // this.$minorEl.show();
    // this.$allWalls.hide();
    this.$allWalls.html(view.$el);
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
