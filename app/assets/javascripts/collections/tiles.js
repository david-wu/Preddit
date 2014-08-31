Wreddit.Collections.Tiles = Backbone.Collection.extend({
  model: Wreddit.Models.Tile,
  initialize: function (models, options){
    this.lastTile = '';
    if(options){
      this.wallName = options.wallName;
      this.type = options.type
    }
    this.token = Wreddit.router.currentUser.get('session_token');
  },
  // should put into collection by last loaded
  fetch: function(feedName, callback){
    var that = this;
    var url = "/api/tiles/";
    return $.getJSON(url, {
      username: feedName,
       session_token: Wreddit.router.currentUser.get('session_token')
     }, function(data){
      data.forEach(function(res){
        var tile = new Wreddit.Models.Tile(res);
        if (that._isUnique(tile) && tile.get('imgSrc')){
          that.add(tile);
        }
      });
      callback(data.tiles);
    });
  },
  getMore: function(subrs, callback){
    if(this.getting === true){
      return false;
    }
    if(this.type === 'feed'){
      this.fetch(this.wallName, function(res){})
      return false;
    }
    this.getting = true;
    var that = this;
    var picFormats = ['.jpg', '.png', '.gif'];
    var imgDomains = ['imgur.com', 'm.imgur.com', 'i.imgur.com'];
    var badDomain = ['/a/', '/gallery', '/album/'];

    console.log("getting from http://www.reddit.com/r/"+this.wallName+".json?limit=10&after="+this.lastTile+"&jsonp=?")
    var promise =  $.getJSON("http://www.reddit.com/r/"+this.wallName+".json?limit=10&after="+this.lastTile+"&jsonp=?")
    .done(function (data){
      var newTiles = [];
      $.each(data.data.children, function (i, post) {
        var tile = new Wreddit.Models.Tile(post.data)
        that.lastTile = tile.get('name');
        var url = tile.get('url')
        var lastFour = url.substring(url.length-4, url.length)

        // nasty way to get imgur images unless it's a gallery or album
        if (picFormats.indexOf(lastFour) !== -1) {
          tile.set('imgSrc', tile.get('url'));
        } else if ((imgDomains.indexOf(tile.get("domain")) !== -1)){
          tile.set('imgSrc', tile.get('url')+".jpg")
          _.each(badDomain, function (str){
            if(url.indexOf(str) !== -1){
              delete tile.attributes.imgSrc;
            }
          })
        }
        if (that._isUnique(tile) && tile.get('imgSrc')){
          that.add(tile);
        }
      })
      that.getting = false;
    })
  },

  // could keep data in a hash set in addition to array
  _isUnique: function(candidateTile){
    for(var i = 0; i<this.length; i++){
      if(this.models[i].get('url') == candidateTile.get('url')){
        return false;
      }
    }
    return true;
  }
})
