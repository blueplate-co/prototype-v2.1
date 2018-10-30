import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Blaze } from 'meteor/blaze';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';

import './login_modal.html';


Template.login_modal.events({
  'click .login-facebook':function(event){
    event.preventDefault();
    $('#loginLoader').show(); // show the loader
    Meteor.loginWithFacebook({requestPermissions:['public_profile','email']}, function(err){
      if (err) {
        $('#loginLoader').hide(); // hide the loader
        console.log('Handle errors here: ', err);
      } else {
        $('#loginLoader').hide(); // hide the loader
        localStorage.setItem("loggedIn", true);
        FlowRouter.go("/");
        $('#login_modal').modal('close');
      }
    });
  },
  'click .login-google':function(event){
    event.preventDefault();
    Meteor.loginWithGoogle({}, function(err){
      $('#loginLoader').show(); // show the loader
      if (err) {
        $('#loginLoader').hide(); // hide the loader
        console.log('Handle errors here: ', err);
      } else {
        $('#loginLoader').hide(); // hide the loader
        localStorage.setItem("loggedIn", true);
        FlowRouter.go("/");
        $('#login_modal').modal('close');
      }
    });
  },
  'click #login, keypress': function(event){
    if (event.which === 1||event.which === 13){
      util.show_loading_progress();
      var path_access = $('#path_access').val();
      var email = $('#login_email').val().trim();
      var password = $('#login_password').val().trim();

      /** if (email.indexOf('@blueplate.co') == -1) {
        // login with outer email from blueplate
        Bert.alert('Only account login with Blueplate email can be logged in!' , 'danger', 'fixed-top');
        return false;
      } **/

      //- basic validation
      var isOK = false;
      //- check null
      if($('#login_email').val().length == 0 || $('#login_password').val().length == 0)
      {
        Bert.alert('Please check your email and password', 'danger','growl-top-right');
        return false;
      } else {

        //- with all the data
        //- checking email
        if(!validateEmail(email)) {
          Bert.alert('Please provide a valid email address', 'danger','growl-top-right');
          $('#login_email').focus();
          return false;
        } else {
          // $('#loginLoader').show(); // show the loader
          // console.log('this email address is ok');
          util.show_loading_progress();
          isOK = true;
        }

      }

      //- if validate is ok
      // if (email || password) {
      if (isOK) {
        Meteor.loginWithPassword(email, password, function(error){

          //- check meteor email verified
          // console.log('meteor email is verified %s', Meteor.user().emails[0].verified);

          if (error) {
            // $('#loginLoader').hide(); // hide the loader
            util.hide_loading_progress()
            Bert.alert( error.reason, 'danger','growl-top-right');
            // return false;
          }
          else if (Meteor.user().emails[0].verified === true) {
            // $('#loginLoader').hide(); // hide the loader
            localStorage.setItem("loggedIn", true);
            $('#login_modal').modal('close');
            if (Meteor.user().profile.chef_signup === true && !Kitchen_details.findOne({user_id: Meteor.userId()})) {
              FlowRouter.go("/followup");
              // check if have already cookies, create a promotion balance for this user
              if (getCookie('promotion')) {
                Meteor.call('promotion.check_history', (err, res) => {
                  let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                  if (Object.keys(res).length == 0) { // this user not already have promotion before
                    Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount ,(err, res) => {
                      if (!err) {
                          delete_cookies('promotion');
                          console.log('OK');
                      }
                    });
                  }
                });
              }
            } else {
              Bert.alert('Login successfully!' , 'success', 'fixed-top');

              path_access != null && path_access.length > 0 ?
                FlowRouter.go(path_access)
              :
                // FlowRouter.go("/");
                ""
                
              // Insert or update data into DB after login success
              var dishesLocal = JSON.parse(localStorage.getItem("localCart"));
              if (dishesLocal) {
                dishesLocal.map( (cart_item, index) => {
                  var foodie_details = Profile_details.findOne({user_id: Meteor.userId()});
                  
                  //check if the dish has been put in shopping check_shopping_cart
                  var order = Shopping_cart.findOne({"product_id": cart_item.product_id, 'buyer_id': Meteor.userId()});
                  var total_price_per_dish = 0;
                  
                  Meteor.call('shopping_cart.find_one', cart_item.product_id, Meteor.userId(), (err, res) => {
                    if (res) {
                        var order_id = order._id;
                        var quantity = parseInt(order.quantity) + cart_item.quantity;
                        total_price_per_dish = parseInt(cart_item.product_price) * quantity;
                        Meteor.call('shopping_cart.update',
                            order_id,
                            quantity,
                            total_price_per_dish,
                            function(err) {
                              localStorage.setItem("localCart", JSON.stringify([]));
                              localStorage.removeItem('localStorage');
  
                              // To make sure the dish we add from localStorage can display on foodies's shopping cart 
                              if (location.pathname.indexOf('shopping_cart') > -1) {
                                location.reload();
                              }
                            }
                        )
                      } else {
                          var foodie_name = foodie_details.foodie_name;
                          Meteor.call('shopping_cart.insert',
                              Meteor.userId(),
                              cart_item.seller_id,
                              foodie_name,
                              cart_item.seller_name,
                              cart_item.address,
                              cart_item.serving_option,
                              cart_item.ready_time,
                              cart_item.product_id,
                              cart_item.product_name,
                              cart_item.quantity,
                              cart_item.product_price,
                              function(err) {
                                localStorage.setItem("localCart", JSON.stringify([]));
                                localStorage.removeItem('localStorage');
  
                                // To make sure the dish we add from localStorage can display on foodies's shopping cart 
                              if (location.pathname.indexOf('shopping_cart') > -1) {
                                location.reload();
                              }
                              }
                          );
                      }
                    });
                  });
              }

              // check if have already cookies, create a promotion balance for this user
              if (getCookie('promotion')) {
                Meteor.call('promotion.check_history', (err, res) => {
                  debugger
                  if (Object.keys(res).length == 0) { // this user not already have promotion before
                    let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                    Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount, (err, res) => {
                      if (!err) {
                          delete_cookies('promotion');
                          console.log('OK');
                      }
                    });
                  }
                });
              }
            }
            util.hide_loading_progress()
          } else {

            //- logout
            Meteor.logout(function(err){
             if (err) {
              // $('#loginLoader').hide(); // hide the loader
              util.hide_loading_progress()
              Bert.alert(err.reason, "danger", "growl-top-right");
             } else {
              // $('#loginLoader').hide(); // hide the loader
              util.hide_loading_progress()
              Session.clear();
              Bert.alert( 'Please verify your email before login!', 'danger','growl-top-right' );
             }
           });

          }
        });
      }
      else {
        // $('#loginLoader').hide(); // hide the loader
        util.hide_loading_progress()
        Bert.alert('Please check your email, password and try again!', "danger", "growl-top-right");
        // return false;
      }


    }
  },
  'click #forgot_password': function() {
    login_content = $('#login_content').remove();
    Blaze.render(Template.forgot_password, $('#login_modal')[0]);
  }
});

//Validation rules
//Trim Helper
var trimInput = function(value){
  return value.replace(/^\s*|\s*$/g,"");
}

var isNotEmpty = function(value){
  if (value && value !== ''){
    return true;
  }
  Bert.alert("Please fill in all fields", "danger", "growl-top-right");
  return false;
}
//Email Validation
isEmail = function(value){
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(filter.test(value)){
    return true;
  }
  Bert.alert("Please use a valid email address","danger","growl-top-right")
  return false;
}
//Check Password fields
isValidPassword=function(password){
  if(password.length <8){
  Bert.alert("Password must be a least 8 charaters", "danger","growl-top-right");
    return false;
  }
    return true;
  };
//Match Password
areValidPassword = function(password, cpassword){
  if(!isValidPassword(password)){
    return false;
  }
  if(password !== cpassword){
    Bert.alert("Password do not match","danger","growl-top-right");
    return false;
  }
    return true;
}

//- validating email
var validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
