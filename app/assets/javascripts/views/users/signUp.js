Wreddit.Views.SignUp = Backbone.View.extend({
  events: {
    'click #sign-up-btn': 'signUp'
  },
  template: JST['users/signUp'],
  initialize: function(options){
    this.user = options.user;
  },
  render: function () {
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    return this;
  },
  signUp: function (event){
    var that = this;
    // get and sanitize input
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    var re = /[^A-Za-z]/
    if (re.test(attrs.user.username)){
      this._showErrorMessage('Sorry! Username can only contain letters');
      return false;
    } else if(attrs.user.password !== attrs.user.confirmPassword){
      this._showErrorMessage('Sorry! Passwords don\'t match');
      return false;
    }
    this.user.set(attrs);
    // create user and welcome tile
    this.user.save().done(function(res){
      var tile = new Wreddit.Models.Tile({
        title: "Welcome To Preddit!  Use the Search Bar to open content or find users.  You can click and drag tiles to share them with other users.",
        user_id: that.id,
        imgSrc: 'assets/welcome.gif',
        url: '#',
        author: 'dawu',
        domain: "preddit.io",
        permalink: '#',
        over_18: 'false',
      }, {})
      tile.save()
      Wreddit.router.navigate('#f/'+attrs.user.username, {trigger: true})
      Cookie.set('user', JSON.stringify(that.user))
    }).fail(function(res){
      res.responseJSON.forEach(function(error){
        that._showErrorMessage(error);
      });
    })
  },
  _showErrorMessage: function(message){
    var $errorDiv = $('#sign-up-form-errors')
    $errorDiv.html('<div class="alert alert-danger alert-dismissable">'+message+'</div>');
    $errorDiv.show();
    setTimeout(function(){
      $errorDiv.fadeOut(400,'swing');
    },2000);
  }
})
