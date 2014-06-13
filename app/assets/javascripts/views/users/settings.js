Wreddit.Views.Settings = Backbone.View.extend({
  template: JST['users/settings'],
  render: function () {
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'click #update-btn': 'update'
  },
  update: function(event){
    event.preventDefault();

    Wreddit.router.currentUser.set('permitNsfw', false)
    if($(event.target.form).serializeJSON().user){
      _.each($(event.target.form).serializeJSON().user.permissions, function(perm){
        Wreddit.router.currentUser.set(perm, true)
      })
    }

    Wreddit.router.currentUser.save();
    $('#update-user-alerts').html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Success!</strong> Account Updated</div>');
  }
})
