import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import './create_profile.html';
/**

Template.profile.onRendered(function(){
  //Check if user created profile
  Meteor.call('checkExistedInformation', function(err, result){
    if (err) {
      console.log('Error when checked user has already information');
    } else {
      if (result > 0) { // profile has found
        Blaze.render(Template.edit_profile, document.getElementById('profile'));
      } else {
        Blaze.render(Template.create_profile, document.getElementById('profile'));
      }
    }

    });
  });
**/
