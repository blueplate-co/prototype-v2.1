import {
  Meteor
} from 'meteor/meteor';
import {
  Mongo
} from 'meteor/mongo';

Tags = new Mongo.Collection('tags');

Meteor.methods({
  'check_tags' () {
    return Dishes.distinct("dish_tags.tag")
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
