Wreddit.Views.SignUp = Backbone.View.extend({
  events: {
    'click #sign-up-btn': 'signUp'
  },
  template: JST['users/signUp'],
  render: function () {
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
  signUp: function (event){
    // prepare User model
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    if(attrs.user.password !== attrs.user.confirmPassword){
          $('#sign-up-form-errors').html(' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">Passwords don\'t match</div>')
      return false
    }
    attrs.authenticity_token = $('head').attr('authenticity_token')
    attrs.utf8 = "✓"
    var currentUser = new Wreddit.Models.User(attrs);
    // atempt to create User
    currentUser.save([],{
      success: function(model, response){
        Wreddit.router.session_token = response.token;
        document.cookie =
        "sessionToken="+response.token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";
        Wreddit.router.navBar.refreshNavBar(new Wreddit.Models.User(response.user));
        Wreddit.router.navigate('#f/'+attrs.user.username, {trigger: true})
      },
      error: function(model, response){
        $('#sign-up-form-errors').html(' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">Username already taken.</div>')

        // _.each(response.responseJSON.errors, function(error){
        //   $('#sign-up-form-errors').html(' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">'+error+'</div>')
        // })
      },
    })
  }
})
