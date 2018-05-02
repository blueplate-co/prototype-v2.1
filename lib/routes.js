import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

DishesLikes = new Mongo.Collection('dishes_likes');
MenusLikes = new Mongo.Collection('menus_likes');
KitchenLikes = new Mongo.Collection('kitchen_likes');

FlowRouter.route('/',{
  name: 'Landing Page',
  action(){
    BlazeLayout.render('landing_page')
  }
});

FlowRouter.route('/verify-email/:token',{
  name: 'verify-email',
  action(params) {
    Accounts.verifyEmail(params.token ,(error) => {
      if (error) {
        Materialize.toast(error.reason, 4000, "rounded bp-green");
      } else {
        FlowRouter.go('/sent_verification');
      }
    });
  }
});

FlowRouter.route('/reset-password/:token',{
  name: 'Reset Password',
  action() {
    BlazeLayout.render('reset_password');
  }
});

FlowRouter.route('/reset_redirect',{
  name: 'Successfully reset password',
  action() {
    BlazeLayout.render('reset_redirect');
  }
})

FlowRouter.route('/sent_verification',{
  name: 'Account verified',
  action() {
    BlazeLayout.render('homecook_verification');
  }
});

FlowRouter.route('/main',{
  name: 'Main',
  action(){
    BlazeLayout.render('screen',{render_component:"show_room",navbar:"bp_navbar"});
  }
});

FlowRouter.route('/wish-list',{
  name: 'WishList',
  action(){
    BlazeLayout.render('screen',{render_component:"wish_list",navbar:"bp_navbar"});
  }
});

FlowRouter.route('/profile',{
  name: 'login',
  action() {
    BlazeLayout.render('screen',{render_component:'create_foodie_profile',navbar:"bp_navbar"});
  }
});

FlowRouter.route('/profile/edit_foodie_profile',{
  name: 'Edit Basic Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"edit_foodie_profile",navbar:"bp_navbar"});
  }
});

FlowRouter.route('/profile/show_foodie_profile',{
  name: 'Basic Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"show_foodie_profile",navbar:"bp_navbar"});
  }
});

FlowRouter.route('/profile/create_homecook_profile',{
  name: 'Create Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"create_homecook_profile",navbar:"cooking_navbar"});
  }
});

FlowRouter.route('/profile/edit_homecook_profile',{
  name: 'Edit Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"edit_homecook_profile",navbar:"cooking_navbar"});
  }
});

FlowRouter.route('/profile/show_homecook_profile',{
  name: 'Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"show_homecook_profile",navbar:"cooking_navbar"});
  }
});

FlowRouter.route('/cooking/dashboard',{
  name: 'Cooking Dashboard',
  action() {
    BlazeLayout.render('screen',{render_component:'cooking_dashboard',navbar: "cooking_navbar"});
  }
});

FlowRouter.route('/cooking/dishes',{
  name: 'Cooking - Manage Dishes',
  action() {
    BlazeLayout.render('screen',{render_component:'dishes_summary',navbar: "cooking_navbar"});
  }
});

FlowRouter.route('/cooking/menus',{
  name: 'Cooking - Manage Menus',
  action() {
    BlazeLayout.render('screen',{render_component:'menu_creation',navbar: "cooking_navbar"});
  }
});

FlowRouter.route('/cooking/orders',{
  name: 'Cooking - New/Current Orders',
  action() {
    BlazeLayout.render('screen',{render_component:'start_cooking',navbar: "cooking_navbar"});
  }
});
/**
FlowRouter.route('/:homecook_id/menu/:menu_id',{
  name: 'Menu Details',
  action() {
    BlazeLayout.render('display_menu_details');
  }
});
**/

FlowRouter.route('/shopping_cart',{
  name: 'Shopping Cart',
  action() {
    BlazeLayout.render('screen',{render_component:'shopping_cart_card'});
  }
});

FlowRouter.route('/kitchen/:homecook_id',{
  name: 'Kitchen Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"show_homecook_profile",navbar:"cooking_navbar"});
  }
});

FlowRouter.route('/foodies/:user_id',{
  name: 'Foodie Profile',
  action() {
    BlazeLayout.render('foodie_profile_card');
  }
});

FlowRouter.route('/orders_tracking',{
  name: 'Orders Tracking',
  action() {
    BlazeLayout.render('screen',{render_component:'orders_tracking'})
  }
});

FlowRouter.route('/path_choosing',{
  name: 'Path choosing',
  action() {
    BlazeLayout.render('path_choosing')
  }
});

FlowRouter.route('/followup',{
  name: 'Kitchen Signup Follow Up',
  action() {
    BlazeLayout.render('kitchen_followup');
  }
});

FlowRouter.route('/path_choosing/create_homecook_profile',{
  name: 'Create Homecook Profile',
  action() {
    BlazeLayout.render('create_homecook_profile');
  }
});

FlowRouter.route('/privacy_policy',{
  name: 'Privacy Statement',
  action() {
    BlazeLayout.render('privacy_policy');
  }
});

FlowRouter.route('/see_all/:type',{
  name: 'See all',
  action() {
    BlazeLayout.render('screen',{render_component:'see_all'})
  }
});

FlowRouter.route('/search',{
  name: 'Search result',
  action() {
    BlazeLayout.render('screen',{render_component:'search'})
  }
});

FlowRouter.route('/privacy_policy',{
  name: 'Privacy Policy',
  action() {
    BlazeLayout.render('privacy_policy');
  }
});

FlowRouter.route('/terms_of_use',{
  name: 'Terms of Use',
  action() {
    BlazeLayout.render('terms_of_use');
  }
});

FlowRouter.route('/terms_conditions',{
  name: 'Terms & Conditions',
  action() {
    BlazeLayout.render('terms_conditions');
  }
});

FlowRouter.route('/payment',{
  name: 'Payments',
  action() {
    BlazeLayout.render('screen',{render_component:'payment'})
  }
});

FlowRouter.route('/seller_handbook/admin',{
  name: 'Seller Handbook Admin',
  action() {
    BlazeLayout.render('category_list');

FlowRouter.route('/internal/change_password',{
  name: 'Change Password',
  action() {
    BlazeLayout.render('screen',{render_component:'change_password'});

  }
});
