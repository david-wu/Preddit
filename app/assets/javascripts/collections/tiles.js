Wreddit.Collections.Tiles = Backbone.Collection.extend({
  // this just calls the callback with an array of fetched tiles
  fetch: function(option){
    option.success();
    console.log('would fetch, but no rails yet')
  },
    getMore: function(subrs, callback){
    var that = this;
    var subs = subrs.join('+');
 console.log("http://www.reddit.com/r/"+subs+".json?limit=15&after="+this.lastTile+"&jsonp=?")
    $.getJSON(
 "http://www.reddit.com/r/"+subs+".json?limit=15&after="+this.lastTile+"&jsonp=?", function (data){
        var newTiles = [];
        $.each(
          data.data.children.slice(0, 25),
          function (i, post) {

            var tile = new Wreddit.Models.Tile(post.data)
            that.lastTile=tile.get('name');
            url = tile.get('url')
            var lastFour = url.substring(url.length-4, url.length)
            var picFormats = ['.jpg', '.png', '.gif']
            var imgDomains = ['imgur.com', 'm.imgur.com', 'i.imgur.com']
            var badDomain = ['/a/', '/gallery', '/album/']

            //set tile.imgSrc and stores into this collection
            if (picFormats.indexOf(lastFour) !== -1) {
              tile.set('imgSrc', tile.get('url'));
            } else if ((imgDomains.indexOf(tile.get("domain")) !== -1)){
              tile.set('imgSrc', tile.get('url')+".jpg")
              _.each(badDomain, function (str){
                if(url.indexOf(str) !== -1){
                  // tile.set('imgSrc', 'http://pagepeeker.com/thumbs.php?size=x&url='+tile.get('url'))
                }
              })
            }else{
              // tile.set('imgSrc', 'http://pagepeeker.com/thumbs.php?size=x&url='+tile.get('url'))
            }
            if (that._isUnique(tile)){
              newTiles.push(tile);
            }


          }
        )
        callback(newTiles);
      }
    )




  },
  initialize: function (){
    this.lastTile = '';
  },
  _isUnique: function(candidateTile){

    for(var i = 0; i<this.length; i++){
      if(this.models[i].get('url') == candidateTile.get('url')){
        return false;
      }
    }
    // this.each(function(tile){
//       if(tile.get('url') == candidateTile.get('url')){
//         return false;
//       }
//     })
    return true;
  }
})