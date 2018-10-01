import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { Match } from 'meteor/check';
import { check } from 'meteor/check';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';
import { HTTP } from 'meteor/http'

var logger = require('logzio-nodejs').createLogger({
  token: 'zesEwGtDiMRKZOkAxJocElJJStpdXWMD',
  host: 'listener.logz.io',
  type: 'nodejs'
});

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
        var product_id = Order_record.findOne({ _id: order_id }).product_id;
        if (checking_promotion_dish(product_id).length > 0) {
          promotion_amount += parseFloat(transactions[i].amount * get_amount_promotion(product_id));
        } else {
          promotion_amount += transactions[i].amount;
        }
      }
      var existed_promotion_history = Promotion_history.findOne({ user_id: buyer_id });
      if (existed_promotion_history) {
        var promotion_balance = existed_promotion_history.balance;
      } else {
        var promotion_balance = 0;
      }
      console.log('Promotion amount when charge: ' + promotion_amount);
      console.log('Promotion balance when charge: ' + promotion_balance);
      if (promotion_balance > 0) {
        promotion_amount = promotion_amount - promotion_balance;
        Meteor.call('promotion.update_history', buyer_id, 0, (err, res) => {
          if (!err) {
            console.log('Update promotion to zero');
          }
        });
      }
      chargeAmount = parseFloat((promotion_amount + ( promotion_amount * 0.034 ) + 2.35).toFixed(2));
      var existed_promotion_history = Promotion_history.findOne({ user_id: buyer_id });
      var promotion_balance = existed_promotion_history.balance;
      console.log('Charge amount: ' + chargeAmount);
      charge({
        amount: parseInt(chargeAmount * 100),
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
                      console.log('Amount of transaction: ' + amount);
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
      // check if that buyer has promotion amount in database
      var existed_promotion_history = Promotion_history.findOne({ user_id: buyer_id });
      var temp_amount = 0; //- amount when user not have enough balance to pay
      if (existed_promotion_history) {
        var promotion_balance = existed_promotion_history.balance;
        // get all detail transaction
        var transactions = Transactions.find({
          'buyer_id': buyer_id,
          'seller_id': seller_id,
          'transaction_no': transaction_no
        }).fetch();
        // re-calculate amount of transaction, because maybe have promotion dishes
        var promotion_amount = 0;
        console.log('All transaction: ');
        console.log(transactions);
        for (var i = 0; i < transactions.length; i++) {
          var order_id = transactions[i].order[0];
          console.log('Transaction: ');
          console.log(transactions[i]);
          console.log('Order id: ' + order_id);
          var product_id = Order_record.findOne({ _id: order_id }).product_id;
          console.log('Product id: ' + product_id);
          if (checking_promotion_dish(product_id).length > 0) {
            console.log('is promotion product:');
            promotion_amount += parseFloat(transactions[i].amount * get_amount_promotion(product_id));
          } else {
            console.log('is not promotion product:');
            promotion_amount += transactions[i].amount;
          }
        }
        console.log('Promotion amount: ' + promotion_amount);
        if (promotion_balance > promotion_amount) {
          console.log('when amount of promotion enough to pay transaction');
          var new_promotion_balance = (parseFloat(promotion_balance.toString()) - parseFloat(promotion_amount.toString())).toFixed(2);
          Meteor.call('promotion.update_history', buyer_id, new_promotion_balance, (err, res) => {
            if (!err) {
              console.log('Success update amount of promotion history: ' + new_promotion_balance);
              //- update Stripe balance of seller
              Meteor.call('payment.getStripeBalanceOfSpecific', seller_id, function (err, res) {
                let sellerCustomerId = Meteor.users.findOne({ _id: seller_id }).stripe_id;
                let sellerBalance = parseFloat(res.account_balance / 100).toFixed(2);
                console.log('Current seller balance: ' + sellerBalance);
                var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                var real_amount = promotion_amount / 1.15;
                var newBalance = (parseFloat(sellerBalance.toString()) + (parseFloat(real_amount.toString()))).toFixed(2);
                console.log('Real amount: ' + real_amount);
                console.log('New balance when seller sold: ' + newBalance);
                updatedCustomer(sellerCustomerId, {
                  account_balance: parseInt(parseFloat(newBalance) * 100) // convert to int number and convert to cent number
                }, function(err, customer) {
                  if (!err) {
                    console.log('Update seller successful');
                  } else {
                    console.log(err);
                  }
                });
              });
              return;
            } else {
              console.log('Error when update amount of promotion history');
              console.log(err);
            }
          });
        } else {
          console.log('when amount of promotion NOT enough to pay transaction');
          Meteor.call('promotion.update_history', buyer_id, 0, (err, res) => {
            if (!err) {
              console.log('Update promotion history to zero');
              temp_amount = (parseFloat(amount.toString()) - parseFloat(promotion_balance.toString())).toFixed(2);
              Meteor.call('payment.getStripeBalanceOfSpecific', buyer_id, function (err, res) {
                let balance = parseFloat(res.account_balance / 100).toFixed(2);
                // if balance is enough to pay amount
                // get all detail transaction
                if (temp_amount > 0) {
                  //- when we have a temp amount from previous calculation
                  promotion_amount = temp_amount;
                } else {
                  var transactions = Transactions.find({
                    'buyer_id': buyer_id,
                    'seller_id': seller_id,
                    'transaction_no': transaction_no
                  }).fetch();
                  // re-calculate amount of transaction, because maybe have promotion dishes
                  var promotion_amount = 0;
                  console.log('All transaction: ');
                  console.log(transactions);
                  for (var i = 0; i < transactions.length; i++) {
                    var order_id = transactions[i].order[0];
                    console.log('Transaction: ');
                    console.log(transactions[i]);
                    console.log('Order id: ' + order_id);
                    var product_id = Order_record.findOne({ _id: order_id }).product_id;
                    console.log('Product id: ' + product_id);
                    if (checking_promotion_dish(product_id).length > 0) {
                      console.log('is promotion product:');
                      promotion_amount += parseFloat(transactions[i].amount * get_amount_promotion(product_id));
                    } else {
                      console.log('is not promotion product:');
                      promotion_amount += transactions[i].amount;
                    }
                  }
                  console.log('Promotion amount: ' + promotion_amount);
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
                        var real_amount = amount / 1.15;
                        var newBalance = (parseFloat(sellerBalance.toString()) + (parseFloat(real_amount.toString()))).toFixed(2);
                        console.log('Real amount: ' + real_amount);
                        console.log('New balance when seller sold: ' + newBalance);
                        updatedCustomer(sellerCustomerId, {
                          account_balance: parseInt(parseFloat(newBalance) * 100) // convert to int number and convert to cent number
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
                } else if (parseFloat(promotion_amount) >= parseFloat(balance)){
                  console.log('Balance is NOT enough to pay');
                  console.log('Balance of user: ' + parseFloat(balance));
                  console.log('Amount of order: ' + parseFloat(promotion_amount));
                  // if balance is NOT enough to pay amount
                  var buyerCustomerId = Meteor.users.findOne({ _id: buyer_id }).stripe_id; // get Stripe id of buyer_id
                  // update balance of buyer
                  var updatedCustomer = Meteor.wrapAsync(stripe.customers.update, stripe.customers);
                  console.log('Amount of order: ' + parseFloat(promotion_amount));
                  console.log('Balance of user: ' + parseFloat(balance));
                  var newAmount = (parseFloat(promotion_amount) - parseFloat(balance)).toFixed(2);
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
                                //- sending log to logz
                                logger.log({
                                  message: buyer_id + `'s credits balance was updated.`,
                                  level: 'INFO',
                                  type: 'PAYMENT',
                                  previous_balance: credits,
                                  balance: parseFloat((credits - newAmount).toFixed(2)),
                                  date: new Date()
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
            } else {
              console.log('Error when update promotion history to zero');
              console.log(err);
            }
          });
        }
      }
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
  'marketing.create_task_asana'(task_id, subject, content) {
    var sUrl = "https://app.asana.com/api/1.0/tasks/" + task_id + "/subtasks";
    var options = {
        headers: { 
          Authorization:'Bearer 0/5cd8b332871a5cd9ffb10afab6128186',
          // 'Content-Type': 'application/json'
        },
        params: {
          workspace: '220725248142233',
          projects: '548973336354219',
          assignee: '564872337238154',
          notes: content,
          name: subject
        }
    }; 
    try {
      HTTP.call('POST', sUrl, options,  (error, result) => {
        if (error) {
              console.log("error",error);
        } else {
              //  console.log("result",result);
        }
      });

    } catch (e) {
      // Got a network error, timeout, or HTTP error in the 400 or 500 range.
      console.log("exception",e);
    }
    // console.log('Created task on asana: ')
  }
});