import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { search_distinct_in_shopping_cart } from '/imports/functions/shopping_cart.js'
import { search_distinct_for_delivery_in_shopping_cart } from '/imports/functions/shopping_cart.js'
import { search_distinct_in_shopping_cart_seller_specific } from '/imports/functions/shopping_cart.js'


Template.shopping_cart_card.helpers({

'check_shopping_cart': function(){
    return Shopping_cart.findOne({"buyer_id": Meteor.userId()})
},

'shopping_cart': function(){
    return Shopping_cart.find({"buyer_id": Meteor.userId()})
},

'total_price_per_dish': function(){
    return this.quantity*this.product_price
},

})

Template.sc_cost_summary.helpers({

  'total_food_price':function(){
    var total_food_price = 0;
    Shopping_cart.find({"buyer_id": Meteor.userId()}).map(function(doc) {
      total_food_price += parseInt(doc.total_price_per_dish);
    });
    return total_food_price;
  },

'total_delivery_cost':function(){

 var total_delivery_cost = 0
 var no_destination = search_distinct_for_delivery_in_shopping_cart('seller_id').length
 var delivery_cost_per_place = 50
 var total_delivery_cost = no_destination * delivery_cost_per_place
 return total_delivery_cost
},

'total_price':function(){
  var total_food_price = 0;
  var no_destination = search_distinct_for_delivery_in_shopping_cart('seller_id').length
  var delivery_cost_per_place = 50
  var total_price = 0

  Shopping_cart.find({"buyer_id": Meteor.userId()}).map(function(doc) {
    total_food_price += parseInt(doc.total_price_per_dish);
  });

  total_price = no_destination * delivery_cost_per_place + total_food_price

  Session.set('cart_total_price', total_price)
  return total_price
}

})


Template.sc_serving_details.onRendered(function() {
  this.$('select').material_select();

  //activate datepicker
    this.$('.datepicker').pickadate({
    selectMonths: 1, // Creates a dropdown to control month
    selectYears: 0, // Creates a dropdown of 15 years to control year,
    default: 'TODAY',
    today: 'TODAY',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true, // Close upon selecting a date,
    format: 'dd/mm/yyyy'
  });

  $('.timepicker').pickatime({
   default: 'now', // Set default time: 'now', '1:30AM', '16:30'
   fromnow: Session.get('max_cooking_time')*1000*60,       // set default time to * milliseconds from now (using with default = 'now')
   twelvehour: true, // Use AM/PM or 24-hour format
   donetext: 'OK', // text for done-button
   cleartext: 'Clear', // text for clear-button
   canceltext: 'Cancel', // Text for cancel-button
   autoclose: false, // automatic close timepicker
   ampmclickable: true, // make AM PM clickable
   aftershow: function(){} //Function for after opening timepicker
 });

})

Template.sc_serving_details.helpers({
service_option_list:[
  { service_option: 'Pick-up', option:'Pick-up'},
  { service_option: 'Delivery', option:'Delivery'},
  { service_option: 'Dine-in', option:'Dine-in'},
],

'check_shopping_cart': function(){
    return Shopping_cart.findOne({"buyer_id": Meteor.userId()})
},

'single_address': function() {
    return search_distinct_in_shopping_cart('seller_id')
},

'single_dish': function(){
    return Shopping_cart.find({"buyer_id": Meteor.userId(), "seller_id": String(this)})

},

'get_chef_name':function(){
    var kitchen = Kitchen_details.findOne({"user_id": String(this)})
    return kitchen.chef_name
},

'get_serving_address':function(){
    var address_option = Session.get('serving_address')
    var profile_details = Profile_details.findOne({'user_id': Meteor.userId()})
    var kitchen_details = Kitchen_details.findOne({'user_id': String(this)})
    var shopping_cart = Shopping_cart.findOne({'buyer_id': Meteor.userId()})

    if(address_option === 'home_address'){
      return profile_details.home_address
    }else if(address_option === 'office_address'){
      return profile_details.office_address
    }else if(address_option === 'current_address'){
      return Session.get('address')
    }else{
      return "Please choose the address for serving!!!"
    }
},

'get_kitchen_address': function(){

    var kitchen = Kitchen_details.findOne({"user_id": String(this)})
    return kitchen.kitchen_address
},

  'get_ready_time': function(){
    var shopping_cart = Shopping_cart.find({'buyer_id':Meteor.userId()}).fetch()
    var max_cooking_time = 0
    for(i=0;i<shopping_cart.length;i++){
      if(shopping_cart[i].ready_time > max_cooking_time){
        max_cooking_time = shopping_cart[i].ready_time

      }else{
        max_cooking_time = max_cooking_time

      }
    }

    Session.set('max_cooking_time', max_cooking_time)

    Meteor.setInterval(function(max_cooking_time){
      var max_cooking_time = Session.get('max_cooking_time')
      var ready_time_ms = Date.now()

      ready_time_ms += max_cooking_time*1000*60
      Session.set('ready_time_ms',ready_time_ms)

      var ready_time_string = new Date(ready_time_ms)
      var yyyy = ready_time_string.getFullYear().toString();
      var mm = (ready_time_string.getMonth()+1).toString();
      var dd  = ready_time_string.getDate().toString();
      var hh = ready_time_string.getHours().toString();
      var min = ready_time_string.getMinutes();
      if(min<10){
        min = '0'+min.toString()
      }
      ready_time = hh+':'+min
      ready_date = dd+'/'+mm+'/'+yyyy
      Session.set('ready_time',ready_time)
      Session.set('ready_date',ready_date)

    }, 1000)
      return Session.get('ready_time')
  },

    'get_ready_date': function(){
      return Session.get('ready_date')
    }
})

Template.sc_serving_details.events({



  'change #serving_address_select':function(event){
    var option = $('#serving_address_select').val();

    Session.set('serving_address', option)
},

  'change .option_select':function(event){
    var field_name = '#'+String(this)+"_option_select"
    var serving_option = $(field_name).val()
    var address = $('#serving_address').text()
    var seller_id = String(this)
    var buyer_id = Meteor.userId()

    Meteor.call('shopping_cart.update_serving',
      buyer_id,
      seller_id,
      address,
      serving_option,
      )
    },

})


Template.sc_payment.helpers({
  'get_credit_card': function(){
      var profile_details = Profile_details.findOne({"user_id": Meteor.userId()})
      return profile_details.card_number
  },
  'get_cvc':function(){
    var profile_details = Profile_details.findOne({"user_id": Meteor.userId()})
    return profile_details.cvv_code
  },
  'get_exp_month':function(){
    var profile_details = Profile_details.findOne({"user_id": Meteor.userId()})
    return profile_details.card_exp_month
  },
  'get_exp_year':function(){
    var profile_details = Profile_details.findOne({"user_id": Meteor.userId()})
    return profile_details.card_exp_year
  },
})



Template.shopping_cart_card.events({
'change .quantity': function(event){
    var cart_id = this._id
    var field_name = this._id+"_quantity"
    var quantity = document.getElementById(field_name).value;
    var total_price_per_dish = quantity*this.product_price

    Meteor.call('shopping_cart.update',
      cart_id,
      quantity,
      total_price_per_dish)
    },

'click .remove_button': function(event){
    var cart_id = this._id;

    Meteor.call('shopping_cart.remove',
      cart_id)
  }

})


Template.sc_payment.events({


'click  #place_order':function(event){

  //hold not to charge until
  //	Meteor.call('chargeCard', stripeToken, amount, description);

  console.log(1)
  var sellers = search_distinct_in_shopping_cart('seller_id')
  console.log(sellers)

  console.log(2)
  setTimeout(sellers.forEach(order_record_insert), 200000)


}
})
function order_record_insert(array_value){
  console.log(3)
  ccNum = $('#card_no').val()
  cvc = $('#cvc_no').val()
  expMo = $('#exp_month').val()
  expYr = $('#exp_year').val()
  amount = Session.get('cart_total_price')*100 /**need modify**/
  profile_details = Profile_details.findOne({user_id: Meteor.userId()})
  

  Stripe.card.createToken({
    number: ccNum,
    cvc: cvc,
    exp_month: expMo,
    exp_year: expYr,
  }, function(status, response) {
    stripeToken = response.id;
    console.log(stripeToken)
    Session.set('token_no', stripeToken)

    console.log(4)
  var seller_id = array_value
  var products = search_distinct_in_shopping_cart_seller_specific('product_id', seller_id)
  console.log(5)
  setTimeout(products.forEach(to_order_record_insert), 200000)
  Session.delete('token_no')
})}

function to_order_record_insert(array_value){
  console.log(6)
  var product_id = array_value;
  var dish = Dishes.findOne({_id: product_id})
  var seller_id = dish.user_id
  var cart_details = Shopping_cart.findOne({'product_id': product_id, 'seller_id': seller_id, 'buyer_id': Meteor.userId()})

  var cart_id = cart_details._id
  var buyer_id = Meteor.userId()

  var address = cart_details.address;
  var quantity = cart_details.quantity;
  var serving_option = cart_details.serving_option;

  var ready_time = Session.get('ready_time_ms')
  console.log(ready_time)

  var total_price = cart_details.total_price_per_dish

  var stripeToken = Session.get('token_no')

  var transaction = Transactions.findOne({'buyer_id': buyer_id, 'seller_id': seller_id}, {sort: {transaction_no: -1}});
  if(transaction ){
  var transaction_no = parseInt(transaction.transaction_no) + 1
  console.log(transaction_no)
  console.log(7)
  }else{
  var transaction_no = 1
  console.log(transaction_no)
  console.log(8)
  }


  console.log(9)
  Meteor.call('order_record.insert', transaction_no, buyer_id, seller_id, product_id, quantity, total_price, address, serving_option, ready_time, stripeToken)
  console.log(10)
  Meteor.call('shopping_cart.remove',cart_id)

}
