import {
  Mongo
} from 'meteor/mongo';
import {
  Meteor
} from 'meteor/meteor';
import {
  check
} from 'meteor/check';
import {
  Match
} from 'meteor/check'
import { log } from 'util';

Meteor.methods({
  'dish.remove' (dish_id) {
    // check format
    // check(dish_id, Match.Any);
    Dishes.update({
      _id: dish_id
    }, {
      $set: {
        deleted: true
      }
    });
  },
  'dish_image.remove' (image_id) {
    // check format
    // check(image_id, String);
    Images.remove({
      _id: image_id
    });
  },
  'dish.update' (dish_id, image_id, user_id, kitchen_id, dish_name, dish_description, serving_option, cooking_time, days, hours, mins, dish_cost, dish_selling_price, dish_profit, allergy_tags, dietary_tags, dish_tags) {
    check(dish_id, String);
    check(image_id, String);
    check(user_id, String);
    check(kitchen_id, String);
    check(dish_name, String);
    check(dish_description, String);
    check(serving_option, Match.Any);
    check(cooking_time, Match.Any);
    check(dish_cost, String);
    check(dish_selling_price, String);
    check(dish_profit, Number);
    check(allergy_tags, Match.Any);
    check(dietary_tags, Match.Any);
    check(dish_tags, Match.Any);

    Dishes.update({
      _id: dish_id
    }, {
      $set: {
        image_id: image_id,
        user_id: Meteor.userId(),
        kitchen_id: kitchen_id,
        dish_name: dish_name,
        dish_description: dish_description,
        serving_option: serving_option,
        cooking_time: cooking_time,
        days: days,
        hours: hours,
        mins: mins,
        dish_cost: dish_cost,
        dish_selling_price: dish_selling_price,
        dish_profit: dish_profit,
        allergy_tags: allergy_tags,
        dietary_tags: dietary_tags,
        dish_tags: dish_tags,
        updatedAt: new Date()
      }
    });
  },
  'dish.online' (dish_id, status) {
    // check format data before excute action
    check(dish_id, String);
    check(status, Boolean);
    Dishes.update({
      _id: dish_id
    }, {
      $set: {
        online_status: status
      }
    });
  },
  'dish.order_count_update' (dish_id, seller_id, count) {
    check(dish_id, String);
    check(seller_id, String);
    check(count, Number);
    Dishes.update({
      _id: dish_id
    }, {
      $inc: {
        order_count: count
      }
    });
    Kitchen_details.update({
      user_id: seller_id
    }, {
      $inc: {
        order_count: count
      }
    });
  }
});

Meteor.publish('getListDishes', function() {
  var current_user = Meteor.userId();
  var user_dishes = Dishes.find({"user_id": current_user, "deleted": false});
  return user_dishes;
});
