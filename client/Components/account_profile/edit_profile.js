import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  checkboxes_recall
} from '/imports/functions/checkboxes_recall.js'
import {
  address_geocode
} from '/imports/functions/address_geocode.js'
import {
  get_checkboxes_value
} from '/imports/functions/get_checkboxes_value.js'



Template.edit_foodie_profile.helpers({
  'get_foodie_profile': function () {
    return Profile_details.findOne({
      'user_id': Meteor.userId()
    });
  },
  'get_foodie_email': function () {
    return Accounts.users.find().fetch()[0].emails[0].address;
  },
  'check_male': function () {
    var gender = this.gender
    if (gender === "male") {
      return true
    } else {
      return false
    }
  },
  'check_female': function () {
    var gender = this.gender
    if (gender === "female") {
      return true
    } else {
      return false
    }
  },


});

Template.edit_foodie_profile.onRendered(function () {

  setTimeout(() => {
    // google places autocomplete
    var home_address = document.getElementById('edit_home_address');
    new google.maps.places.Autocomplete(home_address);

    var office_address = document.getElementById('edit_office_address');
    new google.maps.places.Autocomplete(office_address);
  }, 1000);

  //activate dropdown

  //activate steppers
  /**  this.$('# edit_foodie_stepper').activateStepper({
     linearStepsNavigation: true, //allow navigation by clicking on the next and previous steps on linear steppers
     autoFocusInput: true, //since 2.1.1, stepper can auto focus on first input of each step
     autoFormCreation: true, //control the auto generation of a form around the stepper (in case you want to disable it)
     showFeedbackLoader: false //set if a loading screen will appear while feedbacks functions are running
  });**/


  /*  //activate the selection tabs
      this.$(document).ready(function() {
      $('ul.tabs').tabs();
    });*/

  window.scrollTo(0, 0);

  Meteor.setTimeout(function () {
    var get_profile = Profile_details.findOne({
      'user_id': Meteor.userId()
    });
    this.$('select').material_select();

    //activate characterCounter
    this.$('input#input_text, textarea#about_myself').characterCounter();

    //activate checkboxes_recall
    checkboxes_recall(get_profile.allergy_tags)
    checkboxes_recall(get_profile.dietary_tags)

    Session.set("allergy_tags", get_profile.allergy_tags)
    Session.set("dietary_tags", get_profile.dietary_tags)
    Session.set('home_address_conversion', get_profile.home_address_conversion)
    Session.set('office_address_conversion', get_profile.office_address_conversion)
    Session.set('profileImg', get_profile.profileImg)
    Session.set('bannerProfileImg', get_profile.bannerProfileImg)
    /*checkboxes_recall(get_profile.serving_option_tags)*/

  }, 800);



});


Template.edit_foodie_profile.events({
  'blur #edit_home_address': function () {
    address_geocode('home_address_conversion', $('#edit_home_address').val(), 'home address');
  },
  'blur #edit_office_address': function () {
    address_geocode('office_address_conversion', $('#edit_office_address').val(), 'office address');
  },
  'click #edit_foodie_profile_button': function () {
    const foodie_name = $('#foodie_name').val();
    const first_name = $('#first_name').val();
    const last_name = $('#last_name').val();
    const email = $('#email').val();
    const date_of_birth = $('#date_of_birth').val();
    const gender = $("input[name='gender']:checked").val();
    const mobile_dial_code = $('#mobile_country').val();
    const mobile = $('#mobile').val().replace(/\s/g, "");
    const home_address_country = $('#home_address_country').val();
    const home_address = $('#edit_home_address').val();
    const home_address_conversion = Session.get('home_address_conversion');
    const office_address_country = $('#office_address_country').val();
    const office_address = $('#edit_office_address').val();
    const office_address_conversion = Session.get('office_address_conversion');
    const profileImg = Session.get('profileImg');
    const bannerProfileImg = Session.get('bannerProfileImg');

    //Step 2
    const about_myself = $('#about_myself').val();

    //Step 3
    const allergy_tags = Session.get('allergy_tags');

    //Step 4
    const dietary_tags = Session.get('dietary_tags');

    Meteor.call('profile_details.update',
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
      bannerProfileImg,

      function (err, result) {

        if (err) {
          Materialize.toast('Oops! ' + err.message + ' .Please try again.', 4000, 'rounded red lighten-2');
        } else {
          Materialize.toast('Profile updated!', 4000, "rounded red lighten-2");
          // sync to kitchen profile
          Meteor.call('kitchen_details.syncFromProfile', first_name + ' ' +  last_name, mobile, profileImg, (err, response) => {
            if (err) {

            } else {
              FlowRouter.go('/main');
            }
          });
        }
      }
    );




    var trimInput = function (value) {
      return value.replace(/^\s*|\s*$/g, "");
    }

  }
});

Template.edit_homecook_profile.helpers({
  'get_homecook_profile': function () {
    return Kitchen_details.findOne({
      'user_id': Meteor.userId()
    });
  },

})

Template.edit_homecook_profile.onRendered(function () {

  setTimeout(() => {
    // add google places autocomplete
    var input = document.getElementById('kitchen_address');
    new google.maps.places.Autocomplete(input);
  }, 1000);

  /**this.$('# edit_homecook_stepper').activateStepper({
   linearStepsNavigation: true, //allow navigation by clicking on the next and previous steps on linear steppers
   autoFocusInput: true, //since 2.1.1, stepper can auto focus on first input of each step
   autoFormCreation: true, //control the auto generation of a form around the stepper (in case you want to disable it)
   showFeedbackLoader: false //set if a loading screen will appear while feedbacks functions are running
 });**/

  window.scrollTo(0, 0);

  Meteor.setTimeout(function () {
    var get_homecook_profile = Kitchen_details.findOne({
      'user_id': Meteor.userId()
    });

    //activate dropdown
    this.$('select').material_select();

    //activate characterCounter
    this.$('input#input_text, textarea#cooking_exp').characterCounter();
    this.$('input#input_text, textarea#cooking_story').characterCounter();
    this.$('input#input_text, textarea#house_rule').characterCounter();
    //activate checkboxes_recall
    checkboxes_recall(get_homecook_profile.serving_option);

    Session.set("serving_option_tags", get_homecook_profile.serving_option)
    Session.set('kitchen_address_conversion', get_homecook_profile.kitchen_address_conversion)
    Session.set('profileImg', get_homecook_profile.profileImg)
    Session.set('bannerProfileImg', get_homecook_profile.bannerProfileImg)

    this.$('#kitchen_speciality').material_chip({
      data: get_homecook_profile.kitchen_speciality
    });
    this.$('#kitchen_tags').material_chip({
      data: get_homecook_profile.kitchen_tags
    });

  }, 1000);
});


Template.edit_homecook_profile.events({
    'blur #kitchen_address': function () {
      address_geocode('kitchen_address_conversion', $('#kitchen_address').val(), 'kitchen address');

    },

    'click #edit_homecook_button': function () {
      //Step 1
      const kitchen_name = $('#kitchen_name').val();
      const chef_name = $('#chef_name').val();
      const kitchen_address_country = $('#kitchen_address_country').val();
      const kitchen_address = $('#kitchen_address').val();
      const kitchen_address_conversion = Session.get('kitchen_address_conversion');
      const kitchen_contact_country = $('#kitchen_contact_country').val();
      const kitchen_contact = $('#kitchen_contact').val().replace(/\s/g, "");
      const serving_option = Session.get('serving_option_tags');

      //Step 2
      const cooking_exp = $('#cooking_exp').val();
      const cooking_story = $('#cooking_story').val();

      //Step 3
      var speciality = $('#kitchen_speciality').material_chip('data');
      const kitchen_speciality = speciality;

      var tags = $('#kitchen_tags').material_chip('data');
      const kitchen_tags = tags;


      //Step 4
      const house_rule = $('#house_rule').val();



      Meteor.call('kitchen_details.update',
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
        Session.get('profileImg'),
        Session.get('bannerProfileImg'),

        function (err) {
          if (err) Materialize.toast('Oops! ' + err.message + ' Please try again.', 4000, 'rounded red lighten-2');
          else {
            Meteor.call('profile_details.syncFromKitchen', chef_name, kitchen_contact, Session.get('profileImg'), (err, response) => {
              if (err) {
                Materialize.toast('Oops! ' + err.message + ' Please try again.', 4000, 'rounded red lighten-2');
              } else {
                Materialize.toast('Profile updated!', 4000);
                FlowRouter.go('/profile/show_homecook_profile');
              }
            });
          }
        }
      );

    }

  }),





  Template.edit_foodie_profile.helpers({

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

Template.edit_homecook_profile.helpers({
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