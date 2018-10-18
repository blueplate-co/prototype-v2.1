import {
  Mongo
} from 'meteor/mongo';
import {
  Meteor
} from 'meteor/meteor';
import {
  check
} from 'meteor/check';

Menu = new Mongo.Collection('menu');

// set permission about Menu
Menu.deny({
  remove() {
    return true;
  }
});

Meteor.methods({
  'menu.insert' (menu_name, menu_description, user_id, kitchen_id, menu_selling_price, min_order, lead_hours, lead_days, serving_option, dishes_id, image_id, menu_tags) {
    check(menu_name, String);
    check(menu_description, String);
    check(user_id, String);
    check(kitchen_id, String);
    check(menu_selling_price, Match.Any);
    check(min_order, Match.Any);
    check(lead_hours, Match.Any);
    check(lead_days, Match.Any);
    check(serving_option, Match.Any);
    check(dishes_id, Match.Any);
    check(image_id, Match.Any);
    check(menu_tags, Match.Any);

    Menu.insert({
      menu_name: menu_name,
      menu_description: menu_name,
      user_id: Meteor.userId(),
      kitchen_id: kitchen_id,
      createdAt: new Date(),
      menu_selling_price: parseFloat(menu_selling_price).toFixed(2),
      min_order: min_order,
      lead_hours: lead_hours,
      lead_days: lead_days,
      serving_option: serving_option,
      dishes_id: dishes_id,
      image_id: image_id,
      menu_tags: menu_tags,
      updatedAt: new Date(),
      order_count: 0,
      average_rating: 5,
      deleted: false
    }, (err, res) => {
      if (res) {
        Meteor.call('new_tags.upsert', menu_tags, "Menu", res)
      }
    });
  },
  'menu.update' (menu_id, menu_name, menu_description,  menu_selling_price, min_order, lead_hours, lead_days, serving_option, dishes_id, image_id, menu_tags, deleted_tags) {
    check(menu_id, String);
    check(menu_name, String);
    check(menu_selling_price, Match.Any);
    check(min_order, Match.Any);
    check(lead_hours, Match.Any);
    check(lead_days, Match.Any);
    check(serving_option, Match.Any);
    check(dishes_id, Match.Any);
    check(image_id, Match.Any);
    check(menu_tags, Match.Any);

    console.log(menu_description);

    Menu.update({
      _id: menu_id
    }, {
      $set: {
        menu_name: menu_name,
        menu_description: menu_description,
        menu_selling_price: parseFloat(menu_selling_price).toFixed(2),
        min_order: min_order,
        lead_hours: lead_hours,
        lead_days: lead_days,
        serving_option: serving_option,
        dishes_id: dishes_id,
        image_id: image_id,
        menu_tags: menu_tags,
        updatedAt: new Date()
      }
    });
    Meteor.call('new_tags.upsert', menu_tags, "Menu", menu_id)
    Meteor.call('tags.remove', deleted_tags, "Menu", menu_id)
  },
  'menu.online' (menu_id, status) {
    // check(menu_id, String);
    // check(status, Boolean);

    Menu.update({
      _id: menu_id
    }, {
      $set: {
        online_status: status
      }
    });
  },
  'menu.order_count_update' (menu_id, seller_id, count) {
    check(menu_id, String);
    check(seller_id, String);
    check(count, Number);
    Menu.update({
      _id: menu_id
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
    })
  }
});

Meteor.methods({
  'menu.checkDish': function(dish_id) {
    check(dish_id, String);

    return (Menu.findOne({
      'dishes_id': dish_id
    })) ? true : false;
  }
});

Meteor.methods({
  'menu.delete': function(menu_id) {
    check(menu_id, String);
    var deleted_tags = [];
    var tags = Menu.findOne({_id: menu_id}).menu_tags
    for (i=0; i < tags.length; i++) {
      deleted_tags.push(tags[i].tag)
    }
    Meteor.call('tags.remove', deleted_tags, "Menu", menu_id)
    return (Menu.update({
      _id: menu_id
    }, {
      $set: {
        deleted: true
      }
    })) ? true : false;
  }
});

// check current user is has already menu
Meteor.methods({
  'checkAlreadyMenu': function() {
    var count = Menu.find({
      'user_id': Meteor.userId(),
      "deleted": false
    }).count();
    if (count > 0) {
      return true;
    }
    return false;
  }
});

Meteor.methods({
  'menu.getListMenuShowroom': function(kitchen_id) {
    if (kitchen_id.length > 0) {
      return Menu.find({ kitchen_id: kitchen_id, deleted: false }, { sort: { online_status: -1, createdAt: -1 }}).fetch();
    } else {
      return Menu.find({ deleted: false }, { sort: { online_status: -1, createdAt: -1 }, limit: 8 }).fetch();
    }
  }
});

Meteor.publish('getListMenus', function() {
  return Menu.find({"user_id": Meteor.userId(), deleted: false});
});

Meteor.publish('getKitchenDetail', function(){
  return Kitchen_details.find({'user_id': Meteor.userId()});
});
