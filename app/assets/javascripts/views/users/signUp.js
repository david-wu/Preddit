Wreddit.Views.SignUp = Backbone.View.extend({
  events: {
    'click #sign-up-btn': 'signUp'
  },
  template: JST['users/signUp'],
  render: function () {
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    return this;
  },
  signUp: function (event){
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
    } else if(attrs.user.password !== attrs.user.confirmPassword){
      this._showErrorMessage('Sorry! Passwords don\'t match');
      return false;
    }

    // save session and refresh navbar on success
    var currentUser = new Wreddit.Models.User(attrs);
    currentUser.save([],{
      success: function(model, response){
        Wreddit.router.session_token = response.token;
        Cookie.add('sessionToken', response.token);
        Wreddit.router.navBar.refreshNavBar(new Wreddit.Models.User(response.user));

        // create welcome tile
        var tile = new Wreddit.Models.Tile({
          title: "Welcome To Preddit!  Use the Search Bar to open content or find users.  You can click and drag tiles to share them with other users.",
          user_id: response.user.id,
          imgSrc: 'assets/welcome.gif',
          url: '#',
          author: 'Preddit',
          domain: "preddit.io",
          permalink: '#',
          over_18: 'false',
        })
        tile.save()
        Wreddit.router.navigate('#f/'+attrs.user.username, {trigger: true})
      },
      error: function(model, response){
        that._showErrorMessage('Sorry! Username is already taken');
      },
    })
  },
  _showErrorMessage: function(message){
    var $errorDiv = $('#sign-up-form-errors')
    $errorDiv.html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><div class="alert alert-danger alert-dismissable">'+message+'</div>');
    setTimeout(function(){
      $errorDiv.fadeOut(400,'swing',function(){
        $errorDiv.html('');
        $errorDiv.show();
      });
    }, 3000);
  }
})
