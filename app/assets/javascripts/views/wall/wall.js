Wreddit.Views.Wall = Backbone.View.extend({
  events: {
    'click button.close.tile-closer': 'closeTile',
  },
  closeTile: function(event){
    var wallName = event.toElement.parentElement.getAttribute('wall-name')
    var tileId = event.toElement.parentElement.getAttribute('id')
    var modelId = event.toElement.parentElement.getAttribute('model-id')
    $('#'+tileId).remove();

    window[wallName + 'msnry'].remove($('#'+tileId))
    window[wallName + 'msnry'].layout();

    var model = Wreddit.router.feeds[wallName].collection.get(modelId);

    if(model && Wreddit.router.currentUser.get('username') === wallName){
      model.destroy();
    }

  },
  template: JST['wall/index'],
  addTile: function(tile, stealthAdd) {
    if(this.collection._isUnique(tile)){
      this.collection.add(tile);
      var renderedContent = JST['wall/tile']({
        tile: tile,
        wallName: this.wallName,
        stealthAdd: stealthAdd
      })
      this.$el.append(renderedContent);
    }
  },
  loadMore: function(){
    this.loading = true;
    var that = this;
    if(this.type === 'sub'){
      this.collection.getMore(this.wallName,
        function(newTiles){
          that.loading = false;
          for(var $i = 0; $i < newTiles.length; $i++){
            that.addTile(newTiles[$i], false)
          }
      })
    } else if(this.type === 'feed'){
      this.collection.fetch(this.wallName,
        function(newTiles){

          that.loading = false;
          for(var $i = 0; $i < newTiles.length; $i++){
            var newTile = new Wreddit.Models.Tile(newTiles[$i])
            that.addTile(newTile, false)
          }
      })
    }
  },
  render: function () {
    var that = this;

    this.collection.each(function(tile){
      that.addTile(tile, false);
    })

    $('.wall.'+this.wallName).sortable({
      items: ".tile",
      tolerance: 'pointer',
      connectWith: "nav-bar-feed-link.wall-link.feed.ui-sortable",
      placeholder: '#nothing',
      distance: 5,
      start: function(event, ui) {


        // that.temp.tempWallLinks = $('#allWall-links').html()
        $('#allWall-links').animate({
          opacity: 0,
        }, 100)
        $('#subreddit-field').animate({
          opacity: 0,
        }, 100)
        $('#nav-bar-dropdown-menu').animate({
          opacity: 0,
        }, 100)
        $('.nav-bar-feed-link.wall-link.feed').animate({
          position: 'relative',
          top: 150,
          'font-size': 75,
          margin: 75,
        }, 100)
        $('#main-navbar').animate({
          height: '100%'
        }, 100)
        $('.nav-bar-feed-link.wall-link.sub.ui-sortable').animate({
          display: 'none',
        })


      },
      receive: function(event, ui) {

      },
      stop: function (event, ui) {
        event.preventDefault();

        // $('#allWall-links').html(that.temp.tempWallLinks)
        $('#allWall-links').animate({
          opacity: 1,
        }, 400)
        $('#subreddit-field').animate({
          opacity: 1,
        }, 400)
        $('#nav-bar-dropdown-menu').animate({
          opacity: 1,
        }, 400)
        $('.nav-bar-feed-link.wall-link.feed').animate({
          position: 'relative',
          top: 0,
          'font-size': 14,
          margin: 0,
        }, 400)
        $('#main-navbar').animate({
          height: 50,
        }, 400)
        that._dragEvent(event, ui);
      },
    })

    $('.wall-link').sortable({
      items: ".wall-link.feed",
      tolerance: 'pointer',
      connectWith: ".wall-link.feed",
      start: function(event, ui) {
        event.preventDefault;
      },
      receive: function(event, ui) {
        event.preventDefault;
      },
      stop: function(event, ui) {
        event.preventDefault;
      },

    })

    return this;
  },
  _dragEvent: function(event, ui){

    var collection = ''
    if(window.Wreddit.router.subs[ui.item.context.getAttribute('wall-name')]){
      collection = window.Wreddit.router.subs[ui.item.context.getAttribute('wall-name')].collection
    }else{
      collection = window.Wreddit.router.feeds[ui.item.context.getAttribute('wall-name')].collection
    }
    if(!collection){
      collection = window.Wreddit.router.feeds[ui.item.context.get('class')].collection
    }
    var sentModel = collection.get(ui.item[0].id);

    // var sentModel = window.Wreddit.router.subs[ui.item[0].classList[0]].collection.get(ui.item[0].id);
    // var sentModel = window.Wreddit.router.subs[ui.item.context.get('class')].collection.get(ui.item[0].id);
    var targetName = event.toElement.firstChild.data
    var targetView = window.Wreddit.router.feeds[event.toElement.firstChild.data].view;

    sentModel = new Wreddit.Models.Tile(sentModel.attributes);
    sentModel.set({sender_id: Wreddit.router.currentUser.get('id')});
    sentModel.attributes.target_name = targetName;
    sentModel.attributes.sender_name = Wreddit.router.currentUser.get('username');
    delete sentModel.attributes.id;
    delete sentModel.id;
    targetView.addTile(sentModel, true);

    sentModel.save([],{
      success: function(model, response){
        console.log(response.tile)
      },
      error: function(model, response){
        console.log(response)
      }
    });

  },
  initialize: function (options) {
    this.type = options.type;
    this.wallName = options.wallName;
    this.loading = false;
    this.temp = {};
    var that = this;

    this.$el.html(JST['wall/mason']({
      wallName: this.wallName,
      view: this,
    }))

    // enable infinite scroll
    $(window).scroll(function() {
      if(Wreddit.router._currentWall.view === that){
        if (!that.loading && $(window).scrollTop() >= ( $(document).height() -
        $(window).height()*1.5)){
          that.loading = true;
          that.loadMore();
        }
        var allTiles = $('.tile');
        if(allTiles.length > 300){
          window[that.wallName + 'msnry'].remove($('.tile').slice(0,25));
        }
      }
    });

  },
})



