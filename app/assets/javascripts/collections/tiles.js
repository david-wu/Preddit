Wreddit.Collections.Tiles = Backbone.Collection.extend({
  // this just calls the callback with an array of fetched tiles
  fetch: function(feedName, callback){
    var url = "/api/tiles/"+feedName;
    $.getJSON(url, function(data){
      data.map(function(res){
        return new Wreddit.Models.Tile(res);
      })
      callback(data.tiles);
    })
  },
  getMore: function(subrs, callback, lastTile){
    if(this.getting === true){
      return false;
    }
    if (this.subName)
    var that = this;
    var picFormats = ['.jpg', '.png', '.gif']
    var imgDomains = ['imgur.com', 'm.imgur.com', 'i.imgur.com']
    var badDomain = ['/a/', '/gallery', '/album/']
    this.getting = true;

    console.log("http://www.reddit.com/r/"+this.subName+".json?limit=5&after="+this.lastTile+"&jsonp=?")
    $.getJSON("http://www.reddit.com/r/"+this.subName+".json?limit=5&after="+this.lastTile+"&jsonp=?",
      function (data){
        var newTiles = [];
        $.each(data.data.children.slice(0, 5),
          function (i, post) {
            var tile = new Wreddit.Models.Tile(post.data)
            that.lastTile = tile.get('name');
            url = tile.get('url')
            var lastFour = url.substring(url.length-4, url.length)

            //set tile.imgSrc and stores into this collection
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
            if (that._isUnique(tile)){
              newTiles.push(tile);
              that.add(tile);
            }
          }
        )
        // callback(newTiles);
        that.getting = false;
      }
    )

  },
  initialize: function (feedName){
    this.lastTile = '';
    if(feedName){
      this.feedName = feedName;
    }
  },
  _isUnique: function(candidateTile){
    for(var i = 0; i<this.length; i++){
      if(this.models[i].get('url') == candidateTile.get('url')){
        return false;
      }
    }
    return true;
  }
})
