import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Tags = new Mongo.Collection('tags');

Meteor.methods({
  'check_tags' () {
    var tags = [];
    var dish_tags = Dishes.distinct("dish_tags.tag");
    var menu_tags = Menu.distinct("menu_tags.tag");
    var kitchen_tags = Kitchen_details.distinct("kitchen_tags.tag");
    for (i=0; i < dish_tags.length; i++) {
      tags.push(dish_tags[i])
    }
    for (i=0; i< menu_tags.length; i++) {
      tags.push(menu_tags[i])
    }
    for (i=0; i< kitchen_tags.length; i++) {
      tags.push(kitchen_tags[i])
    }
    return tags;
  },
  'tags.insert'(tag_name) {
      var dishes_count = Dishes.find({dish_tags: {tag: tag_name}}).count();
      console.log('counts from Dishes Collection: ' + dishes_count);
      var menus_count = Menu.find({menu_tags: {tag: tag_name}}).count();
      console.log('counts from Menu Collection: ' + menus_count);
      var kitchens_count = Kitchen_details.find({kitchen_tags: {tag: tag_name}}).count();
      console.log('counts from Kitchen Collection: ' + kitchens_count);
      var total_count = dishes_count + menus_count + kitchens_count;
    if (!Tags.findOne({tag_name: tag_name})) {
      Tags.insert({
        tag_name: tag_name,
        deleted: false,
        count: total_count,
        createAt: new Date()
      })
      return tag_name + " is transferred.";
    } else {
      return tag_name + " is already existed.";
    }
  },
  'tags.display'() {
    return Tags.find({}, {sort: {count: -1}, limit: 30}).fetch()
  }
})
