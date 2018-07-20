import {
  Meteor
} from 'meteor/meteor';
import {
  Mongo
} from 'meteor/mongo';

Tags = new Mongo.Collection('tags');

Meteor.methods({
  'check_tags' (collection) {
    if (collection == "Dishes") {
      return Dishes.distinct("dish_tags.tag")
    } else if (collection == "Menus") {
      return Menu.distinct("menu_tags.tag")
    } else if (collection == "Kitchens") {
      return Kitchen_details.distinct("kitchen_tags.tag")
    }
  },
  'tags.insert'(tag_name) {
    if (!Tags.findOne({tag_name: tag_name})) {
      Tags.insert({
        tag_name: tag_name,
        deleted: false
      })
      return tag_name + " is transferred.";
    } else {
      return tag_name + " is already existed.";
    }
  }
})
