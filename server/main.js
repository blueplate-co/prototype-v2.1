``//initiate webhook when the website render to allow api.ai send over GET request
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


// Meteor.publish('theProfileImages', function(){
//     var currentUserId = this.userId;
//     return profile_images.findOne();
// });

// Meteor.publish('theIngredients', function(){
//   var currentUserId = this.userId;
//   return Ingredients.find();
// });

// Meteor.publish('theShoppingCart', function(){
//   var currentUserId = this.userId;
//   return Shopping_cart.find({ buyer_id: currentUserId });
// });

// Meteor.publish('theOrderRecordSeller', function(){
//   var currentUserId = this.userId;
//   return Order_record.find({ seller_id: currentUserId });
// });

// Meteor.publish('theOrderRecordBuyer', function(){
//   var currentUserId = this.userId;
//   return Order_record.find({ buyer_id: currentUserId });
// });

// Meteor.publish('theProfileDetail', function(){
//   //var currentUserId = this.userId;
//   return Profile_details.find();
// });

// Meteor.publish('theKitchenDetail', function(){
//   //var currentUserId = this.userId;
//   return Kitchen_details.find();
// });

// Meteor.publish('theTransactionSeller', function(){
//   var currentUserId = this.userId;
//   return Transactions.find({ seller_id: currentUserId });
// });

// Meteor.publish('theTransactionBuyer', function(){
//   var currentUserId = this.userId;
//   return Transactions.find({ buyer_id: currentUserId });
// });

// Meteor.publish('theNotificationsSender', function(){
//   var currentUserId = this.userId;
//   return Notifications.find({ sender_id: currentUserId });
// });

// Meteor.publish('theNotificationsReceiver', function(){
//   var currentUserId = this.userId;
//   return Notifications.find({ receiver_id: currentUserId });
// });

Meteor.publish('theDishes', function(){
  var currentUserId = this.userId;
  return Dishes.find();
});

Meteor.publish('theMenu', function(){
  var currentUserId = this.userId;
  return Menu.find();
});

// Meteor.publish('theOrderRatings', function() {
//   return Order_ratings.find();
// })

// Meteor.publish('theImages', function(){
//     var currentUserId = this.userId;
//     return Images.find();
// });
