Meteor.methods({
  'kitchen_likes.get' (user_id) {
    var dishes_likes = DishesLikes.find({user_id: user_id}).fetch().length;
    var menus_likes = MenusLikes.find({user_id: user_id}).fetch().length;
    return dishes_likes + menus_likes;
  }
})
