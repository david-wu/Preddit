Wreddit.Views.About = Backbone.View.extend({
  template: JST['users/about'],
  render: function () {
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
})
