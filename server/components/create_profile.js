import {
  Meteor
} from 'meteor/meteor';
import {
  Match
} from 'meteor/check';
import {
  check
} from 'meteor/check';

Profile_details = new Mongo.Collection('profile_details');
Kitchen_details = new Mongo.Collection('kitchen_details');

profile_images = new FilesCollection({
  storagePath: () => {
    return process.env.PWD + '/public/profile_upload/';
  },
  collectionName: 'profile_images',
  allowClientCode: false,
  onBeforeUpload(file) {

    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

// set permission for Profile Details collection
Profile_details.deny({
  remove() {
    return true;
  }
});

// set permission for Kitchen Datails collection
Profile_details.deny({
  remove() {
    return true;
  }
});
/**
Meteor.publish('files.profile_images.all', function() {
  return profile_images.find().cursor;
});
**/

Meteor.methods({
  'profile_images.remove' (purpose) {
    check(purpose, String); // check format of purpose
    profile_images.remove({
      'userId': Meteor.userId(),
      'meta.purpose': purpose
    });
  },

  'profile_details.insert' (
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
    //- image sizes metadata
    profileImg,
    bannerProfileImg,
  ) {

/**    // check format of these fields (Not necessary at this stage)
    check(user_id, String);
    check(foodie_name, String);
    check(email, Match.Any);
    check(date_of_birth, Match.Any);
    check(mobile_dial_code, Match.Any);
    check(mobile, Match.Any);
    check(profile_keywords, Match.Any);
    check(gender, Match.Any);
    check(about_myself, Match.Any);
    check(home_address_country, Match.Any);
    check(home_address_conversion, Match.Any);
    check(office_address_country, Match.Any);
    check(office_address, Match.Any);
    check(office_address_conversion, Match.Any);
    check(home_address, Match.Any);
    check(allergy_tags, Match.Any);
    check(dietary_tags, Match.Any);
    check(card_number, Match.Any);
    check(card_fullname, Match.Any);
    check(card_exp_month, Match.Any);
    check(card_exp_year, Match.Any);
    check(cvv_code, Match.Any);
    check(billing_address_country, Match.Any);
    check(billing_address, Match.Any);
**/
    Profile_details.insert({
      user_id: Meteor.userId(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      profileImg: profileImg,
      bannerProfileImg: bannerProfileImg
    });
  },

  'kitchen_details.insert' (
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
  ) {

/** Not necessary to check at this stage
    check(user_id, String);
    check(kitchen_name, String);
    check(chef_name, String);
    check(homecook_profile_keywords, Match.Any);
    check(kitchen_address_country, Match.Any);
    check(kitchen_address, Match.Any);
    check(kitchen_address_conversion, Match.Any);
    check(about_homecook_myself, Match.Any);
    check(serving_option, Match.Any);
    check(bank_fullname, Match.Any);
    check(bank_name, Match.Any);g
    check(bank_account_no, Match.Any);
    check(bank_address_country, Match.Any);
    check(bank_address, Match.Any);
**/

    Kitchen_details.insert({
      user_id: Meteor.userId(),
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
      order_count: 0,
      average_rating: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileImg: profileImg,
      bannerProfileImg: bannerProfileImg
    });
  },
  'user.updateDistrict' (district) {
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
        $set: {
          'profile.district': district
        }
    });
  },
  'user.getDistrict' () {
    var district = Meteor.users.findOne({ _id: Meteor.userId() }).profile.district;
    if (district) {
      return district;
    } else {
      return "";
    }
  }
});

Meteor.methods({
  'checkExistedInformation'() {
    var data = Profile_details.find({'user_id': Meteor.userId()});
    if (data)
      return data.count();
  }
});

var isEmpty = function(obj) {
  for ( var p in obj ) {
      if ( obj.hasOwnProperty( p ) ) { return false; }
  }
  return true;
}
