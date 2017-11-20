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

FlowRouter.route('/vertical_menu_card',{
  name: 'vertical_menu',
  action(){
    BlazeLayout.render('vertical_menu_card')
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
    BlazeLayout.render('screen',{navbar:"bp_navbar", render_component:"show_room"});
  }
});

FlowRouter.route('/profile',{
  name: 'Profile',
  action() {
    BlazeLayout.render('screen',{navbar:"bp_navbar", render_component:"profile"});
  }
});

FlowRouter.route('/cooking/',{
  name: 'Cooking Main Page',
  action() {
    BlazeLayout.render('screen',{navbar:"bp_navbar", render_component:'cooking_tab'});
  }
});


FlowRouter.route('/menu/:id',{
  name: 'Menu details',
  action() {
    BlazeLayout.render('screen',{navbar:"bp_navbar", render_component:'display_menu_details'});

FlowRouter.route('/shopping_cart',{
  name: 'Shopping Cart',
  action() {
    BlazeLayout.render('screen',{navbar:"bp_navbar", render_component:'shopping_cart_card'});
  }
});


  }
});
