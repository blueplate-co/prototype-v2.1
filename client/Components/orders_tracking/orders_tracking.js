import { search_distinct_order_record_orders_tracking } from '/imports/functions/orders_tracking.js';
import { date_time_conversion } from '/imports/functions/date_time_conversion.js';

import { validatePhoneNumber, getCountryCodeFromKitChen } from '/imports/functions/common';
import { show_loading_progress, hide_loading_progress } from '/imports/functions/common';

Template.orders_tracking.onRendered(function(){
  $('.tooltip').tipso({
    speed: 400,
    position: 'bottom',
    background: '#343434'
  })
});

Template.orders_tracking.helpers({
  'order': function() {
    var order = Order_record.find({'buyer_id': Meteor.userId(), 'status': 'Created'}).count()
    console.log('Order: ' + order)
    return order
  },
  'order_sent': function() {
    var orders = Order_record.find({'buyer_id': Meteor.userId(), 'status': 'Created'}).fetch(),
        orderIds =[],
        buyer_name, 
        smsList = {};

    orders.map(function(order) {
      if (!orderIds.includes(order.seller_id)) {
        orderIds.push(order.seller_id);
      }

      if (order.send_sms) {
        // Update state send_sms field after sms was sent to Chef
        Meteor.call('order_record.update_send_sms', order._id, (err, res) => {
          if (!err) {
            console.log('Updated send_sms order record.');
          }
        });
  
        var kitchen = Kitchen_details.findOne({
          user_id: order.seller_id
        });
  
        var kitchen_phone_number = kitchen.kitchen_contact,
            countryCode = getCountryCodeFromKitChen(kitchen);
        
        kitchen_phone_number = validatePhoneNumber(kitchen_phone_number, countryCode);
  
        buyer_name = Profile_details.findOne({
          user_id: order.buyer_id
        }).foodie_name;
  
        var dish = Dishes.findOne({
              _id: order.product_id
            });
  
        if (!dish) {
          // send SMS when is a menu
          var menu_name = Menu.findOne({
            _id: order.product_id
          }).menu_name;
  
          if (smsList[kitchen_phone_number]) {
            smsList[kitchen_phone_number] = smsList[kitchen_phone_number]+", " + menu_name;
          } else {
            smsList[kitchen_phone_number] = menu_name;
          }
        } else {
          if (smsList[kitchen_phone_number]) {
            smsList[kitchen_phone_number] = smsList[kitchen_phone_number]+", " + dish.dish_name;
          } else {
            smsList[kitchen_phone_number] = dish.dish_name;
          }
        }
      }
    }); // END MAP

    for (var phoneNumber in smsList) {
      if (smsList.hasOwnProperty(phoneNumber)) {
          var message = smsList[phoneNumber];
          message = 'New incoming order! ' + buyer_name + ' has just placed ' + message + ' from you.'
          Meteor.call('message.sms', phoneNumber, message.trim(), (err, res) => {
            if (!err) {
              console.log('Message sent');
            }
          });
      }
    }
    
    return orderIds
  },
  'cooking': function() {
    var cooking = Order_record.find({'buyer_id': Meteor.userId(), 'status': "Cooking"}).count()
    console.log('Cooking: ' + cooking)
    return cooking
  },
  'order_cooking': function() {
    var cooking = search_distinct_order_record_orders_tracking('_id', 'Cooking')
    console.log(cooking)
    return cooking
  },
  'order_ready': function() {
    return Transactions.find({'buyer_id': Meteor.userId(), $or: [{'status': 'Ready'},{'status': 'Completed'}]})
  },
  'ready_to_serve': function() {
    var ready_to_serve = Order_record.find({
      'buyer_id': Meteor.userId(),
      $or: [{'status': 'Ready'},{'status': 'Completed'}]
    }).count()
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  }
})

Template.pending_confirmation.helpers({
  'kitchen_profile_picture': function(){
    var foodie = Kitchen_details.findOne({'user_id': String(this)})
    return foodie.profileImg.origin;
  },
  'get_kitchen_name': function() {
    var kitchen = Kitchen_details.findOne({'user_id': String(this)})
    return kitchen.kitchen_name;
  },
  'get_dish_serving': function() {
    var order = Order_record.findOne({'seller_id': String(this), 'buyer_id': Meteor.userId(), 'status': 'Created'})
    return order.serving_option;
  },
  'get_serving_date': function() {
    var time = Order_record.findOne({'seller_id': String(this), 'buyer_id': Meteor.userId(), 'status': 'Created'}).ready_time;
    return new Date(time).toLocaleDateString();
  },
  'get_serving_time': function() {
    var time = Order_record.findOne({'seller_id': String(this), 'buyer_id': Meteor.userId(), 'status': 'Created'}).ready_time;
    return new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  'not_delivery': function() {
    return Order_record.findOne({
      'seller_id': String(this), 'buyer_id': Meteor.userId(), 'status': 'Created'}
    ).serving_option != 'Delivery';
  },
  'address': function() {
    return Order_record.findOne({
      'seller_id': String(this), 'buyer_id': Meteor.userId(), 'status': 'Created'
    }).address;
  },
  'ordered_dish': function(){
    var order = Order_record.findOne({'seller_id': String(this), 'buyer_id': Meteor.userId(),'status':'Created'})
    var trans_no = order.transaction_no
    return Order_record.find({'seller_id': String(this), 'buyer_id': Meteor.userId(), 'transaction_no': trans_no,'status': 'Created'})
  },
  'product_is_dish': function() {
    if (Dishes.findOne({'_id': this.product_id})) {
      return true;
    } else {
      return false;
    }
  },
  'get_dish_name': function(){
    return Dishes.findOne({'_id': this.product_id}).dish_name;
  },
  'get_dish_image': function(){
    var dish_image = Dishes.findOne({
      '_id': this.product_id
    }).meta.origin;

    return dish_image;
  },
  'get_dish_qty': function(){
    return Order_record.find({
      'product_id': this.product_id,
      'buyer_id': Meteor.userId(),
      'seller_id': this.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
  },
  'get_menu_name': function(){
    return Menu.findOne({'_id': this.product_id}).menu_name;
  },
  'get_menu_image': function(){
    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).dishes_id[0];

    var menu_image = Dishes.findOne({
      '_id': dish_image_id
    }).meta.origin
    return menu_image;
  },
  'get_menu_qty': function(){
    return Order_record.find({
      'product_id': this.product_id,
      'buyer_id': Meteor.userId(),
      'seller_id': this.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
  }
})

Template.foodies_confirmed_order.helpers({
  'set_timer': function() {
    var name = String(this);
    var initial_value  = [];
    Session.set(name, initial_value);
    var order = Order_record.findOne({'_id': String(this)});
    var date_time = order.ready_time;
    //console.log(date_time);

    countdown = Meteor.setInterval(function(){
      var time_remaining = date_time_conversion(date_time, new Date().getTime());
      Session.set(name,time_remaining)
    },1000)
  },
  'time_is_up': function() {
    var time = Session.get(this);
    if (parseInt(time.days) < 0 || parseInt(time.hours) < 0 || parseInt(time.minutes) < 0) {
      Meteor.clearInterval(this.countdown);
      return true;
    } else {
      return false;
    }
  },
  'getCountdown': function(template) {
    var name = String(this)
    return Session.get(name);
  },
  'kitchen_profile_picture': function(){
    var seller_id = Order_record.findOne({'_id': String(this)}).seller_id
    var kitchen = Kitchen_details.findOne({'user_id': seller_id})
    return kitchen.profileImg.origin;
  },
  'get_kitchen_name': function() {
    var seller_id = Order_record.findOne({'_id': String(this)}).seller_id
    return Kitchen_details.findOne({'user_id': seller_id}).kitchen_name
  },
  'get_dish_serving': function() {
    return Order_record.findOne({'_id': String(this)}).serving_option;
  },
  'get_serving_date': function() {
    var time = Order_record.findOne({'_id': String(this)}).ready_time;
    return new Date(time).toLocaleDateString();
  },
  'get_serving_time': function() {
    var time = Order_record.findOne({'_id': String(this)}).ready_time;
    return new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  'not_delivery': function() {
    return Order_record.findOne({'_id': String(this)}).serving_option != 'Delivery';
  },
  'address': function() {
    return Order_record.findOne({'_id': String(this)}).address;
  },
  'product_is_dish': function() {
    var order = Order_record.findOne({'_id': String(this)})
    var product_id = order.product_id;
    if (Dishes.findOne({'_id': product_id})) {
      return true;
    } else {
      return false;
    }
  },
  'dishes_in_menu': function() {
    var order = Order_record.findOne({'_id': String(this)})
    return Menu.findOne({'_id': order.product_id});
  },
  'get_menu_dish_name': function() {
    return Dishes.findOne({'_id': String(this)}).dish_name;
  },
  'get_dish_image': function() {
    var dish_id = Order_record.findOne({
      '_id': String(this)
    }).product_id;

    return Dishes.findOne({
      '_id': dish_id
    }).meta.origin;

    return dish_image;
  },

  'get_menu_dish_image': function() {
    var dish_image = Dishes.findOne({
      '_id': String(this)
    }).meta.origin

    return dish_image;
  },

  'get_menu_qty': function() {
    return Order_record.find({
      'product_id': this.product_id,
      'buyer_id': Meteor.userId(),
      'seller_id': this.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
  },
  'get_foodie_name': function() {
    var order = Order_record.findOne({'_id': String(this)})
    var buyer_id = order.buyer_id
    var foodie = Profile_details.findOne({'user_id': buyer_id})
    return foodie.foodie_name;
  },

  'get_transaction_no': function(){
    var order = Order_record.findOne({
      '_id': String(this)
    })

    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).dishes_id[0];

    var menu_image = Dishes.findOne({
      '_id': dish_image_id
    }).meta.origin
    return menu_image;

  },

  'get_dish_name': function(){
    var order = Order_record.findOne({'_id': String(this)})
    var dish_id = order.product_id
    return Dishes.findOne({'_id': dish_id}).dish_name
  },

  'get_dish_qty': function(){
    var order = Order_record.findOne({'_id': String(this)})
    var dish_id = order.product_id
    dish_qty = Order_record.find({
      'product_id': order.product_id,
      'buyer_id': order.buyer_id,
      'seller_id': order.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
    return dish_qty;
  },
  'ready_to_serve': function() {
    var ready_to_serve = Order_record.findOne({
      '_id': String(this),
      'buyer_id': Meteor.userId(),
      'status': "Ready"
    })
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  }
});

Template.pending_confirmation.events({

  'click #cancel': function(event, template) {
    event.preventDefault();

    var seller_id = String(this)
    var buyer_id = Meteor.userId()
    var order = Order_record.findOne({
      'buyer_id': buyer_id,
      'seller_id': seller_id,
      'status': 'Created'
    })
    var trans_no = parseInt(order.transaction_no)
    var product = Order_record.find({
      'buyer_id': buyer_id,
      'seller_id': seller_id,
      'transaction_no': trans_no,
      'status': 'Created'
    }).fetch()

    product.forEach(cancel_order)
    
    show_loading_progress();
    function cancel_order(array_value, index) {
      
      setTimeout(function() {
        var order = array_value
        var trans_no = parseInt(String(order.transaction_no))
        var order_id = String(order._id)
        var buyer_id = String(order.buyer_id)
        var seller_id = String(order.seller_id)
        var product_id = String(order.product_id)
        var quantity = String(order.quantity)
        var ready_time = String(order.ready_time)
        var serving_option = String(order.serving_option)

        //get the price of each cart and calculating a total for this transaction
        var price_of_cart = parseFloat(String(order.total_price))
        var status = String(order.status)
        var stripeToken = String(order.stripeToken)


        //check if transactions inserted already, if yes, just insert the order into array
        var check = Transactions.findOne({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': trans_no
        })

        if (check) {
          var total_price_of_transaction = check.amount //check the amount in the transaction collection
          total_price_of_transaction += price_of_cart //add the cart_price into the transaction table
          Meteor.call('transactions.cancelled', trans_no, buyer_id, seller_id, order_id, total_price_of_transaction, stripeToken) //update the transaction
          Meteor.call('order_record.cancelled', order_id) //update the order to cooking
        } else {
          if (serving_option === 'Delivery') {
            price_of_cart += 50
          } //delivery cost, should have a variable table
          Meteor.call('transactions.cancelled', trans_no, buyer_id, seller_id, order_id, price_of_cart, stripeToken) //insert to transaction
          Meteor.call('order_record.cancelled', order_id) //update the order to cooking
        }
      }, 100 * index)

      Meteor.call('notification.cancel_order', seller_id, buyer_id);
      // get conversation_id between seller and buyer
      let conversation = Conversation.findOne({
        buyer_id: buyer_id,
        seller_id: seller_id
      });
      
      Meteor.call('message.disableConversation', conversation._id, (err, res) => {
        if (!err) {
          console.log('Disabled conversation');
        }
        hide_loading_progress();
        // send SMS for cancel
        var kitchen = Kitchen_details.findOne({user_id: seller_id}),
            kitchen_phone_number = kitchen.kitchen_contact,
            countryCode = getCountryCodeFromKitChen(kitchen);
        
        kitchen_phone_number = validatePhoneNumber(kitchen_phone_number, countryCode);

        var buyer_name = Profile_details.findOne({user_id: buyer_id}).foodie_name,
            message = 'Unfortunately, ' + buyer_name + ' has just cancelled the order.';
            
        Meteor.call('message.sms', kitchen_phone_number, message.trim(), (err, res) => {
          if (!err) {
            console.log('Message sent');
          }
        });
      })
    }
  },
})

Template.ready_card.helpers({
  'check_transaction_closed': function() {
    var orders = this.order;
    var total_orders = orders.length;
    var order_rated = 0;
    for (i = 0; i < total_orders; i++) {
      if (Order_record.findOne({_id: orders[i]}).status == 'Closed') {
        order_rated += 1;
        //console.log(order_rated);
      }
    }
    if (order_rated == total_orders) {
      //console.log('time to close this transaction');
      Meteor.call('transactions.close', this._id);
    }
  },
  'kitchen_profile_picture': function(){
    var foodie = Kitchen_details.findOne({'user_id': this.seller_id})
    return foodie.profileImg.origin;
  },
  'get_kitchen_name': function() {
    var kitchen = Kitchen_details.findOne({'user_id': this.seller_id})
    return kitchen.kitchen_name;
  },
  'ready_order': function() {
    return this.order;
  },

  'ordered_dish': function(){
    return Order_record.find({'_id': String(this),'buyer_id': Meteor.userId()});
  },
  'get_dish_serving': function() {
    return this.serving_option;
  },
  'get_serving_date': function() {
    var time = this.ready_time;
    return new Date(time).toLocaleDateString();
  },
  'get_serving_time': function() {
    var time = this.ready_time;
    return new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  'not_delivery': function() {
    return this.serving_option != 'Delivery';
  },
  'address': function() {
    return this.address;
  },
  'product_is_dish': function() {
    if (Dishes.findOne({'_id': this.product_id})) {
      return true;
    } else {
      return false;
    }
  },
  'get_dish_name': function(){
    return Dishes.findOne({'_id': this.product_id}).dish_name;
  },
  'get_dish_image': function(){
    var dish_image_id = Dishes.findOne({
      '_id': this.product_id
    }).meta.origin

    return dish_image_id;

  },
  'get_dish_qty': function(){
    return Order_record.find({
      'product_id': this.product_id,
      'buyer_id': Meteor.userId(),
      'seller_id': this.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
  },
  'get_menu_name': function(){
    return Menu.findOne({'_id': this.product_id}).menu_name;
  },
  'get_menu_image': function(){

    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).dishes_id[0];

    var menu_image = Dishes.findOne({
      '_id': dish_image_id
    }).meta.origin
    return menu_image;

  },
  'get_menu_qty': function(){
    return Order_record.find({
      'product_id': this.product_id,
      'buyer_id': Meteor.userId(),
      'seller_id': this.seller_id
    }, {sort: {createdAt: -1}, limit: 1} ).fetch()[0].quantity
  },
  'transaction_is_complete': function() {
    var transaction_complete = Transactions.findOne({'_id': this._id,'status':'Completed'})
    var order_complete = Order_record.findOne({'_id':this._id,'status':'Completed'})
    var order_close = Order_record.findOne({'_id':this._id,'status':'Closed'})
    if (transaction_complete) {
      return true;
    } else if (order_complete) {
      return order_complete;
    } else if (order_close) {
      return order_close;
    } else {
      return false;
    }
  }
})
