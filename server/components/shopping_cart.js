import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { Match } from 'meteor/check';
import { check } from 'meteor/check';

Order_record = new Mongo.Collection('order_record');

Meteor.methods({
  'chargeCard': function(stripeToken, amount, description, buyer_id, seller_id, paymentType) {
    if (paymentType == 'card') {
      var stripe = require("stripe")("sk_test_K51exlBQovfRkYAag2TKbzjl");

      var buyerStripeId = Meteor.users.findOne({ _id: buyer_id }).stripe_id;
      var buyerEmail = Meteor.users.findOne({ _id: buyer_id }).emails[0].address;
  
      //- run charge for default payment methods of buyerStripeId
      var charge = Meteor.wrapAsync(stripe.charges.create, stripe.charges);
      charge({
        amount: amount * 100,
        currency: "hkd",
        description: description,
        receipt_email: buyerEmail,
        customer: buyerStripeId
      }, function(err, charge) {
        //- charge completed, update balance of seller
        if (!err) {
          var transactionID = charge.balance_transaction; // get transaction id to get fee of this transaction
          var sellerCustomerId = Meteor.users.findOne({ _id: seller_id }).stripe_id; // get Stripe id of seller
          var transaction = Meteor.wrapAsync(stripe.balance.retrieveTransaction, stripe.balance);
          transaction(
            transactionID,
            function(err, balanceTransaction) {
              if (!err) {
                var ammount = balanceTransaction.amount;
                // get balance of current customer seller
                var customer = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
                customer(
                  sellerCustomerId,
                  function(err, customer) {
                    if (!err) {
                      var balance = customer.account_balance;
                      var newBalance = balance + ammount;
                      var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                      updatedCustomer(sellerCustomerId, {
                        account_balance: newBalance
                      }, function(err, customer) {
                        if (!err) {
                          console.log(customer);
                        }
                      });
                    }
                  }
                )
              }
            }
          );
        }
      })
    } else {
      var stripe = require("stripe")("sk_test_K51exlBQovfRkYAag2TKbzjl");
      // when user choose pay by credits
      var customer = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
      var sellerCustomerId = Meteor.users.findOne({ _id: seller_id }).stripe_id; // get Stripe id of seller
      // update balance of seller
      customer(
        sellerCustomerId,
        function(err, customer) {
          if (!err) {
            var balance = customer.account_balance;
            var newBalance = balance + amount;
            var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
            updatedCustomer(sellerCustomerId, {
              account_balance: newBalance * 100
            }, function(err, customer) {
              if (!err) {
                // update credits of buyer
                var credits = Meteor.users.findOne({ _id: buyer_id }).credits;
                Meteor.users.update({
                    _id: buyer_id
                }, {
                    $set: {
                        'credits': credits - amount
                    }
                });
              }
            });
          }
        }
      )
    }
  },

  'order_record.insert'(
    transaction_no,
    buyer_id,
    seller_id,
    product_id,
    quantity,
    total_price,
    address,
    serving_option,
    ready_time,
    stripeToken,
    paymentType
  ){
    check(transaction_no, Number);
    check(buyer_id, String);
    check(seller_id, String);
    check(product_id, String);
    check(quantity, Match.Any);
    check(total_price, Match.Any);
    check(address, Match.Any);
    check(serving_option, String);
    check(ready_time, Match.Any);


    Order_record.insert({
      transaction_no: transaction_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      product_id: product_id,
      quantity: quantity,
      total_price: total_price,
      address: address,
      serving_option: serving_option,
      ready_time: ready_time,
      stripeToken: stripeToken,
      status: 'Created',
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentType: paymentType
    })
  },

  'order_record.accepted'(
    order_id
  ){
    check(order_id, String);

    Order_record.update({
      _id: order_id}, {
        $set:{
          status: 'Cooking',
           updatedAt: new Date()
          }
    })
  },

  'order_record.rejected'(
    order_id
  ){
    check(order_id, String);
    Order_record.update({
      _id: order_id}, {
        $set:{
          status: 'Rejected',
          updatedAt: new Date()
        }
      })
    },

    'order_record.cancelled'(
      order_id
    ){
      check(order_id, String);
      Order_record.update({
        _id: order_id}, {
          $set:{
            status: 'Cancelled',
            updatedAt: new Date()
          }
        })
      },

  'order_record.ready'(
    order_id
  ){
    check(order_id, String);
    Order_record.update({
      _id: order_id}, {
        $set:{
          status: 'Ready',
          updatedAt: new Date()
        }
      })
    },

    'order_record.complete'(
      order_id
    ){
      check(order_id, String);
      Order_record.update({
        _id: order_id}, {
          $set:{
            status: 'Completed',
            updatedAt: new Date()
          }
        })
      },

  'order_record.notify_buyer'(buyer_id){
    check(buyer_id, String);
    Order_record.find(
      {buyer_id: buyer_id, status: "Created"},
      { sort: { _id: -1 }, limit: 1 }).observeChanges({
        added: function(id, order_details) {
          console.log('test');
        }
      })
  },
});