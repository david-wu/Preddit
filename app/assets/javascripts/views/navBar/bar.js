Wreddit.Views.NavBar = Backbone.View.extend({
  initialize: function(){
    this.feeds = {};
    this.subs = {};
    this.$navBarEls = {};
    this._initializeSearchBar();
  },
  template: JST['nav/bar'],
  render: function(){
    var renderedContent = this.template({
      feeds: this.feeds,
      subs: this.subs,
      current_user: 'george'
    });
    this.$el.html(renderedContent)
    return this;
  },
  refreshNavBar: function (user){
    this.refreshUsers();
    if(user.id){
      $('#current_user_in_nav_bar').html(user.get('username'));
      $('#main-nav-dropdown').html('<li><a href="#f/'+user.get('username')+'">My Wall</a></li><li><a href="#destroySession">Sign Out</a></li><li class="divider"></li><li><a href="#editSettings">Settings</a></li><li><a href="#viewAbout">About</a></li>');
    }else{
      $('#current_user_in_nav_bar').html("Account");
      $('#main-nav-dropdown').html('<li><a href="#newUser">Sign up</a></li><li><a href="#newSession">Log In</a></li><li class="divider"></li><li><a href="#viewAbout">About</a></li>');
    }
  },
  refreshUsers: function (){
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
  appendWall: function(wallName, type){
    if (type === 'sub'){
      var $parentOfLinkToWall = $('#allWall-links')
      var typeId = 'r/'
      var appendOrPrepend = 'append'
    } else if (type === 'feed'){
      var $parentOfLinkToWall = $('#allFeed-links')
      var typeId = 'f/'
      var appendOrPrepend = 'prepend'
    }
    $parentOfLinkToWall[appendOrPrepend](

      '<li id=_link'+wallName+
    ' class="nav-bar-'+type+
    '-link ui-sortable"><a href="#'+typeId+wallName+'" class="wall-link">'+wallName+'</a></li>');
    this.$navBarEls[wallName] = $('#_link'+wallName);
    return $('#_link'+wallName);
  },

  _initializeSearchBar: function(){
    var that = this;
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

})




