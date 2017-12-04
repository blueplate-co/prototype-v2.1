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
        Materialize.toast(error.reason, 4000);
      } else {
        FlowRouter.go('/sent_verification');
      }
    });
  }
});

FlowRouter.route('/sent_verification',{
  name: 'Account verified',
  action() {
    BlazeLayout.render('sent_verification');
  }
});

FlowRouter.route('/main',{
  name: 'Main',
  action(){
    BlazeLayout.render('screen',{navbar: "bp_navbar",render_component:"show_room"});
  }
});

FlowRouter.route('/profile',{
  name: 'Profile',
  action() {
    BlazeLayout.render('screen',{navbar: "bp_navbar",render_component:"profile"});
  }
});

FlowRouter.route('/cooking/',{
  name: 'Cooking Main Page',
  action() {
    BlazeLayout.render('screen',{navbar: "bp_navbar",render_component:'cooking_tab'});
  }
});

FlowRouter.route('/:homecook_id/menu/:menu_id',{
  name: 'Menu Details',
  action() {
    BlazeLayout.render('display_menu_details');
  }
});

FlowRouter.route('/shopping_cart',{
  name: 'Shopping Cart',
  action() {
    BlazeLayout.render('screen',{navbar: "bp_navbar",render_component:'shopping_cart_card'});
  }
});

FlowRouter.route('/kitchen/:homecook_id',{
  name: 'Kitchen Profile',
  action() {
    BlazeLayout.render('homecook_profile_page');
  }
});

FlowRouter.route('/internal_user',{
  name: 'Internal User',
  action() {
    BlazeLayout.render('account_detail_internal');

FlowRouter.route('/hkid',{
  name: 'HKID',
  action() {
    BlazeLayout.render('hkid');
  }
});

FlowRouter.route('/kitchen_status',{
  name: 'kitchen_status',
  action() {
    BlazeLayout.render('kitchen_status');
  }
});

FlowRouter.route('/food_trial',{
  name: 'food_trial',
  action() {
    BlazeLayout.render('food_trial');
  }
});

FlowRouter.route('/experience',{
  name: 'experience',
  action() {
    BlazeLayout.render('experience');
  }
});

FlowRouter.route('/meetup',{
  name: 'meetup',
  action() {
    BlazeLayout.render('meetup');
  }
});
