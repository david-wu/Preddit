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
      { label: "InternetIsBeautiful", category: "Subreddits" },
      { label: "GetMotivated", category: "Subreddits" },
      { label: "Food", category: "Subreddits" },
      { label: "NoSleep", category: "Subreddits" },
      { label: "OldSchoolCool", category: "Subreddits" },
      { label: "TwoXChromosomes", category: "Subreddits" },
      { label: "LifeProTips", category: "Subreddits" },
      { label: "Futurology", category: "Subreddits" },
      { label: "WritingPrompts", category: "Subreddits" },
      { label: "DataIsBeautiful", category: "Subreddits" },
      { label: "listentothis", category: "Subreddits" },
      { label: "DIY", category: "Subreddits" },
      { label: "Jokes", category: "Subreddits" },
      { label: "Showerthoughts", category: "Subreddits" },
      { label: "Art", category: "Subreddits" },
      { label: "Gadgets", category: "Subreddits" },
      { label: "PersonalFinance", category: "Subreddits" },
      { label: "History", category: "Subreddits" },
      { label: "Philosophy", category: "Subreddits" },
      { label: "Fitness", category: "Subreddits" },
      { label: "Tifu", category: "Subreddits" },
      { label: "Space", category: "Subreddits" },
      { label: "PhotoshopBattles", category: "Subreddits" },
      { label: "Documentaries", category: "Subreddits" },
      { label: "Creepy", category: "Subreddits" },
      { label: "NotTheOnion", category: "Subreddits" },
      { label: "WoahDude", category: "Subreddits" },
      { label: "Unexpected", category: "Subreddits" },
      { label: "ReactionGifs", category: "Subreddits" },
      { label: "FirstWorldAnarchists", category: "Subreddits" },
      { label: "FoodPorn", category: "Subreddits" },
      { label: "HistoryPorn", category: "Subreddits" },
      { label: "AdviceAnimals", category: "Subreddits" },
      { label: "WTF", category: "Subreddits" },
      { label: "LeagueOfLegends", category: "Subreddits" },
      { label: "TrollXChromosomes", category: "Subreddits" },
      { label: "DotA2", category: "Subreddits" },
      { label: "PcMasterRace", category: "Subreddits" },
      { label: "Pokemon", category: "Subreddits" },
      { label: "Trees", category: "Subreddits" },
      { label: "4chan", category: "Subreddits" },
      { label: "GameOfThrones", category: "Subreddits" },
    ];

    $(document).ready(function(){

      $('#subreddit-field').keypress(function (event){
        if(event.which === 13){
          event.preventDefault();
          var input = $('#subreddit-field').val();
          var isUser = false;
          for(var i = 0; i < that.data.length; i++){
            if(that.data[i].category === 'Users' && that.data[i].label === input){
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

      $('.ui-autocomplete.ui-front').css("zIndex", 10000);

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
    this.router.navigate('#r/aww', {trigger:true});
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
  signOut: function () {
    document.cookie =
    "sessionToken=a; expires=Thu, 18 Dec 2000 12:00:00 GMT; path=/";
    this.currentUser = new Wreddit.Models.User();
    this._refreshNavBar(this.currentUser);
    this.$rootEl.html('');
    this.$minorEl.html('');
    $('#allWall-links').html('')
    $('#allFeed-links').html('')
    this.subs = {};
    this.feeds = {};
    this.navigate('#newSession', {trigger:true});
  },

  _refreshSession: function (){
    var that = this;
    if(!this.currentUser){
      this.currentUser = new Wreddit.Models.User()
    }
    Wreddit.Models.User.currentUser(document.cookie, function(user){
      if(user.id){
        that.currentUser = new Wreddit.Models.User(user)
      }else{
        console.log('not a valid user')
      }
      that._refreshNavBar(that.currentUser);
    })
  },
  _refreshNavBar: function (user){
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
    wall.lastPos = 0;
    wall.name = wallName;
    wall.collection = new Wreddit.Collections.Tiles();
    wall.view = new Wreddit.Views.Wall({
      collection: wall.collection,
      tagName: "div class='wall "+wallName+"'",
      wallName: wallName,
      type: type
    });
    $('#allWalls').append(wall.view.$el);
    $parentOfLinkToWall[appendOrPrepend]('<li id=_link'+wallName+
    '><a href="#'+typeId+wallName+'" class="nav-bar-feed-link wall-link '+type+
    '">'+wallName+'</a></li>');
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

})