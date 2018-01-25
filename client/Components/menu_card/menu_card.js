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
  Tracker
} from 'meteor/tracker';
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  checkboxes_recall
} from '/imports/functions/checkboxes_recall.js'

Template.menu_card.onRendered(function(){

  // menu card for manage menus screen
  // if (FlowRouter.getRouteName() !== 'Main') {
  //   this.$('.switch_wrapper').unwrap();
  //   this.$('.card-action').remove();
  // }

  $('div.modal').scrollTop(0);
  this.$('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: true, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'right', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  });
  this.$('.carousel.carousel-slider').carousel({fullWidth: true});

  if (this.view.parentView.parentView.parentView.name == "Template.show_room_menu" || this.view.parentView.parentView.parentView.name == "Template.profile_created_menus") {
    this.$('.carousel.carousel-slider').carousel({fullWidth: true});
    //$('.card').addClass('hoverable');
    remove_dropdown = $('.dropdown_element').detach();
    remove_status_switch = $('.online_status').detach();
  }
  if (this.view.parentView.parentView.parentView.parentView.name == "Template.view_menu") {
    this.$('.carousel.carousel-slider').carousel({fullWidth: true});
    remove_order = $('#menu_card .card-action').detach();
    this.$('.switch_wrapper').unwrap();
    this.$('.card-action').remove();
  }
});

Template.menu_card.events({
  'click #delete_menu': function () {
      $('#delete_confirmation_menu').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
      });
      $('#delete_confirmation_menu').modal('open');
      sessionStorage.setItem("deletedMenuID", this._id);
  },
  'click #confirm_delete_menu': function() {
    Meteor.call('menu.delete', sessionStorage.getItem("deletedMenuID"), function(err, result){
      if (err) {
          Materialize.toast('Error occur when delete the menu. Please try again. ' + err.message, 4000, 'rounded red lighten-2');
      } else {
          if (result) { //delete done
            Materialize.toast('Delete success!', 4000, 'rounded red lighten-2');
          } else { //delete undone
            Materialize.toast('Error occur when delete the menu. Please try again.', 4000, 'rounded red lighten-2');
          }
      }
    })
    // Menu.remove(this._id);
    $('edit_menu_modal').modal('close');
    $('#delete_confirmation_menu').modal('close');
    sessionStorage.clear();
  },
  'click #edit_menu': function () {
    $('edit_menu_modal').modal('open')
    Session.set('menu_id', this._id);
    Session.set('dishes_id', this.dishes_id);
  },

  'click #menu_order': function () {
    var menu_details = Menu.findOne({"_id":this._id});
    var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
    var foodie_id = Meteor.userId();

    if (typeof foodie_details == 'undefined' || foodie_details.foodie_name == '') {
      Materialize.toast('Please complete your foodie profile before order.', 4000, 'rounded red lighten-2');
    }

    var homecook_id = menu_details.user_id;
    var homecook_details = Kitchen_details.findOne({"user_id": homecook_id});
    var foodie_name = foodie_details.foodie_name;
    var homecook_name =  homecook_details.chef_name;
    var menu_id = menu_details._id;
    var menu_price = menu_details.menu_selling_price;
    var menu_name = menu_details.menu_name;
    var ready_time = parseInt(menu_details.lead_days) * 24 * 60 + parseInt(menu_details.lead_hours) * 60;
    var quantity = menu_details.min_order;


    var serving_option = Session.get('method')
    var address = Session.get('address')
    //check if the dish has been put in shopping check_shopping_cart
    var order = Shopping_cart.findOne({"product_id":this._id, 'buyer_id':foodie_id});
    var total_price_per_dish = 0;

    if (order)
    {
      var order_id = order._id;
      quantity = parseInt(order.quantity) + 1;
      total_price_per_dish = parseInt(menu_price) * quantity
      Meteor.call('shopping_cart.update',
      order_id,
      quantity,
      total_price_per_dish,
      function(err) {
        if (err) Materialize.toast('Oops! Error when update your shopping cart. Please try again. ' + err.message, 4000, 'rounded red lighten-2');
      }
    )
    }
    else{
      Meteor.call('shopping_cart.insert',
      foodie_id,
      homecook_id,
      foodie_name,
      homecook_name,
      address,
      serving_option,
      ready_time,
      menu_id,
      menu_name,
      quantity,
      menu_price,
      function(err) {
        if (err) Materialize.toast('Oops! Error when add into shopping cart. Please try again. ' + err.message, 4000, "rounded red lighten-2");
      }
      );
    }
    Materialize.toast(menu_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded red lighten-2")
    $('.modal').modal();
    $('.modal').modal('close');

  },

  'click .card-image': function () {
    if ($('#dish_card_large')){
      $('#dish_card_large').remove();
    }
    Session.set('user_id', this.user_id);
    Session.set('menu_id', this._id)

    Blaze.render(Template.display_menu_details,$('#menu_card_display')[0]);
  }
});

Template.menu_card.helpers({
  'dishes_retreival': function() {
    var dishes_id = String(this); //converted single object of dish id to string ***important***
    var find_dishes = Dishes.findOne({"_id": dishes_id, "deleted": false});
    return find_dishes;
  },
  'edit_current_menu': function() {
    return Menu.findOne({"_id": this._id});
  },
  'image_retreival': function() {
    var image_id = String(this);
    var find_images = Images.findOne({"_id": image_id})
    return find_images;
  },
  'get_homecook_image': function() {
    var homecook_image = profile_images.findOne({
      'userId': this.user_id,
      'meta.purpose': 'homecook_profile_picture'
    });
    if (homecook_image) {
      return homecook_image.meta.base64;
    }
  }
});
