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

Cookie.add = function(key, value){
  if (Cookie.get(key)){
    var cookieSub = Cookie.get(key).split(',');
  }else{
    var cookieSub = [];
  }
  if(cookieSub.indexOf(value) === -1){
    cookieSub.push(value);
  }
  Cookie.set(key, cookieSub.join(','));
}

Cookie.remove = function(key, value){
  if (Cookie.get(key)){
    var cookieSub = Cookie.get(key).split(',');
  }else{
    var cookieSub = [];
  }
  if(cookieSub.indexOf(value) !== -1){
    cookieSub.splice(cookieSub.indexOf(value), 1)
  }
  Cookie.set(key, cookieSub.join(','));
}

Cookie.delete = function(key){
  document.cookie = key+"=; expires=Thu, 18 Dec 2000 12:00:00 GMT";
  return document.cookie;
}
