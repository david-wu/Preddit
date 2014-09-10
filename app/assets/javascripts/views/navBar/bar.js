Wreddit.Views.NavBar = Backbone.View.extend({
  initialize: function(options){
    var that = this;
    this.feeds = {};
    this.subs = {};
    this.$navBarEls = {};

    this.user = options.user;
    this.users = new Wreddit.Collections.Users();
    this.openWalls = options.openWalls;

    this.listenTo(this.user, "change", function(tile){
      this.renderDropDown();
      this.openWalls.fetch();
      this.users.fetch();
    });
    this.listenTo(this.users, "sync", function(tile){
      this.updateUsers();
    });
    this.listenTo(this.openWalls, "sync", function(tile){
      this.renderWallLinks();
    });


    // s
    setInterval(function(){
      that.users.fetch();
    },1000)
    // 
  },
  refresh: function(){
    this.user.fetch();
    this.users.fetch();
    this.openWalls.fetch();
  },
  template: JST['nav/bar'],
  render: function(){
    var that = this;
    this.$el.html(this.template())

    this.openWalls.fetch();
    this.users.fetch();
    this.user.getCurrentUser()
    this.renderDropDown();

    this._initializeSearchBar()
    return this;
  },
  updateUsers: function (){
    var that = this;
    this.users.each(function(user){
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
  renderDropDown: function(){
    this.$el.find('#nav-bar-dropdown-menu').html(JST['nav/dropDown']({
      current_user: this.user
    }));

  },
  // refresh wall links thing
  renderWallLinks: function(){
    var that = this
    $('#allWall-links').html('');
    $('#allFeed-links').html('');
    this.openWalls.forEach(function(openWall){
      if(openWall.get('is_feed')){
        that.appendWall(openWall.get('name'), 'feed')        
      }else{
        that.appendWall(openWall.get('name'), 'sub')
      }
    })
  },
  appendWall: function(wallName, type){
    if (type === 'sub'){
      var $parentOfLinkToWall = $('#allWall-links')
      var typeId = 'r'
      var appendOrPrepend = 'append'
    } else if (type === 'feed'){
      var $parentOfLinkToWall = $('#allFeed-links')
      var typeId = 'f'
      var appendOrPrepend = 'prepend'
    }
    var $barLink = $(JST['nav/barLink']({
      wallName: wallName,
      type: type,
      typeId: typeId,
    }));

    $parentOfLinkToWall[appendOrPrepend]($barLink);
    this.$navBarEls[wallName] = $('#_link'+wallName);
    return $('#_link'+wallName);
  },

  _initializeSearchBar: function(){
    var that = this;
    this.data = [
      { label: "Funny", category: "Subreddits" },
      { label: "Pics", category: "Subreddits" },
      { label: "All", category: "Subreddits" },
      { label: "Aww", category: "Subreddits" },
      { label: "Gifs", category: "Subreddits" },
      { label: "Movies", category: "Subreddits" },
      { label: "Sports", category: "Subreddits" },
      { label: "Gaming", category: "Subreddits" },
      { label: "EarthPorn", category: "Subreddits" },
      { label: "MildlyInteresting", category: "Subreddits" },
      { label: "Sloths", category: "Subreddits" },
      { label: "Cats", category: "Subreddits" },
      { label: "Dogs", category: "Subreddits" },
      { label: "GetMotivated", category: "Subreddits" },
      { label: "Food", category: "Subreddits" },
      { label: "OldSchoolCool", category: "Subreddits" },
      { label: "DataIsBeautiful", category: "Subreddits" },
      { label: "Art", category: "Subreddits" },
      { label: "Space", category: "Subreddits" },
      { label: "PhotoshopBattles", category: "Subreddits" },
      { label: "Creepy", category: "Subreddits" },
      { label: "WoahDude", category: "Subreddits" },
      { label: "Unexpected", category: "Subreddits" },
      { label: "ReactionGifs", category: "Subreddits" },
      { label: "FirstWorldAnarchists", category: "Subreddits" },
      { label: "HistoryPorn", category: "Subreddits" },
      { label: "AdviceAnimals", category: "Subreddits" },
      { label: "WTF", category: "Subreddits" },
      { label: "LeagueOfLegends", category: "Subreddits" },
      { label: "PcMasterRace", category: "Subreddits" },
      { label: "Pokemon", category: "Subreddits" },
      { label: "Trees", category: "Subreddits" },
      { label: "GameOfThrones", category: "Subreddits" },
    ];

    // clean this up
    $(document).ready(function(){
      $('#subreddit-field').keyup(function (event){

        if(event.which === 13){
          // event.preventDefault();
          $('.ui-autocomplete.ui-front').hide();
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
        autoFocus: false,
      });

      $('.ui-autocomplete.ui-front').css("zIndex", 10000);

    })
  },

})

Wreddit.Views.NavBar.CreateNavEl = function(){
  
}


