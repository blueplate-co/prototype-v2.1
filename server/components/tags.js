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
    Tags.insert({
      tag_name: tag_name,
      deleted: false
    })
  }
})
