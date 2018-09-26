import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var reset_countdown = new ReactiveCountdown(5);

Template.reset_redirect.onCreated(function(){
  reset_countdown.start(function() {
    if (Meteor.userId()) {
      FlowRouter.go('/');
    } else {
      FlowRouter.go('/');
    }
  });
});

Template.reset_redirect.helpers({
  getCountdown: function() {
    return reset_countdown.get();
  }
});
