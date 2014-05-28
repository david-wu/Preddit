Wreddit.Views.Wall = Backbone.View.extend({
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
      connectWith: ".wall-link",
      placeholder: '#nothing',
      distance: 5,
      start: function(event, ui) {
        event.preventDefault;
      },
      receive: function(event, ui) {
        event.preventDefault;
      },
      stop: function (event, ui) {
        event.preventDefault();
        that._dragEvent(event, ui);
      },
    })

    $('.wall-link').sortable({
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
    var sentModel = window.Wreddit.router.subs[ui.item[0].classList[0]].collection.get(ui.item[0].id);
    var targetName = event.toElement.firstChild.data
    var targetView = window.Wreddit.router.feeds[event.toElement.firstChild.data].view;

    sentModel = new Wreddit.Models.Tile(sentModel.attributes);
    sentModel.set({sender_id: Wreddit.router.currentUser.get('id')});
    sentModel.attributes.target_name = targetName;
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
        if(allTiles.length > 200){
          window[that.wallName + 'msnry'].remove($('.tile').slice(0,25));
        }
      }
    });

  },
})



