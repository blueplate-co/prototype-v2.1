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

import './landing_page.html';

Template.landing_page.onRendered(function () {
  $('body').css('overflow-y', 'hidden');

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

  setTimeout(() => {
    $('body').css('overflow-y', 'scroll');
    $(document).scrollTop(0);
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
    Session.set('chef_signup',true);
  },
  'click .logo': function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
})

Template.landing_page.helpers({
  what_happen_details: [{
      title: "What’s happening to our food?",
      background_large: '"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing2.jpg"',
      details: "Currently, the world is producing more food than ever. With more\
       food being wasted than consumed. Around 50% of our food goes to waste,\
        that’s almost half of the food we eat! And, most of the nutrients we\
         thought we can consume from food is actually gone!",
    }, {
      title: "Why is there so much waste?",
      background_large: '"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing12.jpg"',
      details: "We all know that part of the food waste is created from food consumption.\
       But, food is also wasted through out the logistic process in the current supply\
        chain system from farm to table. In this globalised world, food transports\
         much further than ever before, and there are more and more middlemen involved\
          in the process. The further the distance travel and the more the food is changing hands,\
            food waste is inevitably increased dramatically.",
    }, {
      title:"Why does it matter to us?",
      background_large:'"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing7.jpg"',
      details:"With more food is being wasted, we have to produce more food to\
       sustain. By 2025 we are going to run out of farm lands on Earth to upkeep\
        the demand. And, we have to pay more and more for food everyday because\
         food production cost increases as we waste more food and make the supply\
          chain even more complicated."
          + "\n" +
          "Food is stored a long time and transported a long distance before it\
           gets to your hand nowadays, but nutrients are lost along the way. So,\
            too bad, what you are eating is not as nutritious as you thought.",
    }, {
      title:"How can we change that?",
      background_large:'"https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/landing13.jpg"',
      details:"Blueplate connects the world of foodies, home chefs and suppliers.\
       Using one platform to easily allow all to communicate, share and access\
        the best food in the most sustainable way, breaking down the traditional\
         way of how we acquire food into a collaborative ecosystem and community.",
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
