import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';

Menu = new Mongo.Collection('menu');

Template.menu_creation.onRendered(function(){
  //Check if menu has data instance
  var data = Menu.find()
  if (data.count()) {
    Blaze.render(Template.view_menu, document.getElementById('card_container'));
  } else {
    Blaze.render(Template.menu_initiation, document.getElementById('card_container'));
  }
});

Template.menu_initiation.events({
  'click #add_menu': function(template) {
    Blaze.render(Template.menu_creation_content, document.getElementById('card_container'));
    Blaze.remove(Template.instance().view);
  }
});

Template.menu_creation_content.onRendered(function(){
  this.$('select').material_select();
  this.$('.modal').modal();
});

Template.menu_creation_content.events({
  'click #cancel': function(template) {
    // this template is reused in a modal setting, the followig is the check
    // whether this template render location is on a modal or not.
    // if it is on a modal, view shoudln't be removed and view menu template
    // shoudln't be rendered.
    var current_instance = Template.instance().view;;
    if (!current_instance.parentView) {
      Blaze.remove(current_instance);
    }
    // reset the form after submission
    $('#menu_name').val("");
    $('#menu_selling_price').val("");
    $('#min_order_range').val("");
    $('#lead_time_hours_range').val("");
    $('#lead_time_days_range').val("");

    var checkboxes = document.getElementsByClassName("dish_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    Session.keys = {};
    $('div.modal').scrollTop(0);
  },
  'click #create_menu': function(event, template) {
    event.preventDefault;
    var menu_name = $('#menu_name').val();
    var createdBy = Meteor.userId();
    var menu_selling_price = $('#menu_selling_price').val();
    var min_order = $('#min_order_range').val();
    var lead_hours = $('#lead_time_hours_range').val();
    var lead_days = $('#lead_time_days_range').val();
    var dishes_id = Session.get('selected_dishes_id');

    Meteor.call('menu.insert',menu_name, createdBy, menu_selling_price, min_order, lead_hours,lead_days,dishes_id);

    // this template is reused in a modal setting, the followig is the check
    // whether this template render location is on a modal or not.
    // if it is on a modal, view shoudln't be removed and view menu template
    // shoudln't be rendered.
    var current_instance = Template.instance().view;;
    if (!current_instance.parentView) {
      Blaze.render(Template.view_menu, document.getElementById('card_container'));
      Blaze.remove(current_instance);
    }
    // reset the form after submission
    $('#menu_name').val("");
    $('#menu_selling_price').val("");
    $('#min_order_range').val("");
    $('#lead_time_hours_range').val("");
    $('#lead_time_days_range').val("");

    var checkboxes = document.getElementsByClassName("dish_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    Session.keys = {};
    $('div.modal').scrollTop(0);
  }
});

Template.dishes_selection.events({
  'change .dish_checkbox': function(event, template) {
    var checked_dishes = template.findAll("input[type=checkbox]:checked");
    var checked_values = checked_dishes.map(function(selection){
      return selection.value;
    });
    Session.set('selected_dishes_id', checked_values);
  }
});

Template.dishes_selection.helpers({
  'user_dishes': function() {
    var current_user = Meteor.userId();
    var user_dishes = Dishes.find({"user_id": current_user});
    return user_dishes;
  }
});

Template.view_menu.onRendered(function(){
  this.$('.modal').modal();
});

Template.view_menu.helpers({
  'menu_retreival': function() {
    return Menu.find();
  }
});

Template.view_menu.events({
  'click #delete_menu': function () {
    Menu.remove(this._id);
  }
})

Template.menu_card.onRendered(function(){
  this.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
});

Template.menu_card.helpers({
  'dishes_retreival': function() {
    var dishes_id = String(this); //converted single object of dish id to string ***important***
    var find_dishes = Dishes.findOne({"_id": dishes_id});
    return find_dishes;
  }
});
