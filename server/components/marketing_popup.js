import {
  Meteor
} from 'meteor/meteor';
import {
  Mongo
} from 'meteor/mongo';

Popup_tracking = new Mongo.Collection('popup_tracking');

Meteor.methods({
  'popup_tracking.insert'(foodiesYes, chefsYes, No, path, stage, role, district) {
    var clientIP = this.connection.clientAddress;
    Popup_tracking.insert({
      foodiesYes: foodiesYes,
      chefsYes: chefsYes,
      No: No,
      path: path,
      stage: stage,
      role: role,
      district: district,
      createdAt: new Date()
    });
  }
})
