Wreddit.Views.About = Backbone.View.extend({
  template: JST['users/about'],
  render: function () {
    console.log('About#render')
    var renderedContent = this.template({
    });
    this.$el.html(renderedContent);
    return this;
  },
})