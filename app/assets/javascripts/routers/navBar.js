var NavBar = function(){
 this.feeds = {};
 this.subs = {};
 this.$feedEl = $('#allFeed-links');
 this.$subEl = $('#allWall-links');
}

NavBar.bar = new NavBar();

NavBar.appendWall = function(wallName, type){
  if (type === 'sub'){
    var $parentOfLinkToWall = $('#allWall-links')
    var typeId = 'r/'
    var appendOrPrepend = 'append'
  } else if (type === 'feed'){
    var $parentOfLinkToWall = $('#allFeed-links')
    var typeId = 'f/'
    var appendOrPrepend = 'prepend'
  } else {
  }


  $parentOfLinkToWall[appendOrPrepend]('<li id=_link'+wallName+
  '><a href="#'+typeId+wallName+'" class="nav-bar-feed-link wall-link '+type+
  '">'+wallName+'</a></li>');
  this.$navBarEl = $('#_link'+wallName);
}

NavBar.removeWall = function(wallName, type){

}
