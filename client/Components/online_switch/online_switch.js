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
    var switch_id = '#switch_' + this._id;
    var switch_status = $(switch_id).prop('checked');
    var parent_template = Template.instance().view.parentView.parentView.parentView.name;
    with (parent_template === 'Template.dishes_selection') {
      Meteor.call('dish.online', this._id, switch_status, function(error){
        if (error) {
          Materialize.toast('Oops! Error when change status. Please try again.', 4000, "rounded bp-green");
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
