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
} from 'meteor/check';
import {
  Session
} from 'meteor/session';
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
    var deleted_tags = [];
    var tags = Dishes.findOne({_id: dish_id}).dish_tags
    for (i=0; i < tags.length; i++) {
      deleted_tags.push(tags[i].tag)
    }
    Meteor.call('tags.remove', deleted_tags, "Dishes", dish_id)
  },
  'dish_image.remove' (image_id) {
    // check format
    // check(image_id, String);
    Images.remove({
      _id: image_id
    });
  },
  'dish.update' (dish_id, image_id, user_id, kitchen_id, dish_name, dish_description, serving_option, cooking_time, days, hours, mins, dish_cost, dish_selling_price, dish_profit, allergy_tags, dietary_tags, dish_tags, imgMeta, deleted_tags) {
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
    console.log('backend:' + imgMeta);

    console.log(dish_selling_price);

    Dishes.update({
      _id: dish_id
    }, {
      $set: {
        image_id: image_id,
        user_id: user_id,
        kitchen_id: kitchen_id,
        dish_name: dish_name,
        dish_description: dish_description,
        serving_option: serving_option,
        cooking_time: cooking_time,
        days: days,
        hours: hours,
        mins: mins,
        dish_cost: dish_cost,
        dish_selling_price: parseFloat(dish_selling_price).toFixed(2),
        dish_profit: dish_profit,
        allergy_tags: allergy_tags,
        dietary_tags: dietary_tags,
        dish_tags: dish_tags,
        meta: imgMeta,
        updatedAt: new Date()
      }
    });
    Meteor.call('new_tags.upsert', dish_tags, "Dishes", dish_id)
    Meteor.call('tags.remove', deleted_tags, "Dishes", dish_id)
  },
  'dish.online' (dish_id, status) {
    // check format data before excute action
    // check(dish_id, String);
    // check(status, Boolean);
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
  },
  'dish.get_detail' (dish_id) {
    return Dishes.findOne({ _id: dish_id });
  },
  'kitchen.get_detail_chitken'(user_id) {
    return Kitchen_details.findOne({user_id: user_id});
  },
  'dish.getDishListShowroom' (kitchen_id) {
    if (kitchen_id.length > 0) {
      return Dishes.find({ kitchen_id: kitchen_id, deleted: false },{ sort: { online_status: -1, createdAt: -1 }}).fetch();
    }
    return Dishes.find({ deleted: false },{ sort: { online_status: -1, createdAt: -1 }, limit: 8 }).fetch();
  }
});

Meteor.publish('getListDishes', function() {
  var current_user = Meteor.userId();
  var user_dishes = Dishes.find({"user_id": current_user, "deleted": false});
  return user_dishes;
});
