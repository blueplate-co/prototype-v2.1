import {
  Accounts
} from 'meteor/accounts-base';
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  Template
} from 'meteor/templating';
import {
  Blaze
} from 'meteor/blaze';

import React from 'react';
import { render } from 'react-dom';

import LandingDishList from '../../imports/ui/landing_dish_list.js';




import './landing_page.html';

Template.landing_page.onRendered(function () {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $('body').css('overflow-y', 'hidden');
  Session.set('login_clicked', false);
  Session.set('popup_appeared', false);
  this.$('#login_modal').modal();
  this.$('.collapsible').collapsible();

  render (<LandingDishList />, document.getElementById('landing_dishes_list'));
  // everything is loaded
  // window.onload = function () {
  //   setTimeout(() => {
  //     $('body').css('overflow-y', 'scroll');
  //     $(document).scrollTop(0);
  //     $('.loader-wrapper').fadeOut('slow');
  //     $('.slogan').removeClass('notloaded');

  //     if (!window.detectmob) {
  //       // $('.what_happen').hide();
  //       // $('.why_is_there').hide();
  //       // $('.why_is_this').hide();
  //       // $('.how_can_we').hide();
  //       // $('.join_us').hide();
  //     }

  //     $('.vet_photo .changing').click(function(){
  //       alert('asfhsdjfg');
  //     });
  //     console.log('loading...');
  //   }, 1000);
  // }

/**
  setTimeout(() => {
      if (Session.get('login_clicked') == false) {
        $('#marketing_popup2_container').modal('open', {
          dismissible: false, // Modal can be dismissed by clicking outside of the modal
          opacity: .5, // Opacity of modal background
          inDuration: 300, // Transition in duration
          outDuration: 200, // Transition out duration
          startingTop: '4%', // Starting top style attribute
          endingTop: '10%', // Ending top style attribute
          ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
          },
          complete: function() {} // Callback for Modal close
        });
        Session.set('popup_appeared', true);
      }
    }, 5000);


    $(window).scroll(function(){
      setTimeout(() => {
          if (Session.get('popup_appeared') == false) {
            $('#marketing_popup2_container').modal('open', {
              dismissible: false, // Modal can be dismissed by clicking outside of the modal
              opacity: .5, // Opacity of modal background
              inDuration: 300, // Transition in duration
              outDuration: 200, // Transition out duration
              startingTop: '4%', // Starting top style attribute
              endingTop: '10%', // Ending top style attribute
              ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
              },
              complete: function() {} // Callback for Modal close
            });
            Session.set('popup_appeared', true);
          }
        }, 2000);
    })

    **/


  setTimeout(() => {
    $('body').css('overflow-y', 'scroll');
    $('.loader-wrapper').fadeOut('slow');
    $('.slogan').removeClass('notloaded');

    if (!window.detectmob) {
      // $('.what_happen').hide();
      // $('.why_is_there').hide();
      // $('.why_is_this').hide();
      // $('.how_can_we').hide();
      // $('.join_us').hide();
    }

    $('.vet_photo .changing').click(function(){
      alert('asfhsdjfg');
    });
    window.scrollTo(0,0);
  }, 1000);

  var options = [{
    selector: '.banana',
    offset: 200,
    callback: function(el) {
      Materialize.fadeInImage($(el));
    }
  }, {
    selector: '.wall',
    offset: 200,
    callback: function(el) {
      Materialize.fadeInImage($(el));
    }
    }, {
    selector: '.green',
    offset: 200,
    callback: function(el) {
      Materialize.fadeInImage($(el));
    }
  }];

  Materialize.scrollFire(options);
});

Template.landing_page.events({
  'click .chef_signup': function() {
    //- send to Facebook Pixel
    if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
      fbq('trackCustom', 'ClickSignUp');
    }
  },
  'click .login_icon': function() {
    Session.set('login_clicked', true);
  },
  'click .logo': function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  },
  'click .collapsible-header': function(event) {
    if ($(event.target).hasClass('active')) {
      $(event.target).children('i').addClass('rotate')
    } else {
      $(event.target).children('i').removeClass('rotate')
    }
  },
  'click .landing_see_more': function(event) {
    FlowRouter.go('/main');
  }
})

Template.landing_page.helpers({
  what_happen_details: [{
      title: "What’s happening to our food?",
      background_large: '"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing2.jpg"',
      details: "Currently the world is producing more food than ever but with more food being wasted than consumed.\
      Around 25% of our food goes to waste, that’s almost one quarter of the food we eat!  And, to make matters worse, \
      the food we do eat has been losing nutrients throughout its farm to fork journey, making it less nutritious \
       than the same food that was grown and served in the past.",
    }, {
      title: "Why is there so much waste?",
      background_large: '"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing12.jpg"',
      details:"We all know that part of food waste comes from excess production that spoils or isn’t consumed. \
       But food waste doesn’t just come from consumers, food is wasted through out the logistic process in the \
       current supply chain from farm to table.  In this globalised world, food is transported much further than \
       ever before, and there are more and more middlemen involved in the process. The further the distance travelled \
       and the more the food is changing hands, the more food waste dramatically increases.",
    }, {
      title:"Why does it matter to us?",
      background_large:'"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing7.jpg"',
      details: "With huge food waste comes even larger food production demands.  By 2025, it is projected that \
      we will run out of farmland to keep up.  Food costs continue to rise daily due to increased production costs \
      and food wastage, putting more pressure on families to feed themselves."
      + "\n" +
      "Within this system food is also being stored a long time and being transported around the world before \
      reaching your table.  On top of the impact to the environment and cost to eat, nutrients are being lost \
      throughout the entire process, meaning the food that’s on your fork is also less nutritious.",
    }, {
      title:"How can we change that?",
      background_large:'"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing13.jpg"',
      details:"Blueplate connects the world of foodies, home chefs, and suppliers.  By using one platform that \
      allows everyone to communicate, share and access the best food possible, we can break down the traditional \
      ways we acquire food.  In addition to increased access, we can improve sustainability through this \
      collaborative ecosystem and community.",
    }
  ],
  become_homechef: [{
      number: "1",
      title: "Simply click to sign up!",
      details: "Just enter your information and details. Then you will have registered\
       yourself as our partner in the system.",
    }, {
      number: "2",
      title: "Start setting up",
      details: "Once you have signed up, start writing up your specials, customizing your chef page and await your order to flow in!",
    }, {
      number: "3",
      title: "Get verified!",
      details: "In the mean time, our Community Support team will reach out to you. For safety purpose, we might need you to profile some proof of your\
       delicious dishes",
    }
  ],
})

Template.registerHelper('isCurrentUser', function () {
  return (localStorage.getItem("loggedIn").toLowerCase() === 'true');
});
