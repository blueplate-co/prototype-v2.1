import { Match } from 'meteor/check';
import { check } from 'meteor/check';

Transactions = new Mongo.Collection('transactions');

Meteor.publish('theProfileDetail', function(){
    return Profile_details.find({});
});

Meteor.publish('theKitchenDetail', function(){
    return Kitchen_details.find();
});

Transactions.deny({
  remove() {
    return true
  }
})

Meteor.methods({

  'transactions.accepted' (
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    price_of_cart,
    stripeToken
  ) {
    check(trans_no, Number);
    check(buyer_id, String);
    check(seller_id, String);
    check(order_id, String);
    check(price_of_cart, Match.Any);
    check(stripeToken, Match.Any);

    Transactions.insert({
      transaction_no: trans_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      'order': [order_id],
      status: 'Accepted',
      amount: price_of_cart,
      stripeToken: stripeToken,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  },


  'transactions.update' (
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    total_price_of_transaction,
    stripeToken
  ) {
    check(trans_no, Match.Any);
    check(buyer_id, String);
    check(seller_id, String);
    check(order_id, String);
    check(total_price_of_transaction, Match.Any);

    Transactions.update({
      transaction_no: trans_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      stripeToken: stripeToken
    }, {
      '$push': {
        'order': order_id
      },
      '$set': {
        'amount': total_price_of_transaction,
        'updatedAt': new Date()
      }

    })
  },

  'transactions.rejected' (
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    price_of_cart,
    stripeToken
  ) {
    check(trans_no, Match.Any);
    check(buyer_id, String);
    check(seller_id, String);
    check(order_id, String);
    check(price_of_cart, Match.Any);
    check(stripeToken, Match.Any);

    Transactions.insert({
      transaction_no: trans_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      'order': [order_id],
      status: 'Rejected',
      amount: price_of_cart,
      stripeToken: stripeToken,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  },

  'transactions.cancelled' (
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    price_of_cart,
    stripeToken
  ) {
    check(trans_no, Match.Any);
    check(buyer_id, String);
    check(seller_id, String);
    check(order_id, String);
    check(price_of_cart, Match.Any);
    check(stripeToken, Match.Any);

    Transactions.insert({
      transaction_no: trans_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      'order': [order_id],
      status: 'Cancelled',
      amount: price_of_cart,
      stripeToken: stripeToken,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  },

  'transactions.ready' (
    trans_id
  ) {
    check(trans_id, String);

    Transactions.update({
      _id: trans_id
    }, {
      '$set': {
        status: 'Ready',
        updatedAt: new Date()
      }

    })
  },

  'transactions.complete'(
    trans_id
  ){
    Transactions.update({
      _id: trans_id
    },{
      '$set':{
        status: 'Completed',
        updatedAt: new Date()
      }
    })
  },
  'transactions.close'(trans_id) {
    Transactions.update({
      _id: trans_id
    }, {
    '$set': {
      status: 'Closed',
      updatedAt: new Date()
    }
    })
  }
});

Meteor.publish('listAllOrdersSeller', function() {
  var sellerOrders =  Order_record.find({ 'seller_id': Meteor.userId() });
  return sellerOrders;
});

Meteor.publish('listAllOrdersBuyer', function() {
  var buyerOrders =  Order_record.find({ 'buyer_id': Meteor.userId() });
  return buyerOrders;
});

Meteor.publish('listAllTransactions', function() {
  var transactions = Transactions.find({});
  return transactions;
})
