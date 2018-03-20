/*import {
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

import {
  Match
} from 'meteor/check';
import {
  check
} from 'meteor/check';*/


Meteor.methods({


  'profile_details.update' (
    foodie_name,
    first_name,
    last_name,
    email,
    date_of_birth,
    gender,
    mobile_dial_code,
    mobile,
    home_address_country,
    home_address,
    home_address_conversion,
    office_address_country,
    office_address,
    office_address_conversion,
    about_myself,
    allergy_tags,
    dietary_tags,

    // profileImg,
    bannerProfileImg
  ) {
    /**
        check(foodie_profile_id, String);
        check(foodie_name, String);
        check(email, Match.Any);
        check(date_of_birth, Match.Any);
        check(mobile_dial_code, Match.Any);
        check(mobile, Match.Any);
        check(profile_keywords, Match.Any);
        check(gender, Match.Any);
        check(about_myself, Match.Any);
        check(home_address_country, Match.Any);
        check(home_address, Match.Any);
        check(home_address_conversion, Match.Any);
        check(office_address_country, Match.Any);
        check(office_address, Match.Any);
        check(office_address_conversion, Match.Any);
        check(allergy_tags, Match.Any);
        check(dietary_tags, Match.Any);
        check(card_number, Match.Any);
        check(card_exp_month, Match.Any);
        check(card_exp_year, Match.Any);
    **/


    if (!_.isEmpty(bannerProfileImg)) {
      Profile_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          foodie_name: foodie_name,
          first_name: first_name,
          last_name: last_name,
          email: email,
          date_of_birth: date_of_birth,
          gender: gender,
          mobile_dial_code: mobile_dial_code,
          mobile: mobile,
          home_address_country: home_address_country,
          home_address: home_address,
          home_address_conversion: home_address_conversion,
          office_address_country: office_address_country,
          office_address: office_address,
          office_address_conversion: office_address_conversion,
          about_myself: about_myself,
          allergy_tags: allergy_tags,
          dietary_tags: dietary_tags,
          updatedAt: new Date(),
          // profileImg: profileImg,
          bannerProfileImg: bannerProfileImg
        }
      })
    } else {
      Profile_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          foodie_name: foodie_name,
          first_name: first_name,
          last_name: last_name,
          email: email,
          date_of_birth: date_of_birth,
          gender: gender,
          mobile_dial_code: mobile_dial_code,
          mobile: mobile,
          home_address_country: home_address_country,
          home_address: home_address,
          home_address_conversion: home_address_conversion,
          office_address_country: office_address_country,
          office_address: office_address,
          office_address_conversion: office_address_conversion,
          about_myself: about_myself,
          allergy_tags: allergy_tags,
          dietary_tags: dietary_tags,
          updatedAt: new Date()

        }
      })
    }
  },

  'kitchen_details.update' (
    kitchen_name,
    chef_name,
    kitchen_address_country,
    kitchen_address,
    kitchen_address_conversion,
    kitchen_contact_country,
    serving_option,
    cooking_exp,
    cooking_story,
    kitchen_speciality,
    kitchen_tags,
    house_rule,
    // kitchenImg,
    bannerKitchenImg
  ) {
    console.log('is banner empty? ', _.isEmpty(bannerKitchenImg));
    if (!_.isEmpty(bannerKitchenImg)) //- if chef change banner's images
    {
      Kitchen_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          kitchen_name: kitchen_name,
          chef_name: chef_name,
          kitchen_address_country: kitchen_address_country,
          kitchen_address: kitchen_address,
          kitchen_address_conversion: kitchen_address_conversion,
          kitchen_contact_country: kitchen_contact_country,
          serving_option: serving_option,
          cooking_exp: cooking_exp,
          cooking_story: cooking_story,
          kitchen_speciality: kitchen_speciality,
          kitchen_tags: kitchen_tags,
          house_rule: house_rule,
          updatedAt: new Date(),
          // kitchenImg: kitchenImg,
          bannerKitchenImg: bannerKitchenImg
        }
      })
    } else {
      Kitchen_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          kitchen_name: kitchen_name,
          chef_name: chef_name,
          kitchen_address_country: kitchen_address_country,
          kitchen_address: kitchen_address,
          kitchen_address_conversion: kitchen_address_conversion,
          kitchen_contact_country: kitchen_contact_country,
          serving_option: serving_option,
          cooking_exp: cooking_exp,
          cooking_story: cooking_story,
          kitchen_speciality: kitchen_speciality,
          kitchen_tags: kitchen_tags,
          house_rule: house_rule,
          updatedAt: new Date()
        }
      })
    }
    
    Kitchen_details.update({
      user_id: Meteor.userId()
    }, {
      $set: {
        kitchen_name: kitchen_name,
        chef_name: chef_name,
        kitchen_address_country: kitchen_address_country,
        kitchen_address: kitchen_address,
        kitchen_address_conversion: kitchen_address_conversion,
        kitchen_contact_country: kitchen_contact_country,
        serving_option: serving_option,
        cooking_exp: cooking_exp,
        cooking_story: cooking_story,
        kitchen_speciality: kitchen_speciality,
        kitchen_tags: kitchen_tags,
        house_rule: house_rule,
        updatedAt: new Date()
      }
    })
  }
});

var isEmpty = function (obj) {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}