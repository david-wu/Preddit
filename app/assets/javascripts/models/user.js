Wreddit.Models.User = Backbone.Model.extend({
  urlRoot: "/api/users",
  signIn: function (){
    var that = this;
    return $.ajax({
      type: "POST",
      data: this.attributes,
      url: "/api/session",
      dataType: "json"
      // success: function(res){
      //   that.set(res)
      //   console.log(that)
      // },
      // error: options.error.bind(this),
    }).done(function(res){
      that.set(res)
      console.log(that)
    })
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
