Transactions = new Mongo.Collection('transactions');

Meteor.methods({

  'transactions.accepted'(
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    price_of_cart,
    stripeToken
  ){
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


  'transactions.update'(
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    total_price_of_transaction,
    stripeToken
  ){Transactions.update(
    { transaction_no: trans_no,
      buyer_id: buyer_id,
      seller_id: seller_id,
      stripeToken: stripeToken},
    {'$push':{'order': order_id},
     '$set': {
       'amount': total_price_of_transaction,
       'updatedAt': new Date()}

  })
},

  'transactions.rejected'(
    trans_no,
    buyer_id,
    seller_id,
    order_id,
    price_of_cart,
    stripeToken
  ){
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

})