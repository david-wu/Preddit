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
})
Wreddit.Models.User.currentUser = function (cookie, callback){
  $.ajax({
    type: "POST",
    data: cookie,
    url: "api/users/current",
    dataType: "json",
    success: callback.bind(this),
    error: callback.bind(this),
  })
}