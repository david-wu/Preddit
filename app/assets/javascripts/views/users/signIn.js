Wreddit.Views.SignIn = Backbone.View.extend({
  events: {
    'click #sign-in-btn': 'signIn',
  },
  template: JST['users/signIn'],
  initialize: function(options){
    this.user = options.user;
  },
  render: function(){
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    return this;
  },
  signIn: function(event){
    var that = this;
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    var re = /[^A-Za-z]/
    if (re.test(attrs.user.username)){
      this._showErrorMessage('Sorry! Username can only contain letters');
      return false;
    }
    this.user.set(attrs);
    // attempt login
    this.user.signIn().fail(function(res){
      that._showErrorMessage("Invalid Login")
    }).done(function(res){
      Wreddit.router.navigate('#f/'+that.user.get('username'), {trigger: true});
      Cookie.set('user', JSON.stringify(that.user))
    })
  },
  _showErrorMessage: function(message){
    var $errorDiv = $('#sign-in-form-errors')
    $errorDiv.html('<div class="alert alert-danger alert-dismissable">'+message+'</div>');
    $errorDiv.show();
    setTimeout(function(){
      $errorDiv.fadeOut(400,'swing');
    },2000);
  }
})
