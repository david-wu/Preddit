Wreddit.Views.NavBar = Backbone.View.extend({
  initialize: function(options){
    this.feeds = {};
    this.subs = {};
    this.$navBarEls = {};
    // this._initializeSearchBar();
    this.user = options.user;

    this.listenTo(this.user, "change", function(tile){
      this.render();
    });
  },
  template: JST['nav/bar'],
  render: function(){
    this.refreshUsers();
    var renderedContent = this.template({
      feeds: this.feeds,
      subs: this.subs,
      current_user: this.user.get('username')
    });
    this.$el.html(renderedContent)
    this._initializeSearchBar()
    return this;
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


