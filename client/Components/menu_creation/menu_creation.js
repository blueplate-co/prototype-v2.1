import {
  Template
} from 'meteor/templating';
import {
  Session
} from 'meteor/session';
import {
  Blaze
} from 'meteor/blaze';
import {
  checkboxes_recall
} from '/imports/functions/checkboxes_recall.js'

Template.menu_creation.onRendered(function(){
  window.scrollTo(0,0);
  this.$('modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() {} // Callback for Modal close
    }
  );
  this.$('select').material_select();
  this.$('.tooltipped').tooltip({delay: 500});
  //Check if menu has data instance
  Meteor.call('checkAlreadyMenu', function(err, result){
    if (err) {
      console.log('error when getting available menus. Please try again.');
    } else {
      Blaze.render(Template.view_menu, document.getElementById('card_container'));
    }
  })
});

Template.menu_initiation.events({
  'click #add_menu': function(template) {
    Meteor.call('getUserProfileByID', function (err, result) {
        if (err) {
          console.log('Error when getting user ID: ' + err.message);
        } else {
          if (result) {
            if (typeof result.kitchen_name !== 'undefined' && typeof result.chef_name !== 'undefined' && result.kitchen_name !== null && result.chef_name !== null) {
              $('#menu_creation_container').hide();
              Blaze.render(Template.menu_creation_content, document.getElementById('card_container'));
              Blaze.remove(Template.instance().view);
            } else {
              Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded bp-green');
              $('.modal-overlay').click(); // trick close popup modal
            }
          } else {
            Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded bp-green');
            $('.modal-overlay').click(); // trick close popup modal
          }
        }
    });
  }
});

Template.menu_creation_content.onCreated( function(){
  this.kitchen_detail = this.subscribe('getKitchenDetail');
});

Template.menu_creation_content.onRendered(function(template){
  this.$('#menu_tags').material_chip();
  this.$('select').material_select();
  this.$('.modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() {} // Callback for Modal close
    }
  );
  $('.create_menu_dishes_selection .switch').remove();
  console.log(Template.instance().view._templateInstance.firstNode.parentElement)
});

Template.menu_creation_content.helpers({
  'first_visit': function() {
    Meteor.call('checkAlreadyMenu', function(err, result){
      if (err) {
        console.log('error when getting available menus. Please try again.');
      } else {
        if (result) {
          return false;
        }
      }
    })
  }
})

Template.menu_creation_content.events({
  'click #cancel': function(template) {
    Blaze.remove(Template.instance().view);
    // this template is reused in a modal setting, the followig is the check
    // whether this template render location is on a modal or not.
    // if it is on a modal, view shoudln't be removed and view menu template
    // shoudln't be rendered.
    var current_instance = Template.instance().view._templateInstance.firstNode.parentElement
    if (!current_instance) {
      console.log(Template.instance().view);
      Blaze.remove(Template.instance().view);
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
    var menu_description = $('#menu_description').val();
    var user_id = Meteor.userId();
    var kitchen = Kitchen_details.findOne({'user_id': user_id});
    var kitchen_id = kitchen._id;
    var menu_selling_price = (parseFloat($('#menu_selling_price').val()) + parseFloat($('#menu_selling_price').val() * 0.15)).toFixed(2); // add fee into menu price
    var min_order = $('#min_order_range').val();
    var lead_hours = $('#lead_time_hours_range').val();
    var lead_days = $('#lead_time_days_range').val();
    var serving_option = Session.get('serving_option_tags')
    var dishes_id = Session.get('selected_dishes_id');
    var dishes_details = [];
    var image_id = [];
    var menu_tags = $('#menu_tags').material_chip('data')
    let hasDish = false


    if (typeof dishes_id !== 'undefined') {
      // if (dishes_id.length == 0) {
      //   Materialize.toast('<strong>Menu creation failed</strong>: Menu must has least 1 dish', 8000, 'rounded bp-green');
      //   return false;
      // }else{
      //   hasDish = true;
      // }

      if(dishes_id.length != 0)
      {
        hasDish = true
      }

    } else {
      Materialize.toast('<strong>Menu creation failed</strong>: Menu must has least 1 dish', 8000, 'rounded bp-green');
      return false;
    }

    if(!hasDish)
    {
      Materialize.toast('<strong>Menu creation failed</strong>: Menu must has least 1 dish', 8000, 'rounded bp-green');
      return false
    }

    if (!Session.get('serving_option_tags')) {
      Materialize.toast('Please choose your serving option.', 4000, "rounded bp-green");
      return false;
    } else {
      if (Session.get('serving_option_tags').length == 0) {
        Materialize.toast('Please choose your serving option.', 4000, "rounded bp-green");
        return false;
      }
    }

    //remove 'on' problem
    if (typeof dishes_id !== "undefined" && typeof selected_dishes !== "string"){
      dishes_id = dishes_id.filter(function(a){return a !== "on"})
    }

    //- dish list
    if(hasDish && dishes_id.length > 0)
    {
      //- find some dish
      for (i=0; i < dishes_id.length; i++){
        dishes_details[i] = Dishes.findOne({_id: dishes_id[i]});
        image_id[i] = dishes_details[i].image_id;
      }

    }


    if (menu_name && menu_selling_price && hasDish) {

      //- insert menu
      Meteor.call('menu.insert',
        menu_name,
        menu_description,
        user_id,
        kitchen_id,
        menu_selling_price,
        min_order,
        lead_hours,
        lead_days,
        serving_option,
        dishes_id,
        image_id,
        menu_tags,
        function(err) {
          if (err) Materialize.toast('Oops! Error when create your menu. Please try again. ' + err.message, 4000, 'rounded bp-green');
          Materialize.toast('Menu created', 8000, 'rounded lighten-2');
        }
      );


    } else{
      Materialize.toast('<strong>Menu creation failed</strong>: You are missing either menu name, selling price, or at least a dish in the menu', 8000, 'rounded bp-green');
      return false
    }
    // else {



      // return false;

      // Materialize.toast('<strong>Menu creation failed</strong>: You are missing either menu name, selling price, or at least a dish in the menu', 8000, 'rounded bp-green');
      // return false

    // }
    // this template is reused in a modal setting, the followig is the check
    // whether this template render location is on a modal or not.
    // if it is on a modal, view shoudln't be removed and view menu template
    // shoudln't be rendered.
    var current_instance = Template.instance().view._templateInstance.firstNode.parentElement
    if (!current_instance) {
      Blaze.render(Template.view_menu, document.getElementById('card_container'));
      Blaze.remove(Template.instance().view);
    } else {
      Blaze.remove(Template.instance().view);
    }
    // reset the form after submission
    $('#menu_name').val("");
    $('#menu_selling_price').val("");
    $('#min_order_range').val("");
    $('#lead_time_hours_range').val("");
    $('#lead_time_days_range').val("");
    $('#menu_tags').material_chip({
      data: [],
    });

    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    Session.keys = {};
    Session.set('serving_option_tags', null);
    $('div.modal').scrollTop(0);
    // Materialize.toast('Menu created', 8000, 'rounded lighten-2');
    $('.modal-overlay').click();
    $('div.modal').modal('close');
  }
});

Template.view_menu.onCreated(function(){
  this.menu_retreival = this.subscribe('getListMenus');
});

Template.view_menu.onRendered(function(){
  this.$('.carousel.carousel-slider').carousel({fullWidth: true});
  this.$('.modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() {} // Callback for Modal close
    }
  );;
});

Template.view_menu.helpers({
  'subscription': function() {
    return Template.instance().menu_retreival.ready();
  },
  'menu_retreival': function() {
    return Menu.find({"user_id": Meteor.userId(), deleted: false});
  }
});

Template.view_menu.events({
  'click #add_menu': function() {
    Blaze.render(Template.menu_creation_content,$('#modal_content')[0]);
    console.log($('.modal_footer'));
    $('#modal_footer').hide();
  }
})

Template.modal.events({
  'click #modal_menu_update_btn': function() {
    if ($('#create_menu')) {
      $('#create_menu').click();
    }
    if ($('#update_menu')) {
      $('#update_menu').click();
    }
  },
  'click #close_create_menu_modal': function() {
    if ($('#cancel')) {
      $('#cancel').click();
    }
    if ($('#edit_cancel')) {
      $('#edit_cancel').click();
    }
  }
})

Template.edit_content.onCreated(function() {
  this.user_dishes = this.subscribe('getListDishes')
})

Template.edit_content.onRendered(function() {
    this.$('select').material_select();
    this.$('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function() {} // Callback for Modal close
      }
    );
});

Template.edit_content.helpers({
  'dishes_subscription': function() {
    return Template.instance().user_dishes.ready();
  },
  'menu_retreival_edit': function() {
    var menu_id = Session.get('menu_id');
    var menu_details = Menu.findOne({"_id": menu_id});
    if (menu_details) {
      menu_details.menu_selling_price = parseFloat(menu_details.menu_selling_price / 1.15).toFixed(2);
      return menu_details;
    }
  },
  'get_serving_option': function() {
    Session.set('serving_option_tags', this.serving_option);
  },
  'user_dishes': function() {
    var user_dishes = Dishes.find({"user_id": Meteor.userId(), "deleted": false}).fetch();
    user_dishes.map((item, index) => {
      item.dish_selling_price = Math.round(item.dish_selling_price / 1.15)
    });  
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
    if (dishes_id) {
      for (var i = 0; i < dishes_id.length; i++) {
        document.getElementById(dishes_id[i]).checked = "checked";
      };
    }
    Session.set('menu_id', this._id);
    $('#edit_menu_modal').modal('close');
  },
  'click #update_menu': function() {
    var menu_id = Session.get('menu_id');
    var menu_name = $('#edit_menu_name').val();
    var menu_description = $('#edit_menu_description').val();
    var menu_selling_price = (parseFloat($('#edit_menu_selling_price').val()) + parseFloat($('#edit_menu_selling_price').val() * 0.15)).toFixed(2); // add fee into menu price
    var min_order = $('#edit_min_order_range').val();
    var lead_hours = $('#edit_lead_time_hours_range').val();
    var lead_days = $('#edit_lead_time_days_range').val();
    var serving_option = Session.get('serving_option_tags');
    var dishes_id = Session.get('edited_dishes_id');

    var dishes_details = [];
    var image_id = [];

    for (i=0; i < dishes_id.length; i++){
      dishes_details[i] = Dishes.findOne({_id: dishes_id[i]});
      image_id[i] = dishes_details[i].image_id;
    };

    var menu_tags = $('#edit_menu_tags').material_chip('data')

    if (menu_name && menu_selling_price && dishes_id) {
      Meteor.call('menu.update', menu_id, menu_name, menu_description, menu_selling_price, min_order, lead_hours,lead_days, serving_option, dishes_id, image_id, menu_tags, function(err){
          if (err) {
            Materialize.toast('Oops! Error when update your menu. Please try again. ' + err.message, 4000, 'rounded bp-green');
          } else {
            Materialize.toast('Menu updated!', 4000, 'rounded bp-green');
          }
      });
      $('div.modal').scrollTop(0);
    } else {
      Materialize.toast('<strong>Menu update failed</strong>: You are missing either menu name, selling price, or at least a dish in the menu', 8000, 'rounded bp-green');
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

Template.menu_tags.onRendered(function(){
  var menu_tags_init = Session.get('menu_tags');
  this.$('#edit_menu_tags').material_chip({data: menu_tags_init});
})
