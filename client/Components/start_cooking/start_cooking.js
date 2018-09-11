import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';
import {  Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import {  FilesCollection } from 'meteor/ostrio:files';
import { ReactiveVar } from 'meteor/reactive-var'
import { search_distinct_in_order_record} from '/imports/functions/shopping_cart.js';
import { date_time_conversion } from '/imports/functions/date_time_conversion.js';

import { validatePhoneNumber, getCountryCodeFromProfile } from '/imports/functions/common';

Meteor.subscribe('listAllOrdersSeller');
Meteor.subscribe('listAllOrdersBuyer');
Meteor.subscribe('listAllTransactions');

Template.start_cooking.helpers({
  'cooking': function () {
    var cooking = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': "Cooking"
    }).count()
    console.log('Cooking: ' + cooking)
    return cooking
  },

  'order_cooking': function () {
    var cooking = search_distinct_in_order_record('_id', 'Cooking')
    console.log(cooking)
    return cooking
  },

  'order': function () {
    var order = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': 'Created'
    }).count()
    console.log('Order: ' + order)
    return order
  },

  'order_received': function () {
    var order = search_distinct_in_order_record('buyer_id', 'Created')
    console.log(order)
    return order
  },

  'ready_to_serve': function () {
    var ready_to_serve = Transactions.find({
      'seller_id': Meteor.userId(),
      'status': "Ready"
    }).count()
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  },

  'order_ready': function () {
    return Transactions.find({ 'seller_id': Meteor.userId(), 'status': 'Ready' })
  },

})

Template.order_card.onDestroyed(function () {
  var name = String(this);
  Session.delete(name);
})

Template.order_card.helpers({
  'set_timer': function () {
    var name = String(this);
    var initial_value = [];
    Session.set(name, initial_value);
    var order = Order_record.findOne({
      '_id': String(this)
    });
    var date_time = order.ready_time;
    console.log(date_time);

    countdown = Meteor.setInterval(function () {
      var time_remaining = date_time_conversion(date_time, new Date().getTime());
      Session.set(name, time_remaining)
    }, 1000)
  },

  'time_is_up': function () {
    var time = Session.get(this);
    if (parseInt(time.days) < 0 || parseInt(time.hours) < 0 || parseInt(time.minutes) < 0) {
      Meteor.clearInterval(this.countdown);
      return true;
    } else {
      return false;
    }
  },

  'getCountdown': function (template) {
    var name = String(this)
    return Session.get(name);
  },

  'foodie_profile_picture': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var buyer_id = order.buyer_id
    var foodie = Profile_details.findOne({
      'user_id': buyer_id
    });
    return foodie.profileImg.origin;
  },
  'get_dish_serving': function () {
    return Order_record.findOne({
      '_id': String(this)
    }).serving_option
  },
  'get_serving_date': function () {
    var time = Order_record.findOne({
      '_id': String(this)
    }).ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleDateString();
  },
  'get_serving_time': function () {
    var time = Order_record.findOne({
      '_id': String(this)
    }).ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
  'delivery': function () {
    return Order_record.findOne({
      '_id': String(this)
    }).serving_option === 'Delivery';
  },
  'delivery_address': function () {
    return Order_record.findOne({
      '_id': String(this)
    }).address;
  },
  'product_is_dish': function () {
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
  'dishes_in_menu': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    return Menu.findOne({
      '_id': order.product_id
    });
  },
  'get_menu_dish_name': function () {
    return Dishes.findOne({
      '_id': String(this)
    }).dish_name;
  },
  'get_menu_dish_image': function () {
    var dish_image = Dishes.findOne({
      '_id': String(this)
    }).meta.origin

    return dish_image;
  },
  'get_menu_qty': function () {
    return dish_qty;
  },
  'get_foodie_name': function () {
    console.log(this);
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var buyer_id = order.buyer_id
    var foodie = Profile_details.findOne({
      'user_id': buyer_id
    })
    return foodie.foodie_name;
  },

  'get_transaction_no': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    return order.buyer_id + order.transaction_no
  },

  'get_dish_image': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    var dish_image = Dishes.findOne({
      '_id': dish_id
    }).meta.origin

    return dish_image;
  },

  'get_dish_name': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    return Dishes.findOne({
      '_id': dish_id
    }).dish_name
  },

  'get_dish_qty': function () {
    var order = Order_record.findOne({
      '_id': String(this)
    })
    var dish_id = order.product_id
    dish_qty = Order_record.find({
      'product_id': dish_id,
      'buyer_id': order.buyer_id,
      'seller_id': order.seller_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].quantity
    return dish_qty;
  },
  'ready_to_serve': function () {
    var ready_to_serve = Order_record.find({
      'seller_id': Meteor.userId(),
      'status': "Ready"
    }).count()
    console.log('Ready: ' + ready_to_serve)
    return ready_to_serve
  }
})

Template.request_card.events({
  'click .cooking_card_profile_picture': function () {
    var route = '/foodies/' + String(this);
    FlowRouter.go(window.open(route, '_blank'));
  }
});



Template.request_card.helpers({

  'foodie_profile_picture': function () {
    var foodie = Profile_details.findOne({
      'user_id': String(this)
    });
    return foodie.profileImg.origin;

  },

  'get_foodie_name': function () {
    var foodie = Profile_details.findOne({
      'user_id': String(this)
    })
    return foodie.foodie_name;
  },

  'get_transaction_no': function () {
    var order = Order_record.findOne({
      'buyer_id': String(this),
      'seller_id': Meteor.userId(),
      'status': 'Created'
    })
    return order.transaction_no
  },

  'ordered_dish': function () {

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
  'product_is_dish': function () {
    if (Dishes.findOne({
      '_id': this.product_id
    })) {
      return true;
    } else {
      return false;
    }
  },
  'get_dish_name': function () {
    return Dishes.findOne({
      '_id': this.product_id
    }).dish_name;
  },
  'get_dish_image': function () {
    var dish_image = Dishes.findOne({
      '_id': this.product_id
    }).meta.origin
    return dish_image;
  },
  'get_dish_qty': function () {
    return Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].quantity
  },
  'get_dish_serving': function () {
    return Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].serving_option
  },
  'get_serving_date': function () {
    var time = Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleDateString();
  },
  'get_serving_time': function () {
    var time = Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
  'delivery': function () {
    return Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].serving_option === 'Delivery';
  },
  'delivery_address': function () {
    return Order_record.find({
      'product_id': this.product_id,
      'seller_id': Meteor.userId(),
      'buyer_id': this.buyer_id
    }, { sort: { createdAt: -1 }, limit: 1 }).fetch()[0].address;
  },
  'get_menu_name': function () {
    return Menu.findOne({
      '_id': this.product_id
    }).menu_name;
  },
  'get_menu_image': function () {
    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).dishes_id[0];

    var dish_image = Dishes.findOne({
      '_id': dish_image_id
    }).meta.origin

    return dish_image;
  },
  'get_menu_qty': function () {
    return Order_record.findOne({
      'product_id': this.product_id
    }).quantity
  }
})


Template.request_card.events({

  'click #accept': function () {

    var buyer_id = String(this)
    var seller_id = Meteor.userId()
    var order = Order_record.findOne({
      'buyer_id': buyer_id,
      'seller_id': seller_id,
      'status': 'Created'
    })
    var trans_no = parseInt(order.transaction_no);
    var paymentType = order.paymentType;
    var product = Order_record.find({
      'buyer_id': buyer_id,
      'seller_id': seller_id,
      'transaction_no': trans_no,
      'status': 'Created'
    }).fetch()

    product.forEach(add_order_to_transaction)

    charge_card(buyer_id, seller_id, trans_no, paymentType) //used timeout to make sure transaction insert finished before charing card



    function add_order_to_transaction(array_value, index) {

      setTimeout(function () {
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
          var total_price_of_transaction = parseFloat(check.amount) //check the amount in the transaction collection
          total_price_of_transaction += parseFloat(price_of_cart) //add the cart_price into the transaction table
          Meteor.call('transactions.update', trans_no, buyer_id, seller_id, order_id, total_price_of_transaction, stripeToken) //update the transaction
          Meteor.call('order_record.accepted', order_id) //update the order to cooking
        } else {
          console.log(2)
          // bookmark for recheck again
          if (serving_option === 'Delivery') {
            price_of_cart += 0
          } //delivery cost, should have a variable table
          Meteor.call('transactions.accepted', trans_no, buyer_id, seller_id, order_id, price_of_cart, stripeToken, function (err, result) {
            if (err) {
              Materialize.toast("An error has occurred: " + err.message.message, 4000, 'rounded bp-green');
            } else {
              Materialize.toast("Order has been accepted", 4000, 'rounded bp-green');
            }
          }) //insert to transaction
          Meteor.call('order_record.accepted', order_id, function () {
            if (err) {
              Materialize.toast("An error has occurred: " + err.message.message, 4000, 'rounded bp-green');
            } else {
              Materialize.toast("Ready to cook!", 5000, 'rounded bp-green');
            }
          }) //update the order to cooking
        }
        console.log('quantity:' + parseInt(quantity));
        // update order counts for either dishes or menu collection
        if (Dishes.findOne({ _id: product_id })) {
          Meteor.call('dish.order_count_update', product_id, seller_id, parseInt(quantity))
        } else {
          Meteor.call('menu.order_count_update', product_id, seller_id, parseInt(quantity))
        }
      }, 100 * index)

    }

    function charge_card(buyer_id, seller_id, trans_no, paymentType) {
      setTimeout(function () {
        console.log(buyer_id, seller_id, trans_no);
        var transaction = Transactions.find({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': trans_no
        }).fetch();
        console.log(transaction)
        var homecook = Kitchen_details.findOne({
          'user_id': Meteor.userId()
        })
        var stripeToken = transaction.stripeToken;
        //- calculation sum of transactions
        var amount = transaction.reduce(function(total, item){ return total + item.amount }, 0);
        var description = 'Blueplate.co - Charge for ' + homecook.kitchen_name + " - Transaction: " + transaction._id;
        Meteor.call('chargeCard', stripeToken, amount, description, buyer_id, seller_id, paymentType, transaction_no);
      }, 3 * 1000)
    }
    Meteor.call('notification.confirm_order', seller_id, buyer_id);

    console.log('Order confirm. Start send to foodie.');
    var foodie= Profile_details.findOne({ user_id: buyer_id }),
        foodie_phone_number = foodie.mobile;

    console.log('Full number' + foodie_phone_number);
    if (foodie_phone_number.length > 0) {
      var seller_name = Kitchen_details.findOne({
        user_id: seller_id
      }).chef_name;
      var product_string = '';
      for (var i = 0; i < product.length; i++) {
        var dish = Dishes.findOne({
          _id: product[i].product_id
        });
        if (!dish) {
          // if product is a menu
          var menu = Menu.findOne({
            _id: product[i].product_id
          });
          if (i == product.length - 1) {
            product_string += ' ' + menu.menu_name;
          } else {
            product_string += ' ' + menu.menu_name + ', ';
          }
        } else {
          // if product is a dish
          if (i == product.length - 1) {
            product_string += ' ' + dish.dish_name;
          } else {
            product_string += ' ' + dish.dish_name + ', ';
          }
        }
      }
      let content = seller_name + ' has just confirmed your order:'+ product_string +'. Please get ready!';
      Meteor.call('message.sms', foodie_phone_number, content.trim(), (err, res) => {
        if (!err) {
          console.log('Message sent');
          // add new profit to current cycle for chef
          var profit = 0;
          for(var i = 0; i < product.length; i++) {
            let product_id = product[i].product_id;
            var dish = Dishes.findOne({
              _id: product_id
            })
            if (!dish) {
              // product is menu
              let menu = Menu.findOne({
                _id: product_id
              });
              profit = (parseFloat(profit) + parseFloat(menu.menu_selling_price)).toFixed(2);
            } else {
              // product is dish
              profit = (parseFloat(profit) + parseFloat(dish.dish_selling_price)).toFixed(2);
            }
          }
          // get current profit for this chef in this month
          var current_profit = Kitchen_details.findOne({
            user_id: seller_id
          }).current_profit;
          // update with new profit
          profit = (parseFloat(profit) + parseFloat(current_profit)).toFixed(2);
          profit = parseFloat(parseFloat(profit) / 1.15).toFixed(2);
          Meteor.call('claim.updateprofit', seller_id, profit, function(err, res){
            if (!err) {
              console.log(res);
            } else {
              console.log(err);
            }
          })
        }
      });

      // Send email
      Meteor.call(
        'requestdish.sendEmail',
        foodie.first_name + " <" + foodie.email + ">",
        '', /* @param mail from..... default*/
        '', /* @param subject - default*/
        'Hey ' + foodie.first_name + ",\n\n" + content + "\n\n Bon appetite! \n Blueplate"
      );
    }
  },

  'click #reject': function () {

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

      setTimeout(function () {
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
          var total_price_of_transaction = parseFloat(check.amount) //check the amount in the transaction collection
          total_price_of_transaction += parseFloat(price_of_cart) //add the cart_price into the transaction table
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
      // get conversation_id between seller and buyer
      let conversation = Conversation.findOne({
        buyer_id: buyer_id,
        seller_id: seller_id
      });
      Meteor.call('message.disableConversation', conversation._id, (err, res) => {
        if (!err) {
          // send SMS when reject order
          var profile_foodies = Profile_details.findOne({ user_id: buyer_id}),
              foodie_phone_number = profile_foodies.mobile;
              country_code = getCountryCodeFromProfile(profile_foodies);
          
          foodie_phone_number = validatePhoneNumber(foodie_phone_number, country_code);

          var seller_name = Kitchen_details.findOne({user_id: seller_id}).chef_name,
              message = 'Unfortunately, ' + seller_name + ' has just rejected your order.';

          Meteor.call('message.sms', foodie_phone_number, message.trim(), (err, res) => {
            if (!err) {
              console.log('Message sent');
              // Send email
              Meteor.call(
                'requestdish.sendEmail',
                profile_foodies.first_name + " <" + profile_foodies.email + ">",
                '', /* @param mail from..... default*/
                '', /* @param subject - default*/
                'Hey ' + profile_foodies.first_name + ",\n\n" + content + "\n\n Bon appetite! \n Blueplate"
              );
            }
          });
        }
      })
    }
  }
})

Template.order_card.events({

  'click #ready': function () {
    var order_id = String(this)
    Meteor.call('order_record.ready', order_id)
    //console.log(order_id)
    var transactions = Transactions.findOne({ 'order': order_id }).order
    //console.log(transactions);

    Session.set('transaction_ready', 0)

    transactions.forEach(food_ready)

    function food_ready(array_value, index) {

      setTimeout(function () {
        var order_id = array_value
        var order = Order_record.findOne({ '_id': order_id })
        var status = order.status
        var check_digit = parseInt(Session.get('transaction_ready'))


        if (status === 'Ready') {
          check_digit += 1
        } else {
          check_digit = check_digit
        }

        Session.set('transaction_ready', check_digit)

        var check = transactions.length
        var check_digit = parseInt(Session.get('transaction_ready'))
        var buyer_id = order.buyer_id
        var seller_id = order.seller_id
        var trans_id = Transactions.findOne({ 'order': order_id })._id

        if (check_digit === check) {
          Meteor.call('transactions.ready', trans_id)
          Meteor.call('notification.transaction_ready', seller_id, buyer_id)
          console.log("Transactions Ready")
          // send SMS when dish/menu complete
          // send SMS when reject order
          var profile_foodies = Profile_details.findOne({ user_id: buyer_id }),
          foodie_mobile_number = profile_foodies.mobile,
          buyer_name = profile_foodies.foodie_name;

          var message = buyer_name + ', your food is ready. Please enjoy!';
          Meteor.call('message.sms', foodie_mobile_number, message.trim(), (err, res) => {
            if (!err) {
              console.log('Message sent');

              // Send email
              Meteor.call(
                'requestdish.sendEmail',
                profile_foodies.first_name + " <" + profile_foodies.email + ">",
                '', /* @param mail from..... default*/
                '', /* @param subject - default*/
                'Hey ' + profile_foodies.first_name + ",\n\n" + content + "\n\n Bon appetite! \n Blueplate"
              );
            }
          });
        }
      }, 1000)
    }
  },
})

Template.chef_ready_card.events({

  'click #order_complete': function () {
    var trans_id = this._id
    var seller_id = this.seller_id
    var buyer_id = this.buyer_id

    Meteor.call('transactions.complete', trans_id)

    var order = Transactions.findOne({ _id: trans_id }).order

    order.forEach(order_complete)


    function order_complete(array_value, index) {
      var order_id = array_value

      Meteor.call('order_record.complete', order_id)

    }

    Meteor.call('notification.transaction_complete', seller_id, buyer_id);

    // get conversation_id between seller and buyer
    let conversation = Conversation.findOne({
      buyer_id: buyer_id,
      seller_id: seller_id
    });
    Meteor.call('message.disableConversation', conversation._id, (err, res) => {
      if (!err) {
        console.log('Disabled conversation');
      }
    });
    console.log('Order completed. Start send to foodie.');
    var foodie_detail = Profile_details.findOne({ user_id: buyer_id }),
        foodie_mobile_number = foodie_detail.mobile;

    console.log('Full number' + foodie_mobile_number);
    if (foodie_mobile_number.length > 0) {
      let content = 'Thanks for eating with Blueplate. Your order is ready now. Please rate for chef if your dish is good.';
      Meteor.call('message.sms', foodie_mobile_number, content, (err, res) => {
        if (!err) {
          console.log('Message sent');

          // Send email
          Meteor.call(
            'requestdish.sendEmail',
            foodie_detail.first_name + " <" + foodie_detail.email + ">",
            '', /* @param mail from..... default*/
            '', /* @param subject - default*/
            'Hey ' + foodie_detail.first_name + ",\n\n" + content + "\n\n Bon appetite! \n Blueplate"
          );
        }
      });
    }

  }

})

Template.chef_ready_card.helpers({
  'foodie_profile_picture': function () {
    var foodie = Profile_details.findOne({
      'user_id': this.buyer_id
    });
    return foodie.profileImg.origin;

  },

  'get_foodie_name': function () {
    var foodie = Profile_details.findOne({
      'user_id': this.buyer_id
    })
    return foodie.foodie_name;
  },
  'ready_order': function () {
    return this.order;
  },
  'ordered_dish': function () {
    console.log(String(this))
    return Order_record.find({ '_id': String(this), 'seller_id': Meteor.userId() });
  },
  'get_serving_date': function () {
    var time = this.ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleDateString();
  },
  'get_serving_time': function () {
    var time = this.ready_time;
    var time_string = new Date(time)
    return time_string.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
  'delivery': function () {
    return this.serving_option === 'Delivery';
  },
  'product_is_dish': function () {
    if (Dishes.findOne({ '_id': this.product_id })) {
      return true;
    } else {
      return false;
    }
  },
  'get_dish_name': function () {
    return Dishes.findOne({ '_id': this.product_id }).dish_name;
  },
  'get_dish_image': function () {
    var dish_image_id = Dishes.findOne({
      '_id': this.product_id
    }).meta.origin;
    return dish_image_id;
  },
  'get_dish_qty': function () {
    return Order_record.findOne({ 'product_id': this.product_id }).quantity
  },
  'get_menu_name': function () {
    return Menu.findOne({ '_id': this.product_id }).menu_name;
  },
  'get_menu_image': function () {
    var dish_image_id = Menu.findOne({
      '_id': this.product_id
    }).dishes_id[0]

    var images = Dishes.findOne({
      '_id': dish_image_id
    }).meta.origin
    return images;
  },
  'get_menu_qty': function () {
    return Order_record.findOne({ 'product_id': this.product_id }).quantity
  }
})
