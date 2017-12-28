import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';

Template.menu_creation.onRendered(function(){
  this.$('modal').modal();
  this.$('select').material_select();
  this.$('.tooltipped').tooltip({delay: 500});
  //Check if menu has data instance
  Meteor.call('checkAlreadyMenu', function(err, result){
    if (err) {
      console.log('error when get available menu from user');
    } else {
      if (result) {
        Blaze.render(Template.view_menu, document.getElementById('card_container'));
        $('.carousel.carousel-slider').carousel({fullWidth: true});
      } else {
        Blaze.render(Template.menu_initiation, document.getElementById('card_container'));
      }
    }
  })
});

Template.menu_initiation.events({
  'click #add_menu': function(template) {
    Meteor.call('getUserProfileByID', function (err, result) {
        if (err) {
          console.log('Error when get user ID: ' + err);
        } else {
          if (result) {
            if (typeof result.kitchen_name !== 'undefined' && typeof result.chef_name !== 'undefined' && result.kitchen_name !== null && result.chef_name !== null) {
              $('#menu_creation_container').hide();
              Blaze.render(Template.menu_creation_content, document.getElementById('card_container'));
              Blaze.remove(Template.instance().view);
            } else {
              Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded red lighten-2');
              $('.modal-overlay').click(); // trick close popup modal
            }
          } else {
            Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded red lighten-2');
            $('.modal-overlay').click(); // trick close popup modal
          }
        }
    });
  }
});

Template.menu_creation_content.onRendered(function(){
  this.$('select').material_select();
  this.$('.modal').modal();
  $('.create_menu_dishes_selection .switch').remove();
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
    var user_id = Meteor.userId();
    var kitchen = Kitchen_details.findOne({user_id: user_id});
    var kitchen_id = kitchen._id;
    var menu_selling_price = $('#menu_selling_price').val();
    var min_order = $('#min_order_range').val();
    var lead_hours = $('#lead_time_hours_range').val();
    var lead_days = $('#lead_time_days_range').val();
    var dishes_id = Session.get('selected_dishes_id');
    var dishes_details = [];
    var image_id = [];
    if (typeof dishes_id !== 'undefined') {
      if (dishes_id.length == 0) {
          Materialize.toast('<strong>Menu creation failed</strong>: Menu must has least 1 dish', 8000, 'rounded red lighten-2');
          return;
      }
    } else {
      Materialize.toast('<strong>Menu creation failed</strong>: Menu must has least 1 dish', 8000, 'rounded red lighten-2');
      return;
    }
    for (i=0; i < dishes_id.length; i++){
      dishes_details[i] = Dishes.findOne({_id: dishes_id[i]});
      image_id[i] = dishes_details[i].image_id;
    }

    if (menu_name && menu_selling_price && dishes_id) {
      Meteor.call('menu.insert',
        menu_name,
        user_id,
        kitchen_id,
        menu_selling_price,
        min_order,
        lead_hours,
        lead_days,
        dishes_id,
        image_id,
        function(err) {
            if (err) Materialize.toast('Oops! Error when create your menu. Please try again.', 4000, 'rounded red lighten-2');
        }
      );
    } else {
      Materialize.toast('<strong>Menu creation failed</strong>: You are missing either menu name, selling price, or at least a dish in the menu', 8000, 'rounded red lighten-2');
    }
    // this template is reused in a modal setting, the followig is the check
    // whether this template render location is on a modal or not.
    // if it is on a modal, view shoudln't be removed and view menu template
    // shoudln't be rendered.
    var current_instance = Template.instance().view;
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

    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    Session.keys = {};
    $('div.modal').scrollTop(0);
  }
});

Template.view_menu.onRendered(function(){
  this.$('.carousel.carousel-slider').carousel({fullWidth: true});
  this.$('.modal').modal();
});

Template.view_menu.helpers({
  'menu_retreival': function() {
    return Menu.find({"user_id": Meteor.userId(), deleted: false});
  }
});

Template.edit_content.onRendered(function() {
    this.$('select').material_select();
    this.$('.modal').modal();
});

Template.edit_content.helpers({
  'menu_retreival_edit': function() {
    var menu_id = Session.get('menu_id');
    return Menu.findOne({"_id": menu_id});
  },
  'user_dishes': function() {
    var user_dishes = Dishes.find({"user_id": Meteor.userId(), "deleted": false});
    return user_dishes;
  },
  'is_checked': function() {
    dishes_id = Session.get('dishes_id');
    Session.set('edited_dishes_id',dishes_id);
    if (dishes_id.includes(this._id)) {
      return checked="checked";
    }
  }
});

Template.edit_content.events({
  'change .edit_dishes_checkbox': function(event, template) {
    var checked_dishes = template.findAll("input[type=checkbox]:checked");
    var checked_values = checked_dishes.map(function(selection){
      return selection.value;
    });
    Session.set('edited_dishes_id', checked_values);
  }
});

Template.edit_content.events({
  'click #edit_cancel': function() {
    $('div.modal').scrollTop(0);
    // reinstate the form with original information of the menu
    $('#edit_menu_name').val(this.menu_name);
    $('#edit_menu_selling_price').val(this.menu_selling_price);
    $('#edit_min_order_range').val(this.min_order);
    $('#edit_lead_time_hours_range').val(this.lead_hours);
    $('#edit_lead_time_days_range').val(this.lead_days);
    //clear all checkboxes status
    var checkboxes = document.getElementsByClassName("edit_dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    //reinstate back the original status before editing
    var dishes_id = Session.get('dishes_id');
    for (var i = 0; i < dishes_id.length; i++) {
      document.getElementById(dishes_id[i]).checked = "checked";
    };
    Session.set('menu_id', this._id);
  },
  'click #update_menu': function() {
    event.preventDefault;
    var menu_id = Session.get('menu_id');
    var menu_name = $('#edit_menu_name').val();
    var menu_selling_price = $('#edit_menu_selling_price').val();
    var min_order = $('#edit_min_order_range').val();
    var lead_hours = $('#edit_lead_time_hours_range').val();
    var lead_days = $('#edit_lead_time_days_range').val();
    var dishes_id = Session.get('edited_dishes_id');

    var dishes_details = [];
    var image_id = [];

    for (i=0; i < dishes_id.length; i++){
      dishes_details[i] = Dishes.findOne({_id: dishes_id[i]});
      image_id[i] = dishes_details[i].image_id;
    };

    if (menu_name && menu_selling_price && dishes_id) {
      Meteor.call('menu.update',menu_id, menu_name, menu_selling_price, min_order, lead_hours,lead_days,dishes_id,image_id, function(err){
          if (err) Materialize.toast('Oops! Error when update your menu. Please try again.', 4000, 'rounded red lighten-2');
      });
      $('div.modal').scrollTop(0);
    } else {
      Materialize.toast('<strong>Menu update failed</strong>: You are missing either menu name, selling price, or at least a dish in the menu', 8000, 'rounded red lighten-2');
      $('div.modal').scrollTop(0);
    }
    if($('.carousel').hasClass('initialized')) {
      Meteor.setTimeout(function(){
        $('.carousel').removeClass('initialized');
        $('.carousel.carousel-slider').carousel({fullWidth: true});
      },500);
    }
  }
});
