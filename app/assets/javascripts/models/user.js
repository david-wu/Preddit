Wreddit.Models.User = Backbone.Model.extend({
  url: "/api/users",
  signIn: function (callback){
    $.ajax({
      type: "POST",
      data: this.attributes,
      url: "/api/session",
      dataType: "json",
      success: callback.bind(this),
      error: callback.bind(this),
    });
  },
  // currentUser: function (token, callback){
  //   $.ajax({
  //     type: "POST",
  //     data: token,
  //     url: "api/users/current",
  //     dataType: "json",
  //     success: callback.bind(this),
  //     error: callback.bind(this),
  //   })
  // }
})
Wreddit.Models.User.currentUser = function (token, callback){
  $.ajax({
    type: "POST",
    data: token,
    url: "api/users/current",
    dataType: "json",
    success: callback.bind(this),
    error: callback.bind(this),
  })
}
// function(data){
//         alert('welcome! ' + data.token)
//         Wreddit.router.session_token = data.token;
//         Wreddit.router.navigate('#r/sloths', {trigger: true})
//         document.cookie =
//         "sessionToken="+data.token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";
//       }