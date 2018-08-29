import { Template } from 'meteor/templating';

Template.online_switch.onRendered(function(){
  $('.tooltip').tipso({
    speed: 400,
    position: 'bottom',
    background: '#343434'
  })
});

Template.online_switch.events({
  'change .online_status': function(instance) {
    var dish_id = this._id;
    var switch_id = '#switch_' + this._id;
    var switch_status = $(switch_id).prop('checked');
    var parent_template = Template.instance().view.parentView.parentView.parentView.name;
    with (parent_template === 'Template.dishes_selection') {
      Meteor.call('dish.online', this._id, switch_status, function(error){
        if (error) {
          Materialize.toast('Oops! Error when change status. Please try again.', 4000, "rounded bp-green");
        } else {
          if (switch_status) { // Only check when status switch from false to true
            Meteor.call('requestdish.find_dish_notification',  dish_id, (err, res) => {
              if (res != null) {
                sentNotificationToRequester(res);
              }
            });
          }
        }
      });
    }
    with (parent_template === 'Template.menu_card') {
      Meteor.call('menu.online', this._id, switch_status, function(err){
        if (err) Materialize.toast('Oops! Error when changing status. Please try again. ' + err.message, 4000, "rounded bp-green");
      });
    }
  }
})

sentNotificationToRequester = function(dishesRequest) {
  var dish_name = Dishes.findOne({ _id: dishesRequest.dish_id }).dish_name,
      buyer = Profile_details.findOne({ user_id: dishesRequest.buyer_id }),
      byer_name = buyer.last_name + " " + buyer.first_name;
      
  var site = document.location.host + "/dish/" + dishesRequest.dish_id;

  if (!dishesRequest.sent_notification) {
    var message = "The dish you requested (" + dish_name + ")  is ready for ordering now. Check it out at " + site + " URL";
    debugger
    Meteor.call('message.sms', buyer.mobile, "Hey! " + message.trim(), (err, res) => {
      if (!err) {
        Meteor.call('requestdish.update', dishesRequest._id, (err, res) => {
          if (!err) {
            console.log('Updated');
          }
        });
        
        // Sent email
        Meteor.call(
          'requestdish.sendEmail',
          byer_name + " <" + buyer.email + ">",
          'the.phan@blueplate.co',
          'blueplate.co!',
          'Hey ' + byer_name + "\n\n" + message + "\n\n Wish you good appetite! \n Warm regard,"
        );
        // console.log('Message sent');
      }
    });
    // console.log("send cofirm request: " + message + " " + buyer_mobile);
  }
};
