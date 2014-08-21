Wreddit.Routers.Tiles = Backbone.Router.extend({

  initialize: function (options){
    var that = this;
    this.$allWalls = $('#wall');
    this.$minorEl = $('#allOthers');
    this.$navBar = $('#navBar');
    this.subs = {};
    this.feeds = {};
    this.navBar = new Wreddit.Views.NavBar();
    this.$navBar.html(this.navBar.render().$el);

    this.mason = new Masonry( '#wall', {
     columnWidth: 360,
     transitionDuration: 0,
     isFitWidth: true,
     // isOriginTop: false
    });
    this.mason.on('layoutComplete', function(msn, laidOutItems){
      console.log(laidOutItems)
    })

    // limits rate layout is refreshed at
    this.masonTempTiles = [];
    this.mason.layoutLimited = function(tile){
      that.masonTempTiles.push(tile)
      clearTimeout(that.masonTimeout); 
      that.masonTimeout = setTimeout(function(){
        for (var i = 0; i < that.masonTempTiles.length; i++){
          that.masonTempTiles[i].show();
        }
        that.masonTempTiles = [];
        that.mason.layout();
        console.log('layout');
      }, 200);
    }

    // $('#wall').append('<div class="pan">asdf</div>')
    // $('#wall').append('<div class="pan">aswerdf</div>')
    // $('#wall').append('<div class="pan">astredf</div>')
    // $('#wall').append('<div class="pan">asrtydf</div>')
    // this.mason.appended(document.getElementsByClassName('pan'))
    // this.mason.options.transitionDuration = 0.4;

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
      this.subs[subName] = new Wreddit.Views.Wall({
        wallName: subName,
        type: 'sub',
        mason: this.mason,
      })
    }
    this._swapWall(this.subs[subName]);
    this.subs[subName].render();
    // this._refreshSession();
    $('#subreddit-field').focus();
  },
  visitFeed: function(feedName){
    feedName = this.formatFeedName(feedName);
    if(!this.feeds[feedName]){
      this.feeds[feedName] = new Wall(feedName, 'feed')
    }
    this._swapWall(this.feeds[feedName]);
    this.feeds[feedName].render();
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
    //remembers wall's lastPos
    if(this._currentWall){
      this._currentWall.lastPos = $(window).scrollTop();
    }

    //hide all walls, then show showWall
    // console.log("_swapWall("+showWall.name+")")
    // this.$minorEl.hide();
    // this.$allWalls.show();
    // subsArr = Object.keys(this.subs);
    // for(var $i = 0; $i < subsArr.length; $i++){
    //   this.subs[subsArr[$i]].$el.hide();
    // }
    // feedsArr = Object.keys(this.feeds);
    // for(var $i = 0; $i < feedsArr.length; $i++){
    //   this.feeds[feedsArr[$i]].$el.hide();
    // }

    // showWall.$el.show();
    // this.mason.layout();

    //moves screen position back to lastPos
    this._currentWall = showWall;
    $(window).scrollTop(showWall.lastPos);

    // reset autoLoader
    showWall.loading = true;
    showWall.loadMore();
    clearInterval(this.autoLoader);
    this.autoLoader = setInterval(function(){
      if (!showWall.loading && $(window).scrollTop() >= ( $(document).height() -
      $(window).height()*4)){
        showWall.loading = true;
        showWall.loadMore();
      }
      var allTiles = $('.tile');
      if(allTiles.length > 50){
        that.mason.remove($('.tile').slice(0,25));
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
