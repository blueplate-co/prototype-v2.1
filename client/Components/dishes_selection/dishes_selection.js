
import { open_dialog_delete_confirm } from '/imports/functions/common';

Template.dishes_selection.onRendered(function(){
  this.$('select').material_select();
  $('.tooltip').tipso({
    speed: 200,
    hideDelay: 500,
    position: 'bottom',
    background: '#343434',
    tooltipHover: true
  })
});

Template.dishes_selection.events({
  'change .dishes_checkbox': function(event, template) {
    var checked_dishes = template.findAll("input[class=dishes_checkbox]:checked");
    console.log(checked_dishes)
    var checked_values = checked_dishes.map(function(selection){
    return selection.value;
  });
  Session.set('selected_dishes_id', checked_values);
  },
  'click #delete_dish': function () {
        
    open_dialog_delete_confirm("Are you sure?", "Are you sure to delete this dish?", () => {},() => {
      Meteor.call('dish.remove', sessionStorage.getItem("deletedDishID"));
      Meteor.call('dish_image.remove', sessionStorage.getItem("deletedDishImagesID"), function(err) {
        if (err) {
          Materialize.toast('Oops! Error when remove dish images. Please try again. ' + err.message, 4000, "rounded bp-green");
        }
      });
      Meteor.call('menu.checkDish', sessionStorage.getItem("deletedDishID"), function(err, result) {
        if (result) {
            var $toastContent = $('<span>This dish is already in menu. Please update your menu.</span>');
            Materialize.toast($toastContent, 12000);
        } else {
            Materialize.toast('The dish has been deleted', 4000, "rounded bp-green");
        }
      });
      sessionStorage.clear(); //clear all things to make sure everything is clean before use it again
    });
    sessionStorage.setItem("deletedDishID", this._id);
    sessionStorage.setItem("deletedDishImagesID", this.image_id);

  },
  'click #edit_dish': function(event, template) {
    event.preventDefault();
    var get_dish_id = this._id;
    var session_object = [];
    session_object[0] = get_dish_id; //Convert this._id (string) to an object
    Session.set('selected_dishes_id', session_object);
    $('#btn_edit_dish').click();
    
    $('#edit_dish_modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
      }
    );
    $('#edit_dish_modal').modal('open'); //Need to trigger modal thru js to make it work
  }
});

Template.dishes_selection.onCreated( function(){
  this.user_dishes = this.subscribe('getListDishes');
});

Template.dishes_selection.helpers({
  'checkbox_id': function() {
    var checkbox_id = Template.instance().view.parentView.name + "_" + this._id;
    return checkbox_id;
  },
  'subscription': function() {
    return Template.instance().user_dishes.ready();
  },
  'user_dishes': function() {
    var current_user = Meteor.userId();
    var user_dishes = Dishes.find({"user_id": current_user, "deleted": false}).fetch();
    user_dishes.map((item, index) => {
      item.dish_selling_price = parseFloat(item.dish_selling_price / 1.15).toFixed(2);
    });
    return user_dishes;
  }
});
