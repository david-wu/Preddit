Wreddit.Views.Wall = Backbone.View.extend({

  initialize: function (options) {
    var that = this;
    this.mason = new Masonry('#wall', {
      itemSelector: '.tile',
      columnWidth: 360,
      transitionDuration: 0,
      isFitWidth: true,
      // isOriginTop: false
    });
    this.wallName = options.wallName;
    this.type = options.type;
    this.lastPos = 0;
    this.loading = false;

    this.collection = new Wreddit.Collections.Tiles([],{
      wallName: this.wallName
    });
    this.collection.getMore();
    this.listenTo(this.collection, "add", function(tile){
      if( !tile.get('over_18') || Wreddit.router.currentUser.get('permitNsfw')){
        this.addTile(tile);
      }
    });

    Cookie.add(options.type+'s', options.wallName);
  },
  events: {
    'click button.close.tile-closer': 'closeTile',
  },
  template: JST['wall/index'],
  addTile: function(tile, stealthAdd) {
    var that = this;
    var renderedContent = JST['wall/tile']({
      tile: tile,
      wallName: this.wallName,
      stealthAdd: stealthAdd
    })
    this.$el.append(renderedContent);

    // post append masonry stuff
    var tileEl = $('.'+this.wallName+'.'+tile.cid);
    if(tileEl){
      that.mason.addItems(tileEl)
      var imgLoad = imagesLoaded(tileEl)
      imgLoad.on( 'done', function(){
        that.mason.layoutLimited(tileEl);
      })
    }
  },
  hide: function(){

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
    $('#wall').sortable({
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



