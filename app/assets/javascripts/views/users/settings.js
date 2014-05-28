Wreddit.Views.Settings = Backbone.View.extend({
  template: JST['users/settings'],
  render: function () {
    console.log('Settings#render')
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
})