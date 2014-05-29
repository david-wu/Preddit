Wreddit.Routers.Tiles = Backbone.Router.extend({
  initialize: function (options){
    var that = this;
    this.$rootEl = options.rootEl;
    this.$minorEl = options.minorEl;
    this.subs = {};
    this.feeds = {};
    this.data = [
      { label: "Funny", category: "Subreddits" },
      { label: "Pics", category: "Subreddits" },
      { label: "AskReddit", category: "Subreddits" },
      { label: "IAmA", category: "Subreddits" },
      { label: "News", category: "Subreddits" },
      { label: "All", category: "Subreddits" },
      { label: "TodayILearned", category: "Subreddits" },
      { label: "worldNews", category: "Subreddits" },
      { label: "Aww", category: "Subreddits" },
      { label: "Gifs", category: "Subreddits" },
      { label: "Videos", category: "Subreddits" },
      { label: "ExplainLikeImFive", category: "Subreddits" },
      { label: "Music", category: "Subreddits" },
      { label: "Movies", category: "Subreddits" },
      { label: "Sports", category: "Subreddits" },
      { label: "Television", category: "Subreddits" },
      { label: "Gaming", category: "Subreddits" },
      { label: "Science", category: "Subreddits" },
      { label: "EarthPorn", category: "Subreddits" },
      { label: "AskScience", category: "Subreddits" },
      { label: "Books", category: "Subreddits" },
      { label: "UpliftingNews", category: "Subreddits" },
      { label: "MildlyInteresting", category: "Subreddits" },
      { label: "Sloths", category: "Subreddits" },
      { label: "Cats", category: "Subreddits" },
      { label: "Dogs", category: "Subreddits" },
    ];

    $(document).ready(function(){

      $('#subreddit-field').keypress(function (event){
        if(event.which === 13){
          event.preventDefault();
          var input = $('#subreddit-field').val();
          var isUser = false
          for(var i = 0; i < that.data.length; i++){
            if(that.data[i].category==='Users' && that.data[i].label === input){
              isUser = true;
            }
          }
          if(isUser){
            Wreddit.router.navigate('#f/'+$('#subreddit-field').val(), {trigger: true})
          }else{
            Wreddit.router.navigate('#r/'+$('#subreddit-field').val(), {trigger: true})
          }
          $('#subreddit-field').val('');
        }
      })

      $( "#subreddit-field" ).catcomplete({
        delay: 0,
        source: that.data,
        autoFocus: true,
      });

      $('.ui-autocomplete.ui-front').css("zIndex", 1000000);

    })

  },
  routes: {
    "": "visitDefaultWall",
    "r/:sub": "visitSubWall",
    "f/:feed": "visitFeed",
    "newUser": "signUp",
    "newSession": "signIn",
    "destroySession": "signOut",
    "editSettings": "editSettings",
    "viewAbout": "viewAbout"
  },
  visitDefaultWall: function(){
    Wreddit.router.navigate('#r/aww', {trigger:true});
  },
  visitSubWall: function(subName){
    if(!this.subs[subName]){
      this._createWall(subName, 'sub');
      this.subs[subName].view.render();
    }
    this._swapWall(this.subs[subName]);
    this._refreshSession();
  },
  visitFeed: function(feedName){
    if(!this.feeds[feedName]){
      this._createWall(feedName, 'feed');
      this.feeds[feedName].view.render();
    }
    this._swapWall(this.feeds[feedName]);
    this._refreshSession();
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
    "sessionToken=a; expires=Thu, 18 Dec 2000 12:00:00 GMT; path=/";
    this.currentUser = new Wreddit.Models.User();
    this._refreshNavBar(this.currentUser);
    $('#allWall-links').html('')
    $('#allFeed-links').html('')
    this.$rootEl.html('');
    this.$minorEl.html('');
    this.subs = {};
    this.feeds = {};
  },
  editSettings: function () {
    this.newSettingsView = new Wreddit.Views.Settings({})
    this._swapView(this.newSettingsView);
    this.newSettingsView.render();
  },
  viewAbout: function () {
    this.aboutView = new Wreddit.Views.About({})
    this._swapView(this.aboutView);
    this.aboutView.render();
  },
  _refreshSession: function (){
    var that = this;
    if(!that.currentUser){
      that.currentUser = new Wreddit.Models.User()
    }
    Wreddit.Models.User.currentUser(document.cookie, function(user){
      if(user.id){
        that.currentUser = new Wreddit.Models.User(user)
      }
      that._refreshNavBar(that.currentUser);
    })
  },
  _refreshNavBar: function (user){
    // this._refreshSearchBars();
    this._refreshUsers();
    if(user.id){
      $('#current_user_in_nav_bar').html(user.get('username'));
      $('#main-nav-dropdown').html('<li><a href="#f/'+user.get('username')+'">My Wall</a></li><li><a href="#destroySession">Sign Out</a></li><li class="divider"></li><li><a href="#editSettings">Settings</a></li><li><a href="#viewAbout">About</a></li>');
    }else{
      $('#current_user_in_nav_bar').html("Account");
      $('#main-nav-dropdown').html('<li><a href="#newUser">Sign up</a></li><li><a href="#newSession">Log In</a></li><li class="divider"></li><li><a href="#viewAbout">About</a></li>');
    }
  },
  _refreshUsers: function (){
    var that = this;
    this.users = new Wreddit.Collections.Users();
    this.users.fetch({
      success: function(users){

        users.each(function(user){
          var repeat = false;
          for(var i = 0; i < that.data.length; i++){
            if(that.data[i].label === user.get('username')){
              repeat = true;
            }
          }
          if(!repeat){
            that.data.push({label: user.get('username'), category: "Users"})
          }
        })
      },
      error: function(){
      }
    });
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
    $parentOfLinkToWall[appendOrPrepend]('<li id=_link'+wallName+'><a href="#'+typeId+wallName+'" class="nav-bar-feed-link wall-link '+type+'"><div id="higlight-box">'+wallName+'</div></a></li>');
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
    if(showWall.lastPos){
      $('html, body').animate({
          scrollTop: showWall.lastPos,
          scrollLeft: 0
      }, 0);
    }

    //call loadMore() until page is full
    var attemptsLeft = 7;
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
    //COPYPASTA
  _refreshSearchBars: function (){
    var matcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            // the typeahead jQuery plugin expects suggestions to a
            // JavaScript object, refer to typeahead docs for more info
            matches.push({ value: str });
          }
        });

        cb(matches);
      };
    };

    var users = ['david', 'dawu', 'premium']

    $('#subreddit-field').typeahead({
      minLength: 1,
      highlight: true,
      hint: true,
    },
    {
      name: 'users',
      displayKey: 'value',
      source: matcher(users)
    })
  },
})