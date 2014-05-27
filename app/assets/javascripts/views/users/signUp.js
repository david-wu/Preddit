Wreddit.Views.SignUp = Backbone.View.extend({
  template: JST['users/signUp'],
  render: function () {
    console.log('UserNew#render')
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'click #sign-up-btn': 'signUp'
  },
  signUp: function (event){
    event.preventDefault();
    var attrs = $(event.target.form).serializeJSON();
    if(attrs.user.password !== attrs.user.confirmPassword){
      alert("Passwords don't match!")
      return false
    }
    attrs.authenticity_token = $('head').attr('authenticity_token')
    attrs.utf8 = "✓"
    attrs.commit = "Sign Up"

    var currentUser = new Wreddit.Models.User(attrs);
    console.log(currentUser)
    currentUser.save([],{
      success: function(model, response){
        alert('welcome! ' + response.token)
        Wreddit.router.session_token = response.token;
        Wreddit.router.navigate('#f/'+attrs.user.username, {trigger: true})
        document.cookie =
        "sessionToken="+response.token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";
      },
    })

    // $.ajax({
    //   type: "POST",
    //   data: attrs,
    //   url: "/api/users",
    //   dataType: "json",
    //   success: function(data){
    //     alert('welcome! ' + data.token)
    //     Wreddit.router.session_token = data.token;
    //     Wreddit.router.navigate('#r/sloths', {trigger: true})
    //     document.cookie =
    //     "sessionToken="+data.token+"; expires=Thu, 18 Dec 3000 12:00:00 GMT; path=/";
    //   }
    // });

  }
})