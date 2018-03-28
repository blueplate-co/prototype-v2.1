import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var countdown = new ReactiveCountdown(5);

Template.sent_verification.onCreated(function(){
  countdown.start(function() {
    if (Meteor.userId()) {
      if(Meteor.users.findOne({_id:Meteor.userId()}).profile.chef_signup){
        FlowRouter.go('/path_choosing/create_homecook_profile');
        } else {
            FlowRouter.go('/main');
          };
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
