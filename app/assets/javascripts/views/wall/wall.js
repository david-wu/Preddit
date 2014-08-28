Wreddit.Views.Wall = Backbone.View.extend({
  className: 'wall',
  initialize: function (options) {
    var that = this;
    this.mason = new Masonry('#wall', {
      itemSelector: '.tile',
      columnWidth: 360,
      transitionDuration: 0,
      isFitWidth: true,
      // isOriginTop: options.isOriginTop
    });
    this.wallName = options.wallName;
    this.type = options.type;
    this.lastPos = 0;
    this.loading = false;
    this.onDom = false;

    this.collection = new Wreddit.Collections.Tiles([],{
      wallName: this.wallName,
      type: this.type
    });
    this.collection.getMore();
    this.listenTo(this.collection, "add", function(tile){
      // should pass user's settings in as values
      if( !tile.get('over_18') || Wreddit.router.currentUser.get('permitNsfw')){
        this.addTile(tile);
      }
    });
  },
  events: {
    'click button.close.tile-closer': 'closeTile',
  },
  template: JST['wall/index'],
  addTile: function(tile) {
    var that = this;
    var $tile = $(JST['wall/tile']({
      tile: tile,
      wallName: this.wallName,
    }));

    this.$el.append($tile);
    $tile = $('.tile.'+tile.cid)
    // post append masonry stuff
    // tileEl will only have something if this.$el is on the dom
    // just keep a boolean attribute "onDom"
    // currently checking to see if I should attach imgloaded listener
    // should be checking after image is loaded

    // check what happens if i add items not on DOM to mason
    // it might not need loaded images until layout()
    if(this.onDom){
      that.mason.addItems($tile)
      var imgLoad = imagesLoaded($tile)
      imgLoad.on( 'done', function(){
        if(that.onDom){
          // layoutLimited actually also has a slight delay
          that.mason.layoutLimited($tile);
        }
      })
    }

  },
  render: function () {
    var that = this;

    // this.mason.destroy();
    // that.mason = new Masonry('#wall', {
    //   itemSelector: '.tile',
    //   columnWidth: 360,
    //   transitionDuration: 0,
    //   isFitWidth: true,
    //   // isOriginTop: false
    // });
    // this.collection.each(function(tile){
    //   that.addTile(tile, false);
    // })
    this.$el.sortable({
    // $('.wall.'+this.wallName).sortable({
      items: ".tile",
      tolerance: 'pointer',
      connectWith: "nav-bar-feed-link.ui-sortable",
      placeholder: '#nothing',
      distance: 5,
      start: function(event, ui) {
        // hide non-feeds
        $('#allWall-links').animate({
          opacity: 0,
        }, 100)
        $('#subreddit-field').animate({
          opacity: 0,
        }, 100)
        $('#nav-bar-dropdown-menu').animate({
          opacity: 0,
        }, 100)
        // expand nav-bar
        $('.nav-bar-feed-link').css({
          position: 'relative',
          top: 150,
          'font-size': 40,
          margin: 75,
          'line-height': 'normal',
        }, 100)
        $('#main-navbar').animate({
          height: '100%'
        }, 100)
      },
      receive: function(event, ui) {

      },
      stop: function (event, ui) {
        event.preventDefault();

        // show non-feeds
        $('#allWall-links').animate({
          opacity: 1,
        }, 400)
        $('#subreddit-field').animate({
          opacity: 1,
        }, 400)
        $('#nav-bar-dropdown-menu').animate({
          opacity: 1,
        }, 400)
        // shrink nav-bar
        $('.nav-bar-feed-link').animate({
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

    $('#main-navbar').sortable({
      items: ".wall-link",
      tolerance: 'pointer',
      connectWith: ".wall-link",
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
    var originTile = ''
    var targetCollection = ''
    var wallName = ui.item.context.getAttribute('wall-name');
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
      },
      error: function(model, response){
      }
    });

  },
  closeTile: function(event){
    var wallName = event.toElement.parentElement.getAttribute('wall-name')
    var tileId = event.toElement.parentElement.getAttribute('id')
    var modelId = event.toElement.parentElement.getAttribute('model-id')
    $('#'+tileId).remove();

    // window[wallName + 'msnry'].remove($('#'+tileId))
    // window[wallName + 'msnry'].layout();

    var model = Wreddit.router.feeds[wallName].collection.get(modelId);

    if(model && Wreddit.router.currentUser.get('username') === wallName){
      model.destroy();
    }

  },

})



