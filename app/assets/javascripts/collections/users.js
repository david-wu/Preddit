Wreddit.Collections.Users = Backbone.Collection.extend({
  // this just calls the callback with an array of fetched tiles
  url: "/api/users",
  model: Wreddit.Models.User,
})