Wreddit.Views.Wall = Backbone.View.extend({
  events: {
    'click button.close.tile-closer': 'closeTile',
    
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
  template: JST['wall/index'],
  addTile: function(tile, stealthAdd) {
    console.log('addtile')
    if(this.collection._isUnique(tile)){
      this.collection.add(tile);
      var renderedContent = JST['wall/tile']({
        tile: tile,
        // previousModel: this.collection.models[this.collection.models.length-2],
        wallName: this.wallName,
        stealthAdd: stealthAdd
      })
      this.$el.append(renderedContent);
      Wreddit.router.mason.addItems($('#'+tile.cid))

      // post append masonry stuff
      $('#'+tile.cid).hide();
      var imgLoad = imagesLoaded('#'+tile.cid)
      imgLoad.on( 'done', function(){
        // layoutLimited restricts the maximum number of layout() called per second
        // shows all tiles right before layout
        Wreddit.router.mason.layoutLimited($('#'+tile.cid));
      })
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
  initialize: function (options) {
    this.mason = options.mason;
    this.wallName = options.wallName;
    this.type = options.type;

    this.lastPos = 0;
    Cookie.add(options.type+'s', options.wallName)
    this.collection = new Wreddit.Collections.Tiles();

    // this.$el.addClass("wall "+this.wallName);
    // $('#allWalls').append(this.$el);

    $('#wall').html(this.$el);
    this.loading = false;
    this.temp = {};
    var that = this;


  },
})



