Wreddit.Views.SignIn = Backbone.View.extend({
  events: {
    'click #sign-in-btn': 'clickedSignIn'
  },
  template: JST['users/signIn'],
  render: function () {
    console.log('UserNew#render')
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
  clickedSignIn: function (event){
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    attrs.authenticity_token = $('head').attr('authenticity_token')
    attrs.utf8 = "✓"

    var currentUser = new Wreddit.Models.User(attrs);
    currentUser.signIn(function(response){

      if(response.session_token){

        Wreddit.router.session_token = response.session_token;
        document.cookie = "sessionToken="+response.session_token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";

        Wreddit.router._refreshNavBar(new Wreddit.Models.User(response));


        Wreddit.router.navigate('#f/'+response.username, {trigger: true})
      }else{
        console.log("fail!!")
$('#sign-in-form-errors').html(' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">Incorect Login</div>')
      }
    });

  },

})