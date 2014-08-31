Wreddit.Views.Wall = Backbone.View.extend({
  className: 'wall',
  template: JST['wall/index'],
  events: {
    'click button.close.tile-closer': 'closeTile',
  },
  initialize: function (options) {
    var that = this;
    this.wallName = options.wallName;
    this.type = options.type;
    this.lastPos = 0;
    this.loading = false;
    this.onDom = false;
    this.loadingImageCount = 0;
    this.mason = new Masonry('#wall', {
      itemSelector: '.tile',
      columnWidth: 360,
      transitionDuration: 0,
      isFitWidth: true,
      // isOriginTop: options.isOriginTop
    });
    this.collection = new Wreddit.Collections.Tiles([],{
      wallName: this.wallName,
      type: this.type
    });

    this.collection.getMore();
    this.listenTo(this.collection, "add", function(tile){
      if( !tile.get('over_18') || Wreddit.router.currentUser.get('permitNsfw')){
        that.addTile(tile);
      }
    });

    // checks feeds for new content

  },
  addTile: function(tile) {
    var that = this;
    this.loadingImageCount++;
    var $tile = $(JST['wall/tile']({
      tile: tile,
      wallName: this.wallName,
    }));
    this.$el.append($tile);

    // the problem here is that $tile consists of the tile and it's modal
    // giving a modal position absolute messes with z layout
    $tile = $('.tile.'+tile.cid)

    if(this.onDom){
      that.mason.addItems($tile)
      var imgLoad = imagesLoaded($tile)
      imgLoad.on( 'done', function(){
        if(that.onDom){
          that.loadingImageCount--;
          that.mason.layoutLimited($tile);
        }
      })
    }

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
    this.mason.layout();
  },
  render: function () {
    var that = this;

    
    this.$el.sortable({
      items: ".tile",
      tolerance: 'pointer',
      connectWith: ".nav-bar-feed-link.ui-sortable",
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
          'z-index': 10000000000000000,
        }, 100)
        $('#main-navbar').animate({
          height: '100%'
        }, 100)
        // debugger
        $(ui.item[0]).css("z-index", 1000000)
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
      return false;
      // collection = window.Wreddit.router.feeds[ui.item.context.get('class')].collection
    }
    var sentModel = collection.get(ui.item[0].id);
    // var sentModel = window.Wreddit.router.subs[ui.item[0].classList[0]].collection.get(ui.item[0].id);
    // var sentModel = window.Wreddit.router.subs[ui.item.context.get('class')].collection.get(ui.item[0].id);

    var targetName = event.toElement.firstChild.data


    // var targetView = window.Wreddit.router.feeds[event.toElement.firstChild.data].view;

    sentModel = new Wreddit.Models.Tile(sentModel.attributes);
    // debugger
    sentModel.set({sender_id: Wreddit.router.currentUser.get('id')});
    sentModel.attributes.target_name = targetName;
    sentModel.attributes.sender_name = Wreddit.router.currentUser.get('username');
    delete sentModel.attributes.id;
    delete sentModel.id;
    sentModel.set('viewed', false);
    sentModel.save([],{
      success: function(model, response){
      },
      error: function(model, response){
      }
    });

  },


})



