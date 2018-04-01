//initiate webhook when the website render to allow api.ai send over GET request
import '/imports/api/public/api.js';

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '1658815334192410',
    secret: '7d55362d11e8fe338e061111702e4989',
});

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: '443515033308-et1o2nfgfom025op5bm5unsfmfbimafl.apps.googleusercontent.com',
  secret: 'uDpIjX3dsylPJ5PJP2lwSFtm',
});

Meteor.publish('theDishes', function(){
  return Dishes.find();
});

Meteor.publish('theMenu', function(){
  return Menu.find();
});

Meteor.publish('theIngredients', function(){
  return Ingredients.find();
});

Meteor.publish('getUserShoppingCart', function(){
  return Shopping_cart.find({ buyer_id: Meteor.userId() })
})

Meteor.publish('getDishesLikes', function(){
  return DishesLikes.find();
})

Meteor.publish('getMenusLikes', function(){
  return MenusLikes.find();
})

Meteor.publish('getKitchensLikes', function(){
  return KitchenLikes.find();
})
