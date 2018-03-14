import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { Tracker } from 'meteor/tracker';
import { get_current_location } from '/imports/functions/get_current_location.js';

Template.navbar.onRendered(function(){
  //activate slideNav
  this.$(".nav_brand_logo").sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens,
    //onOpen: function(el) { /* Do Stuff* / }, // A function to be called when sideNav is opened
    //onClose: function(el) { /* Do Stuff* / }, // A function to be called when sideNav is closed
  });
});

Template.navbar.helpers ({
    "load_avatar": function(){
        var check_profile_picture = profile_images.findOne({
          'userId': Meteor.userId(),
          'meta.purpose': 'profile_picture'
        });
        if (check_profile_picture) {
          images_url = check_profile_picture.meta.base64;
          return images_url;
        } else {
          return '/profile_upload/user.jpg';
        }
    }
});

Template.bp_navbar.onRendered(function(){

  // activate location dropdown based on addresses available in profile details
  Tracker.autorun(()=> {
    var profile_details = Profile_details.findOne({user_id: Meteor.userId()});
    if (profile_details) {
      $('#home_location').val(profile_details.home_address);
      $('#office_location').val(profile_details.office_address);
      $('#pin_location').val("pin_location");
      if (profile_details.home_address && profile_details.office_address) {
        //this.$('select').material_select();
        $('#home_location').val(profile_details.home_address);
        $('#office_location').val(profile_details.office_address);
        $('#pin_location').val("pin_location");
      } else if (!profile_details.home_address) {
        $('#home_location').prop('disabled', true);
        //$('select').material_select();
        $('#office_location').val(profile_details.office_address);
        $('#pin_location').val("pin_location");
      } else if (!profile_details.office_address){
        $('#office_location').prop('disabled', true);
        //this.$('select').material_select();
        $('#home_location').val(profile_details.home_address);
        $('#pin_location').val("pin_location");
      } else {
        $('#home_location').prop('disabled', true);
        $('#office_location').prop('disabled', true);
        //this.$('select').material_select();
        $('#pin_location').val("pin_location");
      }
    } else {
      $('#home_location').prop('disabled', true);
      $('#office_location').prop('disabled', true);
      //this.$('select').material_select();
      $('#pin_location').val("pin_location");
    }
    if (!navigator.geolocation) {
      $('#current_location').prop('disabled', true);
    }
    this.$('select').material_select();
  });
});

Template.bp_navbar.helpers ({
  "check_shopping_cart": function(){
    var total_item_in_cart = 0;
    Shopping_cart.find({"buyer_id": Meteor.userId()}).map(function(doc) {
      total_item_in_cart += parseInt(doc.quantity);
    });
    return total_item_in_cart;
  },

 location_option_list:[
   {location_option: 'Home', option:'Home', id:'home_location'},
   {location_option: 'Office', option:'Office', id:'office_location'},
   {location_option: 'Current location', option:'current_location', id:'current_location'},
   {location_option: 'Input custom location', option:'Input custom location', id:'pin_location'},
 ],
 service_option_list:[
   { service_option: 'Pick-up', option:'Pick-up'},
   { service_option: 'Delivery', option:'Delivery'},
   { service_option: 'Dine-in', option:'Dine-in'},
 ]
});

Template.navbar.events({
  'click .navbar_profile_logo': function() {
    FlowRouter.go('/profile');
  },
  'click #home_link': function () {
    FlowRouter.go('/main');
   $(".nav_brand_logo").sideNav('hide');
  },
 'click #food_search': function () {
   FlowRouter.go('/main');
  $(".nav_brand_logo").sideNav('hide');
 },
 'click #shopping_cart': function() {
   FlowRouter.go('/shopping_cart');
  $(".nav_brand_logo").sideNav('hide');
 },
 'click #foodies_orders_tracking': function() {
   FlowRouter.go('/orders_tracking');
   $('.nav_brand_logo').sideNav('hide');
 },
 'click #cooking_dashboard': function () {
   FlowRouter.go('/cooking/dashboard');
   $('#top_nav_cooking_dashboard').addClass('active');
   $('#top_nav_manage_dishes').removeClass('active');
   $('#top_nav_manage_menus').removeClass('active');
   $('#top_nav_manage_orders').removeClass('active');
   $(".nav_brand_logo").sideNav('hide');
 },
 'click #manage_dishes': function() {
   FlowRouter.go('/cooking/dishes');
   $('#top_nav_cooking_dashboard').removeClass('active');
   $('#top_nav_manage_dishes').addClass('active');
   $('#top_nav_manage_menus').removeClass('active');
   $('#top_nav_manage_orders').removeClass('active');
   $(".nav_brand_logo").sideNav('hide');
 },
 'click #manage_menus': function() {
   FlowRouter.go('/cooking/menus');
   $('#top_nav_cooking_dashboard').removeClass('active');
   $('#top_nav_manage_dishes').removeClass('active');
   $('#top_nav_manage_menus').addClass('active');
   $('#top_nav_manage_orders').removeClass('active');
   $(".nav_brand_logo").sideNav('hide');
 },
 'click #manage_orders': function() {
   FlowRouter.go('/cooking/orders');
   $('#top_nav_cooking_dashboard').removeClass('active');
   $('#top_nav_manage_dishes').removeClass('active');
   $('#top_nav_manage_menus').removeClass('active');
   $('#top_nav_manage_orders').addClass('active');
   $(".nav_brand_logo").sideNav('hide');
 },
 'click #profile_link': function () {
   FlowRouter.go('/profile/show_foodie_profile');
   $(".nav_brand_logo").sideNav('hide');
 },
 'click #logout_link': function () {
   Meteor.call('messages.clear', Meteor.userId(), function(err) {
     if (err) Materialize.toast('Oops! Error when clearing message. Please try again. ' + err.message, 4000, 'rounded red lighten-2');
   });
   Session.keys = {}
   localStorage.setItem("loggedIn", false);
   Meteor.logout();
   FlowRouter.go('/');
   $('#sidenav-overlay').remove();
 },
});

Template.bp_navbar.events({
 'change #by_place': function(event, template){
   var location_value = $(event.currentTarget).val();
   if (location_value === "pin_location") {
     if ($('#location_search_input_card').length < 1) {
       Blaze.render(Template.location_search_card,$('.navbar_options_wrapper')[0]);
     };
     $('#location_search_input').focus(function(){
       $(this).select();
     });
    } else if (location_value === "current_location") {
      get_current_location();
    } else {
     Session.set('address', location_value);
   }
 },
 'change #by_method': function(event, template){
   Session.set('method', $(event.currentTarget).val());
 },
 'blur #location_search_input_card': function(event) {
   if ($('#location_search_input_card').length > 0) {
     $(event.currentTarget).remove();
   }
 }
});

Template.cooking_navbar.onRendered(function(){
})

Template.cooking_navbar.events({
  'click #top_nav_cooking_dashboard': function () {
    FlowRouter.go('/cooking/dashboard');
    $('#top_nav_cooking_dashboard').addClass('active');
    $('#top_nav_manage_dishes').removeClass('active');
    $('#top_nav_manage_menus').removeClass('active');
    $('#top_nav_manage_orders').removeClass('active');
  },
  'click #top_nav_manage_dishes': function() {
    FlowRouter.go('/cooking/dishes');
    $('#top_nav_cooking_dashboard').removeClass('active');
    $('#top_nav_manage_dishes').addClass('active');
    $('#top_nav_manage_menus').removeClass('active');
    $('#top_nav_manage_orders').removeClass('active');
  },
  'click #top_nav_manage_menus': function() {
    FlowRouter.go('/cooking/menus');
    $('#top_nav_cooking_dashboard').removeClass('active');
    $('#top_nav_manage_dishes').removeClass('active');
    $('#top_nav_manage_menus').addClass('active');
    $('#top_nav_manage_orders').removeClass('active');
  },
  'click #top_nav_manage_orders': function() {
    FlowRouter.go('/cooking/orders');
    $('#top_nav_cooking_dashboard').removeClass('active');
    $('#top_nav_manage_dishes').removeClass('active');
    $('#top_nav_manage_menus').removeClass('active');
    $('#top_nav_manage_orders').addClass('active');
  },
})
