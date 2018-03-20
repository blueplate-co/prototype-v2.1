

import './accounts.html';



Template.accounts_form.onRendered(function(){

if(Meteor.userId()){

  FlowRouter.go('/msgDialog');
}


});
