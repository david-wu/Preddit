Wreddit.Models.User = Backbone.Model.extend({
  urlRoot: "/api/users",
  signIn: function (){
    var that = this;
    return $.ajax({
      type: "POST",
      data: this.attributes,
      url: "/api/session",
      dataType: "json"
    }).done(function(res){
      that.set(res)
    })
  },
  signOut: function(){
    var that = this;
    return $.ajax({
      url: "api/session",
      type: 'DELETE'
    }).done(function(res){
      that.set(res)
    })
  },
  getCurrentUser: function (cookie, callback){
    var that = this;
    return $.ajax({
      url: "api/users/current",
      dataType: "json",
      success: !callback || callback.bind(this),
      error: !callback || callback.bind(this),
    }).done(function(res){
      that.set(res)
    });
  }

})
