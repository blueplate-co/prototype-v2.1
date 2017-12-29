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
  FilesCollection
} from 'meteor/ostrio:files';
import {
  address_geocode
} from '/imports/functions/address_geocode.js'
import {
  Tracker
} from 'meteor/tracker'

import './create_profile.html';

profile_images = new FilesCollection({
  collectionName: 'profile_images',
  storagePath: () => {
    return process.env.PWD + '/public/profile_upload/';
  },
  allowClientCode: false,
  onBeforeUpload(file) {

    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});
Meteor.subscribe('files.profile_images.all');

Session.keys = {}

/** function from ostrio **/
Template.create_profile.onRendered(function() {
  Session.keys = {};
})

Template.profile_banner.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

Template.profile_banner.onRendered(function() {
  Meteor.setTimeout(function(){
    var check_profile_banner = profile_images.findOne({
      "userId": Meteor.userId(),
      "meta.purpose": 'banner_picture'
    });

    if (check_profile_banner) {
      var banner_url = check_profile_banner.meta.base64;
      $(".profile_banner_area").css("background-image", "url(" + banner_url + ")");
      $("#banner_upload_button").text("Change Banner Image");
    } else {
      $(".profile_banner_area").css("background-color", "#E57373");
    }
  }, 500);
});

Template.profile_banner.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  'checkUpload': function() {
    var checkupload = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'banner_picture'
    });
    if (checkupload) {
      return true;
    }
  },
  'load_banner': function() {
    var checkuploadBannerprofile = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'banner_picture'
    });
    if (checkuploadBannerprofile) {
      banner_url = checkuploadBannerprofile.meta.base64;
      $(".profile_banner_area").css("background-color", "");
      $(".profile_banner_area").css("background-image", "url(" + banner_url + ")");
    }
  },

  "check_foodie_name": function() {
    var foodie_name = Profile_details.findOne({
      'user_id': Meteor.userId()
    });
    var default_name = 'Foodie Name';

    if (!foodie_name) {
      return default_name;
    } else {
      return foodie_name.foodie_name;

    }
  },

  "check_foodie_keywords": function() {
    var foodie = Profile_details.findOne({
      'user_id': Meteor.userId()
    });
    var keyword = ""

    if (!foodie) {
      return keyword;
    } else {
      return foodie.profile_keywords;
    }
  }

});

Template.profile_banner.events({
  'change #banner_file_input': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload;
      var reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onloadend = function () {
        upload = profile_images.insert({
          file: e.currentTarget.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            base64: reader.result,
            purpose: "banner_picture"
          }
        }, false);
        Meteor.call('profile_images.remove', "banner_picture");

        upload.on('start', function() {
          template.currentUpload.set(this);
        });

        upload.on('end', function(error, profile_images) {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            Meteor.setTimeout(function() {
              var banner_url = profile_images.meta.base64;
              $(".profile_banner_area").css("background-color", "");
              $(".profile_banner_area").css("background-image", "url(" + banner_url + ")");
            }, 3000);
            /** below is the line that prevents meteor from reloading **/
          }
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });
        upload.start();
      };
    }
  }
});

Template.upload_profile.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

Template.upload_profile.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload: function() {
    var check_profile_picture = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'profile_picture'
    });

    if (check_profile_picture) {
      return true;
    }
  },

  load_profile: function() {
    var profile_id_location = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'profile_picture'
    });

    if (profile_id_location) {
      return profile_id_location.meta.base64;
    }
  }
});

Template.upload_profile.events({
  'change #file_input' (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload;
      var reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onloadend = function () {
        upload = profile_images.insert({
          file: e.currentTarget.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
              'base64': reader.result,
              'purpose': 'profile_picture'
          }
        }, false);

        upload.on('start', function() {
          template.currentUpload.set(this);
        });

        upload.on('end', function(error, profile_images) {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            Meteor.setTimeout(function() {
              var profile_url = profile_images.meta.base64;
              $(".profile_upload_wrapper").css("background-image", "url(" + profile_url + ")");
              $(".profile_icon_img_upload").hide();
            }, 3000);
            /** above is the line that prevents meteor from reloading **/
          }
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });
        upload.start();
      };
    }
  }
});

Template.profile_personal_details.events({
  'blur #create_home_address': function() {
    address_geocode('home_address_conversion', $('#create_home_address').val());
  },
  'blur #create_office_address': function() {
    address_geocode('office_address_conversion', $('#create_office_address').val());
  }
});

Template.homecook_profile_details.events({
  'blur #create_kitchen_address': function() {
    address_geocode('kitchen_address_conversion', $('#create_kitchen_address').val());
  }
});

Template.homecook_profile_banner.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});


Template.homecook_profile_banner.onRendered(function() {
  var check_profile_banner = profile_images.findOne({
    'userId': Meteor.userId(),
    "meta.purpose": 'homecook_banner_picture'
  });
  if (check_profile_banner) {
    var banner_url = check_profile_banner.meta.base64;
    $(".homecook_profile_banner_area").css("background-image", "url(" + banner_url + ")");
    $("#homecook_banner_upload_button").text("Change Banner Image");
  } else {
    $(".homecook_profile_banner_area").css("background-color", "#E57373");
  }
});

Template.homecook_profile_banner.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  checkUpload() {
    var checkupload = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'homecook_banner_picture'
    });
    if (checkupload) {
      return true;
    }
  },
  load_banner: function() {
    var checkuploadBannerHomeCook = profile_images.findOne({
      'userId': Meteor.userId(),
      'meta.purpose': 'homecook_banner_picture'
    });
    if (checkuploadBannerHomeCook) {
      banner_url = checkuploadBannerHomeCook.meta.base64;
      $(".homecook_profile_banner_area").css("background-color", "");
      $(".homecook_profile_banner_area").css("background-image", "url(" + banner_url + ")");
    }
  },

  "check_chef_name": function() {
    var chef_name = Kitchen_details.findOne({
      'user_id': Meteor.userId()
    });
    var default_name = 'Chef Name';

    if (!chef_name) {
      return default_name;
    } else {
      return chef_name.chef_name;

    }
  },

  "check_chef_keywords": function() {
    var homecook = Kitchen_details.findOne({
      'user_id': Meteor.userId()
    });
    var keyword = ""

    if (!homecook) {
      return keyword;
    } else {
      return homecook.homecook_profile_keywords;
    }
  }
});

Template.homecook_profile_banner.events({
  'change #homecook_banner_file_input': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload;
      var reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onloadend = function () {
        upload = profile_images.insert({
          file: e.currentTarget.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            base64: reader.result,
            purpose: "homecook_banner_picture"
          }
        }, false);

        Meteor.call('profile_images.remove', "homecook_banner_picture");

        upload.on('start', function() {
          template.currentUpload.set(this);
        });

        upload.on('end', function(error, profile_images) {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            Meteor.setTimeout(function() {
              var banner_url = profile_images.meta.base64;
              $(".homecook_profile_banner_area").css("background-color", "");
              $(".homecook_profile_banner_area").css("background-image", "url(" + banner_url + ")");
            }, 100);
          }
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });
        upload.start();
      };
    }
  }
});

Template.upload_homecook_profile.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

Template.upload_homecook_profile.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload: function() {
    var check_profile_picture = profile_images.findOne({
      'userId': Meteor.userId(),
      "meta.purpose": 'homecook_profile_picture'
    });
    if (check_profile_picture) {
      return true;
    }
  },

  load_profile: function() {
    var profile_id_location = profile_images.findOne({
      'userId': Meteor.userId(),
      "meta.purpose": 'homecook_profile_picture'
    });
    profile_url = profile_id_location.meta.base64;
    return profile_url;
  }
});

Template.upload_homecook_profile.events({
  'change #homecook_file_input' (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload;
      var reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onloadend = function () {
        upload = profile_images.insert({
          file: e.currentTarget.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            base64: reader.result,
            purpose: "homecook_profile_picture"
          }
        }, false);

        upload.on('start', function() {
          template.currentUpload.set(this);
        });

        upload.on('end', function(error, profile_images) {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            Meteor.setTimeout(function() {
              var profile_url = profile_images.meta.base64;
              $(".profile_upload_wrapper").css("background-image", "url(" + profile_url + ")");
            }, 3000);
          }
          /** above is the line that prevents meteor from reloading **/
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });
        upload.start();
      };
    }
  }
});


Template.create_foodie_profile.events({
  'click #create_foodie_button': function(event, template) {
    event.preventDefault();


    const foodie_name = $('#foodie_name').val();
    const email = $('#email').val();
    const date_of_birth = $('#date_of_birth').val();
    const mobile_dial_code = $('#mobile_country').val();
    const mobile = $('#mobile').val();
    const profile_keywords = $('#profile_keywords').val();
    const gender = $("input[name='gender']:checked").val();
    const about_myself = $('#about_myself').val();
    const home_address_country = $('#home_address_country').val();
    const home_address = $('#create_home_address').val();
    const home_address_conversion = Session.get('home_address_conversion');
    const office_address_country = $('#office_address_country').val();
    const office_address = $('#create_office_address').val();
    const office_address_conversion = Session.get('office_address_conversion');
    const allergy_tags = Session.get('allergy_tags');
    const dietary_tags = Session.get('dietary_tags');
    const card_number = $('#card_number').val();
    const card_fullname = $('#card_fullname').val();
    const card_exp_month = $('#card_exp_month').val();
    const card_exp_year = $('#card_exp_year').val();
    const cvv_code = $('#cvv_code').val();
    const billing_address_country = $('#billing_address_country').val();
    const billing_address = $('#billing_address').val();

    const user_id = Meteor.userId();


    if (typeof foodie_name == 'undefined' || typeof foodie_name == null || foodie_name == '') {
      Materialize.toast('Please enter at least Foodie Name to complete save your profile.', 4000, 'rounded red lighten-2');
      return false;
    }

    Meteor.call('profile_details.insert',
      user_id,
      foodie_name,
      email,
      date_of_birth,
      mobile_dial_code,
      mobile,
      profile_keywords,
      gender,
      about_myself,
      home_address_country,
      home_address,
      home_address_conversion,
      office_address_country,
      office_address,
      office_address_conversion,
      allergy_tags,
      dietary_tags,
      card_number,
      card_fullname,
      card_exp_month,
      card_exp_year,
      cvv_code,
      billing_address_country,
      billing_address,
      function(err) {
        if (err) {
          Materialize.toast('Oops! Error when create profile. Please try again.', 4000, 'rounded red lighten-2');
        } else {
          Materialize.toast('Profile created!', 4000);
          //divert to the profile page
          // BlazeLayout.render('screen', {
          //   navbar: "bp_navbar",
          //   render_component: "show_room"
          // });
          FlowRouter.go('/main');
        }
      }
    );

  }
});

//Kitchen Database

  Template.create_homecook_profile.events({
    'click #create_homecook_button': function(event, template){

      event.preventDefault();

      const foodie_name = $('#foodie_name').val();
      const email = $('#email').val();
      const date_of_birth = $('#date_of_birth').val();
      const mobile_dial_code = $('#mobile_country').val();
      const mobile = $('#mobile').val();
      const profile_keywords = $('#profile_keywords').val();
      const gender =  $("input[name='gender']:checked"). val();
      const about_myself = $('#about_myself').val();
      const home_address_country = $('#home_address_country').val();
      const home_address = $('#create_home_address').val();
      const home_address_conversion = Session.get('home_address_conversion');
      const office_address_country = $('#office_address_country').val();
      const office_address = $('#create_office_address').val();
      const office_address_conversion = Session.get('office_address_conversion');
      const allergy_tags = Session.get('allergy_tags');
      const dietary_tags = Session.get('dietary_tags');
      const card_number = $('#card_number').val();
      const card_exp_month = $('#card_exp_month').val();
      const card_exp_year = $('#card_exp_year').val();


      const kitchen_name = $('#create_kitchen_name').val();
      const chef_name = $('#chef_name').val();
      const homecook_profile_keywords = $('#homecook_profile_keywords').val();
      const kitchen_address_country = $('#kitchen_address_country').val();
      const kitchen_address = $('#kitchen_address').val();
      const kitchen_address_conversion = Session.get('kitchen_address_conversion');
      const about_homecook_myself = $('#about_homecook_myself').val();
      const serving_option = Session.get('serving_option_tags');
      const bank_fullname = $('#bank_fullname').val();
      const bank_name = $('#bank_name').val();
      const bank_account_no = $('#bank_account_no').val();
      const bank_address_country = $('#bank_address_country').val();
      const bank_address = $('#bank_address').val();

      const user_id = Meteor.userId();

        Meteor.call('kitchen_details.insert',
        user_id,
        kitchen_name,
        chef_name,
        homecook_profile_keywords,
        kitchen_address_country,
        kitchen_address,
        kitchen_address_conversion,
        about_homecook_myself,
        serving_option,
        bank_fullname,
        bank_name,
        bank_account_no,
        bank_address_country,
        bank_address,
        function(err) {
          if (err) Materialize.toast('Oops! Error when create kitchen profile. Please try again.', 4000, 'rounded red lighten-2');
        }
        );

        Meteor.call('profile_details.insert',
        user_id,
        foodie_name,
        email,
        date_of_birth,
        mobile_dial_code,
        mobile,
        profile_keywords,
        gender,
        about_myself,
        home_address_country,
        home_address,
        home_address_conversion,
        office_address_country,
        office_address,
        office_address_conversion,
        allergy_tags,
        dietary_tags,
        card_number,
        card_exp_month,
        card_exp_year,
        function(err) {
          if (err) Materialize.toast('Oops! Error when create profile. Please try again.', 4000, 'rounded red lighten-2');


else  {
          Materialize.toast('Profile created!', 4000);
          //divert to the profile page
          // BlazeLayout.render('screen', {
          //   navbar: "bp_navbar",
          //   render_component: "show_room"
          // });
          FlowRouter.go('/main');
        }
      }
    );
  }
});

//Validation rules

//Trim Helper
var trimInput = function(value) {
  return value.replace(/^\s*|\s*$/g, "");
}

var isNotEmpty = function(value) {
  if (value && value !== '') {
    return true;
  }
  Bert.alert("Please fill in all fields", "danger", "growl-top-right");
  return false;
}
//Email Validation
isEmail = function(value) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(value)) {
    return true;
  }
  Bert.alert("Please use a valid email address", "danger", "growl-top-right")
  return false;
}

//Check Password fields
isValidPassword = function(password) {

  if (password.length < 8) {
    Bert.alert("Password must be a least 8 charaters", "danger", "growl-top-right");
    return false;
  }
  return true;
};

//Match Password
areValidPassword = function(password, cpassword) {

  if (!isValidPassword(password)) {

    return false;

  }
  if (password !== cpassword) {
    Bert.alert("Password do not match", "danger", "growl-top-right");
    return false;
  }
  return true;
}


Template.create_foodie_profile.onRendered(function() {


  //activate datepicker
  this.$('.datepicker').pickadate({
    selectMonths: 12, // Creates a dropdown to control month
    selectYears: 150, // Creates a dropdown of 15 years to control year,
    today: 'TODAY',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

  //activate modal
  this.$('.modal').modal();

  //activate dropdown
  this.$('select').material_select();

  //activate characterCounter
  this.$('input#input_text, textarea#about_myself').characterCounter();

  //activate the selection tabs
  this.$(document).ready(function() {
    $('ul.tabs').tabs();
  });

});

Template.create_homecook_profile.onRendered(function() {

  //activate datepicker
  this.$('.datepicker').pickadate({
    selectMonths: 15, // Creates a dropdown to control month
    selectYears: 150, // Creates a dropdown of 15 years to control year,
    today: 'TODAY',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

  //activate modal
  this.$('.modal').modal();

  //activate dropdown
  this.$('select').material_select();

  //activate characterCounter
  this.$('input#input_text, textarea#about_myself').characterCounter();

  //activate the selection tabs
  this.$(document).ready(function() {
    $('ul.tabs').tabs();
  });


});

Template.profile_bank_details.helpers({
  bank_list: [{
      name: '003 - Standard Chartered Bank (Hong Kong)',
      option: '003 - Standard Chartered Bank (Hong Kong)'
    },
    {
      name: '004 - Hongkong and Shanghai Banking Corporation',
      option: '004 - Hongkong and Shanghai Banking Corporation'
    },
    {
      name: '009 - China Construction Bank (Asia)',
      option: '009 - China Construction Bank (Asia)'
    },
    {
      name: '012 - Bank of China (Hong Kong)',
      option: '012 - Bank of China (Hong Kong)'
    },
    {
      name: '015 - Bank of East Asia',
      option: '015 - Bank of East Asia'
    },
    {
      name: '018 - China CITIC Bank International',
      option: '018 - China CITIC Bank International'
    },
    {
      name: '020 - Wing Lung Bank',
      option: '020 - Wing Lung Bank'
    },
    {
      name: '022 - OCBC Wing Hang Bank',
      option: '022 - OCBC Wing Hang Bank'
    },
    {
      name: '024 - Hang Seng Bank',
      option: '024 - Hang Seng Bank'
    },
    {
      name: '025 - Shanghai Commercial Bank',
      option: '025 - Shanghai Commercial Bank'
    },
    {
      name: '027 - Bank of Communications',
      option: '027 - Bank of Communications'
    },
    {
      name: '028 - Public Bank (Hong Kong)',
      option: '028 - Public Bank (Hong Kong)'
    },
    {
      name: '038 - Tai Yau Bank',
      option: '038 - Tai Yau Bank'
    },
    {
      name: '039 - Chiyu Banking Corporation',
      option: '039 - Chiyu Banking Corporation'
    },
    {
      name: '040 - Dah Sing Bank',
      option: '040 - Dah Sing Bank'
    },
    {
      name: '041 - Chong Hing Bank',
      option: '041 - Chong Hing Bank'
    },
    {
      name: '043 - Nanyang Commercial Bank',
      option: '043 - Nanyang Commercial Bank'
    },
    {
      name: '061 - Tai Sang Bank',
      option: '061 - Tai Sang Bank'
    },
    {
      name: '072 - Industrial and Commercial Bank of China (Asia)',
      option: '072 - Industrial and Commercial Bank of China (Asia)'
    },
    {
      name: '128 - Fubon Bank (Hong Kong)',
      option: '128 - Fubon Bank (Hong Kong)'
    },
    {
      name: '250 - CitiBank (Hong Kong)',
      option: '250 - CitiBank (Hong Kong)'
    },
  ]
});

Template.profile_payment_details.helpers({
  month_list: [{
      month: '01',
      option: '1'
    },
    {
      month: '02',
      option: '2'
    },
    {
      month: '03',
      option: '3'
    },
    {
      month: '04',
      option: '4'
    },
    {
      month: '05',
      option: '5'
    },
    {
      month: '06',
      option: '6'
    },
    {
      month: '07',
      option: '7'
    },
    {
      month: '08',
      option: '8'
    },
    {
      month: '09',
      option: '9'
    },
    {
      month: '10',
      option: '10'
    },
    {
      month: '11',
      option: '11'
    },
    {
      month: '12',
      option: '12'
    },
  ],

  year_list: [{
      year: '2017',
      option: '2017'
    },
    {
      year: '2018',
      option: '2018'
    },
    {
      year: '2019',
      option: '2019'
    },
    {
      year: '2020',
      option: '2020'
    },
    {
      year: '2021',
      option: '2021'
    },
    {
      year: '2022',
      option: '2022'
    },
    {
      year: '2023',
      option: '2023'
    },
    {
      year: '2024',
      option: '2024'
    },
    {
      year: '2025',
      option: '2025'
    },
    {
      year: '2026',
      option: '2026'
    },
    {
      year: '2027',
      option: '2027'
    },
    {
      year: '2028',
      option: '2028'
    },
  ],
});

Template.profile_personal_details.helpers({
  country_list: [{
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Åland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "American Samoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of bolivia",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Bouvet Island",
      "dial_code": "+47",
      "code": "BV"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "French Southern Territories",
      "dial_code": "+262",
      "code": "TF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+592",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "dial_code": "+0",
      "code": "HM"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+7",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kosovo",
      "dial_code": "+383",
      "code": "XK"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+64",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]

})

Template.profile_payment_details.helpers({
  country_list: [{
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Åland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "American Samoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of bolivia",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Bouvet Island",
      "dial_code": "+47",
      "code": "BV"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "French Southern Territories",
      "dial_code": "+262",
      "code": "TF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+592",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "dial_code": "+0",
      "code": "HM"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+7",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kosovo",
      "dial_code": "+383",
      "code": "XK"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+64",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]

})
Template.homecook_profile_details.helpers({

  country_list: [{
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Åland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "American Samoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of bolivia",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Bouvet Island",
      "dial_code": "+47",
      "code": "BV"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "French Southern Territories",
      "dial_code": "+262",
      "code": "TF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+592",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "dial_code": "+0",
      "code": "HM"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+7",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kosovo",
      "dial_code": "+383",
      "code": "XK"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+64",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]

})

Template.profile_bank_details.helpers({

  country_list: [{
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Åland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "American Samoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of bolivia",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Bouvet Island",
      "dial_code": "+47",
      "code": "BV"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "French Southern Territories",
      "dial_code": "+262",
      "code": "TF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+592",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "dial_code": "+0",
      "code": "HM"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+7",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kosovo",
      "dial_code": "+383",
      "code": "XK"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+64",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]

})
