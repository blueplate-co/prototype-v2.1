import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

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
        //
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
<<<<<<< HEAD
    BlazeLayout.render('screen',{render_component:"create_foodie_profile"});
=======
    BlazeLayout.render('screen',{render_component:'create_foodie_profile',navbar:"bp_navbar"});
>>>>>>> 20c625372b700344f8dcc57c236bbf6f9202ba40
  }
});

FlowRouter.route('/profile/edit_foodie_profile',{
  name: 'Edit Basic Profile',
  action() {
<<<<<<< HEAD
    BlazeLayout.render('screen',{render_component:"edit_foodie_profile"});
=======
    BlazeLayout.render('screen',{render_component:"edit_foodie_profile",navbar:"bp_navbar"});
>>>>>>> 20c625372b700344f8dcc57c236bbf6f9202ba40
  }
});

FlowRouter.route('/profile/show_foodie_profile',{
  name: 'Basic Profile',
  action() {
<<<<<<< HEAD
    BlazeLayout.render('screen',{render_component:"show_foodie_profile"});
=======
    BlazeLayout.render('screen',{render_component:"show_foodie_profile",navbar:"bp_navbar"});
>>>>>>> 20c625372b700344f8dcc57c236bbf6f9202ba40
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
<<<<<<< HEAD
=======
  }
});

FlowRouter.route('/profile/show_homecook_profile',{
  name: 'Homecook Profile',
  action() {
    BlazeLayout.render('screen',{render_component:"show_homecook_profile"});
>>>>>>> 20c625372b700344f8dcc57c236bbf6f9202ba40
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

FlowRouter.route('/path_choosing',{
  name: 'Path choosing',
  action() {
    BlazeLayout.render('screen',{render_component:'path_choosing'})
  }
});
