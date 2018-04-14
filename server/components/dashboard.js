import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'top_sellers.get'() {
    return Dishes.find({user_id: Meteor.userId()}, {limit: 5}, {sort: {order_count: -1}}).fetch();
  }
})
