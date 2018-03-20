import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var countdown = new ReactiveCountdown(5);

Template.sent_verification.onCreated(function(){
  countdown.start(function() {
    if (Meteor.userId()) {
      FlowRouter.go('/profile/create_foodie_profile');
    } else {
      FlowRouter.go('/');
    }
  });
});

Template.sent_verification.helpers({
  getCountdown: function() {
    return countdown.get();
  }
});
