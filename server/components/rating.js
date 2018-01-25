import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Order_ratings = new Mongo.Collection('order_ratings');

Meteor.methods({
  'rating.insert'(rating, order_id) {
    check(order_id, Match.Any);
    check(rating, Number);

    Order_ratings.insert({
      order_id: order_id,
      rating: rating,
      createdAt: new Date()
    });
  },
  'order_record.rating.insert'(rating, order_id) {
    Order_record.update({_id: order_id},{$set: {rating: rating}})
  },
  'average_rating.update'(total_count, new_rating, previous_avg_rating, product_id, seller_id, order_id, quantities) {
    if (total_count > 0) {
      var new_avg_rating = (previous_avg_rating * (total_count - quantities) + new_rating * quantities) / total_count;
      //console.log(new_avg_rating);
      if (Dishes.findOne({_id: product_id})) {
        Dishes.update({
          _id: product_id
        },{
          $set:{
            average_rating: new_avg_rating
          }
        });
      } else {
        Menu.update({
          _id: product_id
        },{
          $set:{
            average_rating: new_avg_rating
          }
        });
      }
      var kitchen_details = Kitchen_details.findOne({user_id: seller_id});
      var kitchen_order_count = kitchen_details.order_count;
      var kitchen_previous_rating = kitchen_details.average_rating;
      var kitchen_new_avg_rating = (kitchen_previous_rating * (kitchen_order_count - quantities) + new_avg_rating * quantities) /kitchen_order_count;
      //console.log(kitchen_new_avg_rating);
      Kitchen_details.update({
        user_id: seller_id
      },{
        $set:{
          average_rating: kitchen_new_avg_rating
        }
      })
      Order_record.update({_id: order_id},{$set:{status: 'Closed'}})
    } else {
      console.log('average_rating.update terminated. Error with total count = 0, that resulting new_avg_rating as infinite.')
    }
  }
});
