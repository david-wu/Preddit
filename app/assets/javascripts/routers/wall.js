var Wall = function (wallName, type) {
  this.lastPos = 0;
  this.name = wallName;
  this.addToCookie();
  this.collection = new Wreddit.Collections.Tiles();
  this.view = new Wreddit.Views.Wall({
    collection: this.collection,
    tagName: "div class='wall "+wallName+"'",
    wallName: wallName,
    type: type
  });
  $('#allWalls').append(this.view.$el);

  NavBar.appendWall(wallName, type);
}

Wall.prototype.addToCookie = function(){
  if (Cookie.get('walls')){
    var openWalls = Cookie.get('walls').split(',');
  }else{
    var openWalls = [];
  }
  if(openWalls.indexOf(this.name) === -1){
    openWalls.push(this.name);
  }
  Cookie.set('walls', openWalls.join(','));
}

Wall.prototype.remove = function(){
  this.view.remove();
  this.collection.reset();
  this.$navBarEl.remove();
  this.view = undefined;
  this.collection = undefined;
}
