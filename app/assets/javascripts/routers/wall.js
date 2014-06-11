var Wall = function (wallName, type) {
  this.lastPos = 0;
  this.name = wallName;
  this.type = type;
  Cookie.add(type+'s', wallName)
  this.collection = new Wreddit.Collections.Tiles();
  this.view = new Wreddit.Views.Wall({
    collection: this.collection,
    tagName: "div class='wall "+wallName+"'",
    wallName: wallName,
    type: type
  });

  $('#allWalls').append(this.view.$el);

  this.$navBarEl = Wreddit.router.navBar.appendWall(wallName, type);
}

Wall.prototype.remove = function(){
  this.view.remove();
  this.collection.reset();
  this.$navBarEl.remove();
  this.view = undefined;
  this.collection = undefined;
}

Wall.prototype.reload = function(){
}
