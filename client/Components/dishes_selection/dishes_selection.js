Template.dishes_selection.onRendered(function(){
  this.$('select').material_select();
});

Template.dishes_selection.events({
  'change .dishes_checkbox': function(event, template) {
    var checked_dishes = template.findAll("input[type=checkbox]:checked");
    var checked_values = checked_dishes.map(function(selection){
    return selection.value;
  });
  Session.set('selected_dishes_id', checked_values);
  },
  'click #delete_dish': function () {
    $('#confirm_delete').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%' // Ending top style attribute
      }
    );
    $('#confirm_delete').modal('open');
    sessionStorage.setItem("deletedDishID", this._id);
    sessionStorage.setItem("deletedDishImagesID", this.image_id);
  },
  'click #confirm': function() {
    Meteor.call('dish.remove', sessionStorage.getItem("deletedDishID"));
    Meteor.call('dish_image.remove', sessionStorage.getItem("deletedDishImagesID"));
    sessionStorage.clear();
    Materialize.toast('The dish has been deleted', 4000, 'rounded red lighten-2');
  },
  'click #edit_dish': function() {
    var get_dish_id = this._id;
    var session_object = [];
    session_object[0] = get_dish_id; //Convert this._id (string) to an object
    Session.set('selected_dishes_id', session_object);
    $('.btn_edit_dish').click();
    $('#edit_dish_modal').modal('open'); //Need to trigger modal thru js to make it work
  }
});

Template.dishes_selection.helpers({
  'checkbox_id': function() {
    var checkbox_id = Template.instance().view.parentView.name + "_" + this._id;
    return checkbox_id;
  },
  'user_dishes': function() {
    var current_user = Meteor.userId();
    var user_dishes = Dishes.find({"user_id": current_user, "deleted": false});
    return user_dishes;
  }
});
