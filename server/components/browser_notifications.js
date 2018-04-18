import {
  Meteor
} from 'meteor/meteor';
import {
  check
} from 'meteor/check';
import {
  Match
} from 'meteor/check';

Notifications = new Mongo.Collection('notifications');


// set permission for Notifications collection
Notifications.deny({
  update() {
    return true;
  },
  remove() {
    return true;
  }
});

Meteor.methods({
  'notification.place_order' (seller_id, buyer_id, product_id, quantity) {
    check(seller_id, String);
    check(buyer_id, String);
    check(product_id, String);
    check(quantity, Match.Any);

    var buyer_name = Profile_details.findOne({
      user_id: buyer_id
    }).foodie_name;

    var dish = Dishes.findOne({
      _id: product_id
    });

    if (!dish) {
      var menu_name = Menu.findOne({
        _id: product_id
      }).menu_name;
      var message = buyer_name + ' has just placed ' + quantity + 'x ' + menu_name + ' from you.';
      var title = 'New incoming order';
    } else {
      var title = 'New incoming order';
      var message = buyer_name + ' has just placed ' + quantity + 'x ' + dish.dish_name + ' from you.'
    }

    Notifications.insert({
      receiver_id: seller_id,
      sender_id: buyer_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  'notification.confirm_order' (seller_id, buyer_id) {
    check(seller_id, String);
    check(buyer_id, String);

    var seller_name = Kitchen_details.findOne({
      user_id: seller_id
    }).chef_name;
    var title = 'Your order is confirmed';
    var message = seller_name + ' has just confirmed your order. Please get ready!';

    Notifications.insert({
      receiver_id: buyer_id,
      sender_id: seller_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  'notification.reject_order' (seller_id, buyer_id) {
    check(seller_id, String);
    check(buyer_id, String);

    var seller_name = Kitchen_details.findOne({
      user_id: seller_id
    }).chef_name;
    var title = 'Your order is rejected';
    var message = 'Unfortunately, ' + seller_name + ' has just rejected your order.';

    Notifications.insert({
      receiver_id: buyer_id,
      sender_id: seller_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  'notification.cancel_order' (seller_id, buyer_id) {
    check(seller_id, String);
    check(buyer_id, String);

    var buyer_name = Profile_details.findOne({
      user_id: buyer_id
    }).foodie_name;
    var title = 'The order is cancelled';
    var message = 'Unfortunately, ' + buyer_name + ' has just cancelled the order.';

    Notifications.insert({
      receiver_id: seller_id,
      sender_id: buyer_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  'notification.update' (id) {
    check(id, String);
    Notifications.update({
      _id: id
    }, {
      $set: {
        read: true,
        updatedAt: new Date()
      }
    });
  },
  'notification.transaction_ready' (seller_id, buyer_id) {
    check(seller_id, String);
    check(buyer_id, String);

    var seller_name = Kitchen_details.findOne({
      user_id: seller_id
    }).chef_name;
    var title = 'Your food is ready';
    var message = seller_name + ', your food is ready. Please enjoy!';

    Notifications.insert({
      receiver_id: buyer_id,
      sender_id: seller_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  'notification.transaction_complete' (seller_id, buyer_id) {
    check(seller_id, String);
    check(buyer_id, String);

    var seller_name = Kitchen_details.findOne({
      user_id: seller_id
    }).chef_name;
    var title = 'The transaction is completed';
    var message = 'How is ' + seller_name + ' food? Please rate the dish you ordered!';

    Notifications.insert({
      receiver_id: buyer_id,
      sender_id: seller_id,
      title: title,
      content: message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
});


Meteor.publish('listAllNotifications', function() {
  var notifications = Notifications.find({});
  return notifications;
})
