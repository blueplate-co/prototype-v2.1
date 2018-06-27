import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

Meteor.publish("unverifiedAccounts", function() {
  return Meteor.users.find({"emails.0.verified": false});
})

Meteor.methods({
  'user.verify' (user_id) {
    Meteor.users.update({
      _id: user_id
    }, {
      $set: {
        "emails.0.verified": true
      }
    })
  }
})
