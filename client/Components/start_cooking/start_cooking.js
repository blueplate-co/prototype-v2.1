import {
  Accounts
} from 'meteor/accounts-base';
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import {
  Blaze
} from 'meteor/blaze';
import {
  FilesCollection
} from 'meteor/ostrio:files';
import {
  ReactiveVar
} from 'meteor/reactive-var'
import {
  search_distinct_in_order_record
} from '/imports/functions/shopping_cart.js';
import {
  date_time_conversion
} from '/imports/functions/date_time_conversion.js';

Template.start_cooking.helpers({
  'cooking': function() {
    var cooking = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': "Cooking"
    }).count()
    console.log('Cooking: ' + cooking)
    return cooking
  },

  'order_cooking': function() {
    var cooking = search_distinct_in_order_record('_id', 'Cooking')
    console.log(cooking)
    return cooking
  },

  'order': function() {
    var order = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': 'Created'
    }).count()
    console.log('Order: ' + order)
    return order
  },

  'order_received': function() {
    var order = search_distinct_in_order_record('buyer_id', 'Created')
    console.log(order)
    return order
  },

  'ready_to_serve': function() {
    var ready_to_serve = Transactions.find({
      'seller_id': Meteor.userId(),
      'status': "Ready"
    }).count()
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  },

  'order_ready': function() {
      var cooking = search_distinct_in_order_record('_id', 'Ready')
    console.log(cooking)
    return cooking
  },

})

Template.order_card.onDestroyed(function() {
  var name = String(this);
  Session.delete(name);
})

Template.order_card.helpers({
  'set_timer': function() {
    var name = String(this);
    var initial_value = [];
    Session.set(name, initial_value);
    var order = Order_record.findOne({
      '_id': String(this)
    });
    var date_time = order.ready_time;
    console.log(date_time);

    countdown = Meteor.setInterval(function() {
      var time_remaining = date_time_conversion(date_time, new Date().getTime());
      Session.set(name, time_remaining)
    }, 1000)
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

  'foodie_profile_picture': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var buyer_id = order.buyer_id
    var foodie = profile_images.findOne({
      'userId': buyer_id,
      "meta.purpose": "profile_picture"
    });
    return foodie.meta.base64;
  },
  'product_is_dish': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var product_id = order.product_id;
    if (Dishes.findOne({
        '_id': product_id
      })) {
      return true;
    } else {
      return false;
    }
  },
  'dishes_in_menu': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    return Menu.findOne({
      '_id': order.product_id
    });
  },
  'get_menu_dish_name': function() {
    return Dishes.findOne({
      '_id': String(this)
    }).dish_name;
  },
  'get_menu_dish_image': function() {
    var dish_image_id = Dishes.findOne({
      '_id': String(this)
    }).image_id
    var base64 = Images.findOne({
      '_id': dish_image_id
    }).meta.base64

    return base64;
  },
  'get_menu_qty': function() {
    return dish_qty;
  },
  'get_foodie_name': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var buyer_id = order.buyer_id
    var foodie = Profile_details.findOne({
      'user_id': buyer_id
    })
    return foodie.foodie_name;
  },

  'get_transaction_no': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    return order.buyer_id + order.transaction_no
  },

  'get_dish_image': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    var dish_image_id = Dishes.findOne({
      '_id': dish_id
    }).image_id
    var ext = Images.findOne({
      '_id': dish_image_id
    }).extensionWithDot
    var base64 = Images.findOne({
      '_id': dish_image_id
    }).meta.base64
    return base64;
  },

  'get_dish_name': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    return Dishes.findOne({
      '_id': dish_id
    }).dish_name
  },

  'get_dish_qty': function() {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    dish_qty = Order_record.findOne({
      'product_id': dish_id
    }).quantity
    return dish_qty;
  },
  'ready_to_serve': function() {
    var ready_to_serve = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': "Ready"
    }).count()
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  }
})

Template.request_card.events({
  'click .cooking_card_profile_picture': function() {
    var route = '/foodies/' + String(this);
    FlowRouter.go(window.open(route, '_blank'));
  }
});



Template.request_card.helpers({

  'foodie_profile_picture': function() {
    var foodie = profile_images.findOne({
      'userId': String(this),
      "meta.purpose": "profile_picture"
    });
    return  foodie.meta.base64;

  },

  'get_foodie_name': function() {
    var foodie = Profile_details.findOne({
      'user_id': String(this)
    })
    return foodie.foodie_name;
  },

  'get_transaction_no': function() {
    var order = Order_record.findOne({
      'buyer_id': String(this),
      'seller_id': Meteor.userId(),
      'status': 'Created'
    })
    return order.transaction_no
  },

  'ordered_dish': function() {

    var order = Order_record.findOne({
      'buyer_id': String(this),
      'seller_id': Meteor.userId(),
      'status': 'Created'
    })
    var trans_no = order.transaction_no
    return Order_record.find({
      'buyer_id': String(this),
      'seller_id': Meteor.userId(),
      'transaction_no': trans_no,
      'status': 'Created'
    })
  },
  'product_is_dish': function() {
    if (Dishes.findOne({
        '_id': this.product_id
      })) {
      return true;
    } else {
      return false;
    }
  },
  'get_dish_name': function() {
    return Dishes.findOne({
      '_id': this.product_id
    }).dish_name;
  },
  'get_dish_image': function() {
    var dish_image_id = Dishes.findOne({
      '_id': this.product_id
    }).image_id

    var base64 = Images.findOne({
      '_id': dish_image_id
    }).meta.base64
    return base64;
  },
  'get_dish_qty': function() {
    return Order_record.findOne({
      'product_id': this.product_id
    }).quantity
  },
  'get_menu_name': function() {
    return Menu.findOne({
      '_id': this.product_id
    }).menu_name;
  },
  'get_menu_image': function() {
    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).image_id[0]
    var ext = Images.findOne({
      '_id': dish_image_id
    }).extensionWithDot
    var base64 = Images.findOne({
      '_id': dish_image_id
    }).meta.base64
    return base64;
  },
  'get_menu_qty': function() {
    return Order_record.findOne({
      'product_id': this.product_id
    }).quantity
  }
})


Template.request_card.events({

  'click #accept': function() {

    var buyer_id = String(this)
    var seller_id = Meteor.userId()
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

    product.forEach(add_order_to_transaction)

    charge_card(buyer_id, seller_id, trans_no) //used timeout to make sure transaction insert finished before charing card



    function add_order_to_transaction(array_value, index) {

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
        var price_of_cart = parseInt(String(order.total_price))
        console.log(price_of_cart)

        var status = String(order.status)
        var stripeToken = String(order.stripeToken)


        //check if transactions inserted already, if yes, just insert the order into array
        var check = Transactions.findOne({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': trans_no
        })
        console.log(check)
        if (check) {
          console.log(1)
          var total_price_of_transaction = parseInt(check.amount) //check the amount in the transaction collection
          total_price_of_transaction += parseInt(price_of_cart) //add the cart_price into the transaction table
          Meteor.call('transactions.update', trans_no, buyer_id, seller_id, order_id, total_price_of_transaction, stripeToken) //update the transaction
          Meteor.call('order_record.accepted', order_id) //update the order to cooking
        } else {
          console.log(2)
          if (serving_option === 'Delivery') {
            price_of_cart += 50
          } //delivery cost, should have a variable table
          Meteor.call('transactions.accepted', trans_no, buyer_id, seller_id, order_id, price_of_cart, stripeToken, function (err, result) {
            if (err) {
              Materialize.toast("An error has occurred: " + err, 4000, 'rounded red lighten-2');
            } else {
              Materialize.toast("Transaction has been accepted", 4000, 'rounded red lighten-2');
            }
          }) //insert to transaction
          Meteor.call('order_record.accepted', order_id, function(){
            if (err) {
              Materialize.toast("An error has occurred: " + err, 4000, 'rounded red lighten-2');
            } else {
              Materialize.toast("Ready to cook!", 5000, 'rounded red lighten-2');
            }
          }) //update the order to cooking
        }
        console.log('quantity:' + parseInt(quantity));
        // update order counts for either dishes or menu collection
        if (Dishes.findOne({_id: product_id})) {
          Meteor.call('dish.order_count_update', product_id, seller_id, parseInt(quantity))
        } else {
          Meteor.call('menu.order_count_update', product_id, seller_id, parseInt(quantity))
        }
      }, 100 * index)

    }

    function charge_card(buyer_id, seller_id, trans_no) {
      setTimeout(function() {
        console.log(buyer_id, seller_id, trans_no)
        var transaction = Transactions.findOne({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': trans_no
        })
        console.log(transaction)
        var homecook = Kitchen_details.findOne({
          'user_id': Meteor.userId()
        })
        var stripeToken = transaction.stripeToken
        var amount = transaction.amount
        var description = 'Blueplate.co - Charge for ' + homecook.kitchen_name;
        console.log(stripeToken, amount, description)
        Meteor.call('chargeCard', stripeToken, amount, description);
      }, 3 * 1000)
    }
    Meteor.call('notification.confirm_order', seller_id, buyer_id);
  },

  'click #reject': function() {

    var buyer_id = String(this)
    var seller_id = Meteor.userId()
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

    product.forEach(reject_order)

    function reject_order(array_value, index) {

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
        var price_of_cart = parseInt(String(order.total_price))
        console.log(price_of_cart)

        var status = String(order.status)
        var stripeToken = String(order.stripeToken)


        //check if transactions inserted already, if yes, just insert the order into array
        var check = Transactions.findOne({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': trans_no
        })
        console.log(check)
        if (check) {
          console.log(1)
          var total_price_of_transaction = parseInt(check.amount) //check the amount in the transaction collection
          total_price_of_transaction += parseInt(price_of_cart) //add the cart_price into the transaction table
          Meteor.call('transactions.update', trans_no, buyer_id, seller_id, order_id, total_price_of_transaction, stripeToken) //update the transaction
          Meteor.call('order_record.rejected', order_id) //update the order to cooking
        } else {
          console.log(2)
          if (serving_option === 'Delivery') {
            price_of_cart += 50
          } //delivery cost, should have a variable table
          Meteor.call('transactions.rejected', trans_no, buyer_id, seller_id, order_id, price_of_cart, stripeToken) //insert to transaction
          Meteor.call('order_record.rejected', order_id) //update the order to cooking
        }
      }, 100 * index)
      Meteor.call('notification.reject_order', seller_id, buyer_id);
    }
  }
})

Template.order_card.events({
  'click #ready': function() {
    var order_id = String(this)

    Meteor.call('order_record.ready', order_id)
    Meteor.call('transactions.ready', order_id)
  }
})
