Wreddit.Views.SignIn = Backbone.View.extend({
  template: JST['users/signIn'],
  render: function () {
    console.log('UserNew#render')
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'click #sign-in-btn': 'signIn'
  },
  signIn: function (event){
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    attrs.authenticity_token = $('head').attr('authenticity_token')
    attrs.utf8 = "✓"

    var currentUser = new Wreddit.Models.User(attrs);
    console.log(currentUser)
    currentUser.signIn(function(response){
      if(response.token){
        Wreddit.router.session_token = response.token;
        Wreddit.router.navigate('#f/'+attrs.user.username, {trigger: true})
        document.cookie =
        "sessionToken="+response.token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";
      }else{
        console.log("fail!!")
$('#sign-in-form-errors').html(' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">Incorect Login</div>')
      }
    });

  },

})