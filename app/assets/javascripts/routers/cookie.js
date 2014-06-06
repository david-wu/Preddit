var Cookie = function(){
}

Cookie.get = function(key){
  var cookieContent = document.cookie.split('; ');
  var returnValue = false;
  _.each(cookieContent, function(content){
    var keyValPair = content.split('=')
    if (keyValPair[0] === key){
      returnValue = keyValPair[1];
    }
  })
  return returnValue;
}

Cookie.set = function(key, value){
  document.cookie = key+"="+value+"; expires=Thu, 18 Dec 3000 12:00:00 GMT";
  return document.cookie;
}

Cookie.delete = function(key){
  document.cookie = key+"=; expires=Thu, 18 Dec 2000 12:00:00 GMT";
  return document.cookie;
}
