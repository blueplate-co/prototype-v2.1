import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

DishesLikes = new Mongo.Collection('dishes_likes');
MenusLikes = new Mongo.Collection('menus_likes');
KitchenLikes = new Mongo.Collection('kitchen_likes');
Messages = new Mongo.Collection("messages");
Conversation = new Mongo.Collection("conversation");
Claim_Request = new Mongo.Collection("claim_request");
Bonus_history = new Mongo.Collection("bonus_history");
Promotion_history = new Mongo.Collection("promotion_history");
Chef_Categories = new Mongo.Collection("chef_categories");


function isNotLoggedIn(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      $('#login_modal').modal('open');
      window.Intercom("update");
      // redirect('/main');
    }
}

function isLoggedIn(context, redirect) {
    //- tracking with intercom
    window.Intercom("update");
    if (Meteor.user() || Meteor.loggingIn()) {
        redirect('/');
    }
}

function isNotBlueplateUser(context, redirect) {
  window.Intercom("update");
  if (Meteor.user() || Meteor.loggingIn()) {
    var email = Meteor.user().emails[0].address;
    var masterPieceAccount = ["trang.nguyen@blueplate.co", "michael.lin@blueplate.co"];
    if (email.indexOf(masterPieceAccount) == -1) {
      redirect('/internal/access_denied');
    }
  } else {
    redirect('/');
  }
}

// Check if user is not logged in an redirect to /
FlowRouter.triggers.enter([isNotLoggedIn],{
  except: [
    'Landing Page',
    'Blueplate Seller Handbook',
    'verify-email',
    'Reset Password',
    'Terms of Use',
    'Privacy Policy',
    'Terms & Conditions',
    'Main',
    'Dish Detail',
    'search',
    'Search result',
    'See all',
    'Shopping Cart',
    'Kitchen Profile',
    'Homecook Profile',
    'User Register',
    'User Login'
  ]
});

FlowRouter.route('/intro',{
  name: 'Landing Page',
  action(){
    BlazeLayout.render('landing_page')
  }
});

FlowRouter.route('/',{
  name: 'Main',
  action(){
    // BlazeLayout.render('landing_page');
    BlazeLayout.render('screen',{render_component:"show_room",navbar:"bp_navbar"});
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
  waitOn() {
    return [
      Meteor.subscribe('getDishOfHomecook', null)
    ]
  },
  action(){
    BlazeLayout.render('screen',{render_component:"show_room",navbar:"bp_navbar"})
  }
});



FlowRouter.route('/wish-list',{
  name: 'WishList',
  waitOn() {
    Meteor.subscribe('getWishList')
  },
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
  waitOn() {
    BlazeLayout.render('screen',{render_component:'cooking_dashboard',navbar: "cooking_navbar"});
  },
  action() {
    import('../client/imports/ui/dashboard').then((Dashboard) => {
      const DashboardComponent = Dashboard.default;
      render(React.createElement(DashboardComponent), document.getElementById('dashboard_container'));
    });
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

FlowRouter.route('/shopping_cart',{
  name: 'Shopping Cart',
  waitOn() {
    var localCart = [];
    if (localStorage.localCart) {
      localCart = JSON.parse(localStorage.localCart);
    }
    return [
      Meteor.subscribe('getDishesInShoppingCartLocalOfCurrentUSer', localCart),
      Meteor.subscribe('getMenuInShoppingCartLocalOfCurrentUSer', localCart),
      Meteor.subscribe('getAllKitchenDetailOfSellerLocalInShoppingcart', localCart),
      Meteor.subscribe('getShoppingCartOfCurrentUser'),
      Meteor.subscribe('getDishesInShoppingCartOfCurrentUser'),
      Meteor.subscribe('getMenusInShoppingCartOfCurrentUser'),
      Meteor.subscribe('getAllKitchenDetailOfSellerInShoppingcart'),
      Meteor.subscribe('getUserAccountOfSeller', localCart)
    ]
  },
  action() {
    BlazeLayout.render('screen',{render_component:'shopping_cart_card'})
  }
});

FlowRouter.route('/kitchen/:homecook_id',{
  name: 'Kitchen Profile',
  waitOn(params) {
    [
      Meteor.subscribe('theKitchenDetail', params.homecook_id),
      Meteor.subscribe('getDishOfHomecook', params.homecook_id)
    ]
  },
  action() {
    BlazeLayout.render('screen',{render_component:"show_homecook_profile",navbar:"cooking_navbar"});
  }
});

FlowRouter.route('/dish/:dish_id',{
  name: 'Dish Detail',
  waitOn(params) {
    [
      Meteor.subscribe('theKitchenDetailByDish', params.dish_id),
      Meteor.subscribe('getUserAccountOfSellerByDishId', params.dish_id),
      Meteor.subscribe('getAllDishesOfUserByDishId', params.dish_id)
    ]
  },
  action() {
    BlazeLayout.render('screen',{render_component:'dish_detail'})
  }
});

FlowRouter.route('/category/:category_id/:tag_name',{
  name: 'Category Detail',
  action() {
    BlazeLayout.render('screen',{render_component:'category_detail'})
  }
});

FlowRouter.route('/register',{
  name: 'User Register',
  action() {
    BlazeLayout.render('screen',{render_component:'signup_modal'});
  }
});

FlowRouter.route('/login',{
  name: 'User Login',
  action() {
    BlazeLayout.render('screen',{render_component:'login_page'});
  }
});

FlowRouter.route('/forgot-password',{
  name: 'User Login',
  action() {
    BlazeLayout.render('screen',{render_component:'forgot_password'});
  }
});

FlowRouter.route('/admin-edit-func',{
  name: 'Admin Edit Func',
  waitOn() {
    [
      Meteor.subscribe('theDishes'),
      Meteor.subscribe('theKitchens')
    ]
  },
  action() {
    BlazeLayout.render('screen',{render_component:'admin_edit_function'});
  }
});

// FlowRouter.route('/menu/:menu_id',{
//   name: 'Kitchen Profile',
//   action() {
//     BlazeLayout.render('screen',{render_component:"show_homecook_profile",navbar:"cooking_navbar"});
//   }
// });

FlowRouter.route('/foodies/:user_id',{
  name: 'Foodie Profile',
  action() {
    BlazeLayout.render('foodie_profile_card');
  }
});

FlowRouter.route('/orders_tracking',{
  name: 'Orders Tracking',
  waitOn() {
    [
      Meteor.subscribe('theDishes'),
    ]
  },
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

FlowRouter.route('/Message',{
  name: 'Message',
  waitOn() {
    [
      Meteor.subscribe('getProfileDetailInConversation'),
      Meteor.subscribe('getKitchenProfileInConversation'),
      Meteor.subscribe("theConversations"),
      Meteor.subscribe("theMessages"),
    ]
  },
  action() {
    BlazeLayout.render('screen',{render_component:'message_page'})
  }
});

FlowRouter.route('/deposit',{
  name: 'Deposit',
  action() {
    BlazeLayout.render('screen',{render_component:'deposit'})
  }
});

FlowRouter.route('/claim',{
  name: 'Claim',
  action() {
    BlazeLayout.render('screen',{render_component:'claim'})
  }
});

FlowRouter.route('/seller-handbook/admin',{
  name: 'Seller Handbook Admin',
  action() {
    BlazeLayout.render('screen',{render_component:'category_summary'});
  }
});

FlowRouter.route('/seller-handbook/post/articles',{
  name: 'Seller Handbook - Post Articles',
  action() {
    BlazeLayout.render('screen',{render_component:'article_posting'});
  }
});

FlowRouter.route('/seller-handbook/edit/articles/:article_id',{
  name: 'Seller Handbook - Edit Articles',
  action() {
    BlazeLayout.render('screen',{render_component:'article_posting'});
  }
});

FlowRouter.route('/seller-handbook/',{
  name: 'Blueplate Seller Handbook',
  action() {
    BlazeLayout.render('seller_handbook');
  }
});

FlowRouter.route('/seller-handbook/category/:category',{
  name: 'Blueplate Seller Handbook',
  action() {
    BlazeLayout.render('shb_articles');
  }
});

FlowRouter.route('/seller-handbook/articles/:article_id',{
  name: 'Blueplate Seller Handbook',
  action() {
    BlazeLayout.render('shb_article_display');
  }
});

FlowRouter.route('/util',{
  name: 'Util',
  action() {
    BlazeLayout.render('admin_screen',{admin_component:'util'})
  }
});

FlowRouter.route('/internal/verify_users',{
  name: 'Users Verifications',
  action() {
    BlazeLayout.render('admin_screen',{admin_component:'users_verify'});
  }
});

FlowRouter.route('/internal/change_password',{
  name: 'Change Password',
  action() {
    BlazeLayout.render('admin_screen',{admin_component:'change_password'});
  }
});

FlowRouter.route('/internal/kitchens_map', {
  name: 'Kitchens Distribution',
  action() {
    BlazeLayout.render('admin_screen',{admin_component:'kitchen_mapping'});
  }
})

FlowRouter.route('/internal/access_denied', {
  name: 'Access Denied',
  action() {
    BlazeLayout.render('access_deny');
  }
})

FlowRouter.route('/internal/tags', {
  name: 'Tags',
  action() { 
    BlazeLayout.render('admin_screen',{admin_component:'tags_util'});
  }
})
