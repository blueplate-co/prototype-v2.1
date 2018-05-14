Dishes = new Mongo.Collection('dishes');
Ingredients_temporary = new Mongo.Collection(null);
Ingredients = new Mongo.Collection('ingredients');
Menu = new Mongo.Collection('menu');
// Messages = new Mongo.Collection('messages');
Shopping_cart = new Mongo.Collection('shopping_cart');
Order_record = new Mongo.Collection('order_record');
Profile_details = new Mongo.Collection('profile_details');
Kitchen_details = new Mongo.Collection('kitchen_details');
Markers = new Mongo.Collection('markers');
Transactions = new Mongo.Collection('transactions');
Notifications = new Mongo.Collection('notifications');
Order_ratings = new Mongo.Collection('order_ratings');
DishesViews = new Mongo.Collection('dishes_views');
MenusViews = new Mongo.Collection('menu_views');
KitchenViews = new Mongo.Collection('kitchen_views');

Images = new FilesCollection({
  collectionName: 'Images',
  storagePath: () => {
      return process.env.PWD + '/public/dishes_upload/';
  },
  allowClientCode: false,
  onBeforeUpload(file) {

        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
          return true;
        } else {
          return 'Please upload image, with size equal or less than 10MB';
        }
  }
});

Meteor.startup(function() {
    Stripe.setPublishableKey('pk_live_mqXbgtwXmodOMRSKycYVgsl6');
});

Meteor.startup(function() {
    var handler = StripeCheckout.configure({
      key: 'pk_live_mqXbgtwXmodOMRSKycYVgsl6',
      token: function(token) {}
    });
});

Collections = {
  'Dishes': Dishes,
  'Ingredients': Ingredients,
  'Menu': Menu,
  // 'Messages': Messages,
  'Images': Images,
  'Shopping_cart': Shopping_cart,
  'order_record': Order_record,
  'Profile_details': Profile_details,
  'Kitchen_details': Kitchen_details,
  'Markers': Markers,
  'Transactions': Transactions,
  'Notifications': Notifications,
  'Order_ratings': Order_ratings
}

Template.registerHelper(
  'find', (collection) => {
    return Collections[collection].find();
  },
);

Template.registerHelper(
  'profile_images', (type, user_id) => {
    if (user_id === 'own_user') {
      var user_id = Meteor.userId();//Session.get('user_id'); or Meteor.userId();
    } else if (user_id === 'other_user') {
      var user_id = Session.get('user_id');
    }
    var get_profile_images = profile_images.findOne({'userId': user_id,'meta':{"purpose": type}});
    var get_profile_images_id = get_profile_images && get_profile_images._id;
    var get_profile_images_ext = get_profile_images && get_profile_images.extensionWithDot;
    var get_profile_images_name = get_profile_images_id + get_profile_images_ext;
    return get_profile_images_name;
  }
);
