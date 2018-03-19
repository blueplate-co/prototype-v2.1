import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

FlowRouter.route('/',{
  name: 'Landing Page',
  action(){
    BlazeLayout.render('landing_page')
  }
});

FlowRouter.route('/ingredients',{
  name: 'Ingredients',
  action(){
    BlazeLayout.render('dishes_collection')
  }
});

FlowRouter.route('/verify-email/:token',{
  name: 'verify-email',
  action(params) {
    Accounts.verifyEmail(params.token ,(error) => {
      if (error) {
        Materialize.toast(error.reason, 4000, "rounded red lighten-2");
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
    BlazeLayout.render('sent_verification');
  }
});

FlowRouter.route('/main',{
  name: 'Main',
  action(){
    BlazeLayout.render('screen',{render_component:"show_room",navbar:"bp_navbar"});
  }
});

FlowRouter.route('/profile/create_foodie_profile',{
  name: 'Create Foodie Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"create_foodie_profile"});
  }
});

FlowRouter.route('/profile/edit_foodie_profile',{
  name: 'Edit Basic Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"edit_foodie_profile"});
  }
});

FlowRouter.route('/profile/create_homecook_profile',{
  name: 'Create Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"create_homecook_profile"});
  }
});

FlowRouter.route('/profile/edit_homecook_profile',{
  name: 'Edit Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"edit_homecook_profile"});
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
    BlazeLayout.render('homecook_profile_page');
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

FlowRouter.route('/rating',{
  name: 'Rating',
  action() {
    BlazeLayout.render('rating_input');
  }
});

FlowRouter.route('/path_choosing',{
  name: 'Choose Path',
  action() {
    BlazeLayout.render('screen',{render_component:"path_choosing"});
  }
});
