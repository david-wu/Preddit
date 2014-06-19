Wreddit.Views.SignIn = Backbone.View.extend({
  events: {
    'click #sign-in-btn': 'signIn',
  },
  template: JST['users/signIn'],
  render: function () {
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    return this;
  },
  signIn: function (event){
    // prepare User model
    var that = this;
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    attrs.authenticity_token = $('head').attr('authenticity_token')
    attrs.utf8 = "✓"

    // filter out bad input
    var re = /[^A-Za-z]/
    if (re.test(attrs.user.username)){
          this._showErrorMessage('Sorry! Username can only contain letters');
          return false;
    }

    //attempt sign in
    var currentUser = new Wreddit.Models.User(attrs);
    currentUser.signIn(function(response){
      if(response.session_token){
        Wreddit.router.session_token = response.session_token;
        Cookie.add('sessionToken', response.session_token);
        Wreddit.router.navBar.refreshNavBar(new Wreddit.Models.User(response));
        Wreddit.router.navigate('#f/'+response.username, {trigger: true});
      }else{
        that._showErrorMessage('Sorry! Incorrect login');
      }
    });
  },
  _showErrorMessage: function(message){
    var $errorDiv = $('#sign-in-form-errors')
    $errorDiv.html('<div class="alert alert-danger alert-dismissable">'+message+'</div>');
    setTimeout(function(){
      $errorDiv.fadeOut(400,'swing',function(){
        $errorDiv.html('');
        $errorDiv.show();
      });
    }, 3000);
  }

})
