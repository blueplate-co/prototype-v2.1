import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { Match } from 'meteor/check';
import { check } from 'meteor/check';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';

Order_record = new Mongo.Collection('order_record');

Meteor.methods({
  'chargeCard': function(stripeToken, amount, description, buyer_id, seller_id, paymentType, transaction_no) {
    if (paymentType == 'card') {
      console.log('Payment by credits card');
      var stripe = require("stripe")("sk_live_kfIO2iUGk72NYkV1apRh70C7");

      var buyerStripeId = Meteor.users.findOne({ _id: buyer_id }).stripe_id;
      var buyerEmail = Meteor.users.findOne({ _id: buyer_id }).emails[0].address;
  
      //- run charge for default payment methods of buyerStripeId
      var charge = Meteor.wrapAsync(stripe.charges.create, stripe.charges);
      console.log('BEGINNING CHARGE');
      console.log('Amount: ' + amount);
      // get all detail transaction
      var transactions = Transactions.find({
        'buyer_id': buyer_id,
        'seller_id': seller_id,
        'transaction_no': transaction_no
      }).fetch();
      // re-calculate amount of transaction, because maybe have promotion dishes
      var promotion_amount = 0;
      for (var i = 0; i < transactions.length; i++) {
        var order_id = transactions[i].order[0];
        var product_id = Order_record.find({ _id: order_id }).product_id;
        if (checking_promotion_dish(product_id).length > 0) {
          promotion_amount += parseFloat(transactions[i].amount * get_amount_promotion(product_id));
        } else {
          promotion_amount += transactions[i].amount;
        }
      }
      console.log('Promotion amount when charge: ' + promotion_amount);
      chargeAmount = parseFloat((promotion_amount + ( promotion_amount * 0.034 ) + 2.35).toFixed(2));
      console.log('Charge amount: ' + chargeAmount);
      charge({
        amount: chargeAmount * 100,
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
                // var amount = balanceTransaction.amount / 100; // convert it to dollar
                // console.log('Get amount of transaction: ' + amount);
                // get balance of current customer seller
                var customer = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
                customer(
                  sellerCustomerId,
                  function(err, customer) {
                    if (!err) {
                      var balance = customer.account_balance / 100; //devide for 100 to convert it to dollar
                      console.log('Get amount of seller in dollar: ' + balance);
                      // update new balance with origin price
                      var newBalance = balance + Math.round(amount / 1.15); // dollar + dollar
                      console.log('New balance of seller: ' + newBalance);
                      var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                      updatedCustomer(sellerCustomerId, {
                        account_balance: newBalance * 100
                      }, function(err, customer) {
                        if (!err) {
                          console.log(customer);
                        } else {
                          //console log update balance of customer err
                          console.log(err);
                        }
                      });
                    } else {
                      //console log get balance of customer err
                      console.log(err);
                    }
                  }
                )
              } else {
                //console log get balance of transaction err
                console.log(err);
              }
            }
          );
        } else {
          //console log charge err
          console.log(err);
        }
      })
    } else {
      console.log('PAY BY CREDITS');
      var stripe = require("stripe")("sk_live_kfIO2iUGk72NYkV1apRh70C7");
      Meteor.call('payment.getStripeBalanceOfSpecific', buyer_id, function (err, res) {
        let balance = parseFloat(res.account_balance / 100).toFixed(2);
        // if balance is enough to pay amount
        // get all detail transaction
        var transactions = Transactions.find({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': transaction_no
        }).fetch();
        // re-calculate amount of transaction, because maybe have promotion dishes
        var promotion_amount = 0;
        for (var i = 0; i < transactions.length; i++) {
          var order_id = transactions[i].order[0];
          var product_id = Order_record.find({ _id: order_id }).product_id;
          if (checking_promotion_dish(product_id).length > 0) {
            promotion_amount += parseFloat(transactions[i].amount * get_amount_promotion(product_id));
          } else {
            promotion_amount += transactions[i].amount;
          }
        }
        if (parseFloat(promotion_amount) < parseFloat(balance)) {
          var buyerCustomerId = Meteor.users.findOne({ _id: buyer_id }).stripe_id; // get Stripe id of buyer_id
          // update balance of buyer
          var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
          var newBalance = parseFloat(balance - promotion_amount).toFixed(2);
          updatedCustomer(buyerCustomerId, {
            account_balance: parseInt(parseFloat(newBalance) * 100) // convert to int number and convert to cent number
          }, function(err, customer) {
            if (!err) {
              console.log(customer);
              // update balance of seller
              // FIRST, get Stripe balance of seller
              Meteor.call('payment.getStripeBalanceOfSpecific', seller_id, function (err, res) {
                let sellerCustomerId = Meteor.users.findOne({ _id: seller_id }).stripe_id;
                let sellerBalance = parseFloat(res.account_balance / 100).toFixed(2);
                console.log('Current seller balance: ' + sellerBalance);
                var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                var newBalance = (parseFloat(sellerBalance.toString()) + (parseFloat(amount.toString()))).toFixed(2);
                console.log('Amount: ' + amount);
                console.log('New balance when seller sold: ' + newBalance);
                updatedCustomer(sellerCustomerId, {
                  account_balance: parseInt(parseFloat(newBalance) * 100 / 1.15) // convert to int number and convert to cent number
                }, function(err, customer) {
                  if (!err) {
                    console.log('Update seller successful');
                  } else {
                    console.log(err);
                  }
                });
              });
            } else {
              console.log(err);
            }
          });
        } else if (parseFloat(amount) >= parseFloat(balance)){
          console.log('Balance is NOT enough to pay');
          console.log('Balance of user: ' + parseFloat(balance));
          console.log('Amount of order: ' + parseFloat(amount));
          // if balance is NOT enough to pay amount
          var buyerCustomerId = Meteor.users.findOne({ _id: buyer_id }).stripe_id; // get Stripe id of buyer_id
          // update balance of buyer
          var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
          console.log('Amount of order: ' + parseFloat(amount));
          console.log('Balance of user: ' + parseFloat(balance));
          var newAmount = (parseFloat(amount) - parseFloat(balance)).toFixed(2);
          updatedCustomer(buyerCustomerId, {
            account_balance: 0
          }, function(err, customer) {
            if (!err) {
              // continue to calculate credits
              // update balance of seller
              // when user choose pay by credits
              var customer = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
              var sellerCustomerId = Meteor.users.findOne({ _id: seller_id }).stripe_id; // get Stripe id of seller
              console.log('Stripe Id of seller: ' + sellerCustomerId);
              customer(
                sellerCustomerId,
                function(err, customer) {
                  if (!err) {
                    console.log('New Amount: ' + newAmount);
                    var balance = customer.account_balance; // in cent
                    console.log('Balance of current user: ' + balance);
                    var newBalance = Math.floor(balance + ( amount * 100 / 1.15 )); // balance convert into cent
                    console.log('New balance of seller: ' + newBalance);
                    var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                    updatedCustomer(sellerCustomerId, {
                      account_balance: newBalance
                    }, function(err, customer) {
                      if (!err) {
                        console.log('Update seller balance');
                        // update credits of buyer
                        var credits = Meteor.users.findOne({ _id: buyer_id }).credits;
                        Meteor.users.update({
                            _id: buyer_id
                        }, {
                            $set: {
                                'credits': parseFloat((credits - newAmount).toFixed(2))
                            }
                        });
                        console.log("Buyer's credits updated: " + parseFloat((credits - newAmount).toFixed(2)));
                      } else {
                        console.log(err);
                      }
                    });
                  }
                }
              ) // end update balance of seller and credits of buyer
            }
          });
        }
      });
    }// end pay by credit
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
      paymentType: paymentType,
      send_sms: true
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
  'order_record.update_send_sms'(order_id) {
    Order_record.update({
      _id: order_id}, {
        $set:{
          send_sms: false,
          updatedAt: new Date()
        }
    });
  },
});