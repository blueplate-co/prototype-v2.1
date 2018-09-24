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

import {
  Match
} from 'meteor/check';
import {
  check
} from 'meteor/check';


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
    profileImg,
    bannerProfileImg
  ) {
    if(!_.isEmpty(bannerProfileImg))
    {
      Profile_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          foodie_name:foodie_name,
          first_name:first_name,
          last_name:last_name,
          email:email,
          date_of_birth:date_of_birth,
          gender:gender,
          mobile_dial_code:mobile_dial_code,
          mobile:mobile,
          home_address_country:home_address_country,
          home_address:home_address,
          home_address_conversion:home_address_conversion,
          office_address_country:office_address_country,
          office_address:office_address,
          office_address_conversion:office_address_conversion,
          about_myself:about_myself,
          allergy_tags:allergy_tags,
          dietary_tags:dietary_tags,
          updatedAt: new Date(),
          profileImg: profileImg,
          bannerProfileImg: bannerProfileImg
        }
      })
    }else{
      Profile_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          foodie_name:foodie_name,
          first_name:first_name,
          last_name:last_name,
          email:email,
          date_of_birth:date_of_birth,
          gender:gender,
          mobile_dial_code:mobile_dial_code,
          mobile:mobile,
          home_address_country:home_address_country,
          home_address:home_address,
          home_address_conversion:home_address_conversion,
          office_address_country:office_address_country,
          office_address:office_address,
          office_address_conversion:office_address_conversion,
          about_myself:about_myself,
          allergy_tags:allergy_tags,
          dietary_tags:dietary_tags,
          updatedAt: new Date(),
        }
      })
    }
  },

  'profile_details.syncFromKitchen' (
    name,
    phone,
    profile_picture
  ) {
    Profile_details.update({
      user_id: Meteor.userId()
    }, {
      $set: {
        foodie_name: name,
        mobile: phone,
        profileImg: profile_picture
      }
    });
  },
  'kitchen_details.update' (
    user_id,
    kitchen_name,
    chef_name,
    kitchen_address_country,
    kitchen_address,
    kitchen_address_conversion,
    kitchen_contact_country,
    kitchen_contact,
    serving_option,
    cooking_exp,
    cooking_story,
    kitchen_speciality,
    kitchen_tags,
    house_rule,
    profileImg,
    bannerProfileImg,
    deleted_tags
  ) {
    console.log('is banner empty? ', _.isEmpty(bannerProfileImg));
    if(!_.isEmpty(bannerProfileImg)) //- if chef change banner's images
    {
      Kitchen_details.update({
        user_id: user_id
      }, {
        $set: {
          kitchen_name:kitchen_name,
          chef_name:chef_name,
          kitchen_address_country:kitchen_address_country,
          kitchen_address:kitchen_address,
          kitchen_address_conversion:kitchen_address_conversion,
          kitchen_contact_country:kitchen_contact_country,
          kitchen_contact:kitchen_contact,
          serving_option:serving_option,
          cooking_exp:cooking_exp,
          cooking_story:cooking_story,
          kitchen_speciality:kitchen_speciality,
          kitchen_tags:kitchen_tags,
          house_rule:house_rule,
          updatedAt: new Date(),
          profileImg: profileImg,
          bannerProfileImg: bannerProfileImg
        }
      })
    }else{
      Kitchen_details.update({
        user_id: Meteor.userId()
      }, {
        $set: {
          kitchen_name:kitchen_name,
          chef_name:chef_name,
          kitchen_address_country:kitchen_address_country,
          kitchen_address:kitchen_address,
          kitchen_address_conversion:kitchen_address_conversion,
          kitchen_contact_country:kitchen_contact_country,
          kitchen_contact:kitchen_contact,
          serving_option:serving_option,
          cooking_exp:cooking_exp,
          cooking_story:cooking_story,
          kitchen_speciality:kitchen_speciality,
          kitchen_tags:kitchen_tags,
          house_rule:house_rule,
          updatedAt: new Date(),
        }
      })
    }
    Meteor.call('new_tags.upsert', kitchen_tags, "Kitchen_details", Meteor.userId())
    Meteor.call('new_tags.upsert', kitchen_speciality, "Kitchen_details", Meteor.userId())
    Meteor.call('tags.remove', deleted_tags, "Kitchen_details", Meteor.userId())
  },

  'kitchen_details.syncFromProfile' (
    name,
    phone,
    profile_picture
  ) {
    Kitchen_details.update({
      user_id: Meteor.userId()
    }, {
      $set: {
        chef_name: name,
        kitchen_contact: phone,
        profileImg: profile_picture
      }
    });
  }

});

var isEmpty = function(obj) {
  for ( var p in obj ) {
      if ( obj.hasOwnProperty( p ) ) { return false; }
  }
  return true;
}
