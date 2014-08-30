//creates layoutLimited that layouts at a limited rate
(function(){
  var masonTempTiles = [];
  var masonTimeout;
  Masonry.prototype.layoutLimited = function(tile){
    var that = this;
    masonTempTiles.push(tile)
    clearTimeout(masonTimeout);
    masonTimeout = setTimeout(function(){
      for (var i = 0; i < masonTempTiles.length; i++){
        masonTempTiles[i].show();
      }
      that.layout();
      masonTempTiles = [];
      console.log('layout');
    }, 500);
  };
})()