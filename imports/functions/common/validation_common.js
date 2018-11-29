window.util = window.util || {};
(function() {
  "use strict";  //  Safe wrapper for use strict.

  util.listDistrict = function () {
    let districts = [
      { name: 'Central and Western', images: 'https://c1.staticflickr.com/9/8646/15885419357_08a2904a90_b.jpg' },
      { name: 'Eastern', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Island_East_Night_View_201106.jpg/1200px-Island_East_Night_View_201106.jpg' },
      { name: 'Southern', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Ap_Lei_Chau_and_Aberdeen.JPG/1200px-Ap_Lei_Chau_and_Aberdeen.JPG' },
      { name: 'Wan Chai', images: 'https://www.tripsavvy.com/thmb/6u8KT4092JWMBKZn6cQvofoALKY=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-584942044-594490323df78c537b459c7a.jpg' },
      { name: 'Sham Shui Po', images: 'http://www.sham-shui-po.com/images/slide1.jpg' },
      { name: 'Kowloon City', images: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/HK_Kowloon_City_District_2008.jpg' },
      { name: 'Kwun Tong', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Kwun_Tong_District.jpg/1200px-Kwun_Tong_District.jpg' },
      { name: 'Wong Tai Sin', images: 'https://previews.agefotostock.com/previewimage/medibigoff/35eb1ab2024951aecc9c057efff17bf5/y8a-2493857.jpg' },
      { name: 'Yau Tsim Mong', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/13-08-08-hongkong-by-RalfR-Panorama2.jpg/1200px-13-08-08-hongkong-by-RalfR-Panorama2.jpg' },
      { name: 'Islands', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hong_Kong_Island_Skyline_201108.jpg/1200px-Hong_Kong_Island_Skyline_201108.jpg' },
      { name: 'Kwai Tsing', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kwai_Tsing_Container_Terminals.jpg/1200px-Kwai_Tsing_Container_Terminals.jpg' },
      { name: 'North', images: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Ping_Shek_Playground.JPG' },
      { name: 'Sai Kung', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Tseung_Kwan_O_Overview_201406.jpg/1200px-Tseung_Kwan_O_Overview_201406.jpg' },
      { name: 'Sha Tin', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Sha_Tin_Shing_Mun_River.JPG/1200px-Sha_Tin_Shing_Mun_River.JPG' },
      { name: 'Tai Po', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Tai_Po_New_Town_overview_2017.jpg/1200px-Tai_Po_New_Town_overview_2017.jpg' },
      { name: 'Tsuen Wan', images: 'https://extranet.who.int/agefriendlyworld/wp-content/uploads/2015/07/----------------------------------profile-pic1.jpg' },
      { name: 'Tuen Mun', images: 'https://www.itishk.com/wp-content/uploads/2013/04/tuen-mun-castle-peak.jpg' },
      { name: 'Yuen Long', images: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Yuen_Long_Skyline_201006.jpg/1200px-Yuen_Long_Skyline_201006.jpg'}
    ];
    return districts;
  };

  util.getDefaultFoodiesImage = function () {
    return 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foody.svg';
  };

  util.getDefaultChefImage = function () {
    return 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/chef.svg';
  };

  util.validationEmail = function(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(filter.test(email)){
        return true;
      }
      return false;
  };

  util.isEmpty = function(value) {
    if (!value || value.length == 0) {
      return false;
    }
    return true;
  };

  util.show_loading_progress = function() {
    $('#showLoadFull').css('display', 'block');
  };

  util.hide_loading_progress = function() {
    $('#showLoadFull').css('display', 'none');
  };

  util.checkCurrentSite = function() {
    if (location.hostname == 'www.blueplate.co') {
      return true;
    }
    return false;
  };

  /**
   * Filter email to limit sms for add new into asana
   */
  util.filterEmailInternalForNotification = function() {
    if (Meteor.userId()) {
      var email = Meteor.user().emails[0].address;
      var arrEmailNeedFilter = ['kouseile@gmail.com', 'pmtandhqn@gmail.com', 'phuongtrangnguyen.kt@gmail.com', 
                                  'thechris.phan@gmail.com', 'phanxuanthe94@gmail.com'],
          bHasEmail = false;
    
      arrEmailNeedFilter.map( (itemEmail, idx) => {
          if (itemEmail === email || email.indexOf('@blueplate.co') > 0) {
              bHasEmail = true;
          }
      });
      return bHasEmail;
    }
    return false;
  };

  util.detectBrowser = function() {
    const { detect } = require('detect-browser');
    return detect();
  };
}());
/**
 * Validate phone number
 * 
 * @param {*} phoneNumber phone number
 * @param {*} countryCode country code phone number
 */
export function validatePhoneNumber(phoneNumber, countryCode) {
  //- replace all white spaces in phone number
  var phoneNumber = phoneNumber.trim().replace(/ /g,'');
  return phoneNumber;
};

/**
 * Get country code phone number from kitchen_details
 * 
 * @param kitchen object
 */
export function getCountryCodeFromKitChen(kitchen) {
  var countryCode = '+852';

  if (kitchen.kitchen_address_country != null && kitchen.kitchen_address_country.indexOf('Vietnam') > -1) {
    countryCode = '+84';
  } else if (kitchen.kitchen_address != null && kitchen.kitchen_address.indexOf('Vietnam') > -1) {
    countryCode = '+84';
  } else if (kitchen.kitchen_contact_country != null && kitchen.kitchen_contact_country.indexOf('Vietnam') > -1) {
    countryCode = '+84';
  }
  
  return countryCode;
};

/**
 * Get country code phone number from profile_details
 * 
 * @param profile object
 */
export function getCountryCodeFromProfile(profile) {
  var countryCode = '+852';

  if (profile.mobile_dial_code != null && profile.mobile_dial_code.indexOf('Vietnam')) {
    countryCode = '+84';
  } else if (profile.mobile != null && (profile.mobile.indexOf('+84') > -1 || profile.mobile.indexOf('84') == 0)) {
    countryCode = '+84';
  } else if (profile.home_address != null && profile.home_address.indexOf('Vietnam') > -1) {
    countryCode = '+84';
  }
  return countryCode;
};

$(document).on('focusin', '.form_field', function() {
  if ($(this).closest('input[type=checkbox]').length > 0) {
    $(this).data("old_data_val", $(this).is(':checked'));
  } else {
    $(this).data("old_data_val", $(this).val());
    }
});

/**
 * Tick field had changed if it was edited
 */
$(document).on('change', '.form_field', function() {
  var $el = $(this),
      oldVal = $el.data("old_data_val"),
      newVal = $el.val(),
      isCheckbox = $el.closest('input[type=checkbox]').is(':checked');

  if ( (newVal == oldVal) || (oldVal === isCheckbox) ) {
    $el.removeClass('dirty_field');
  } else {
    $el.addClass('dirty_field');
  }
});

$(document).on('change', '.validateFieldRequired, .invalid', function() {
  if ($(this).val() != null && $(this).val().length > 0) {
    $(this).removeClass('validateFieldRequired').removeClass('invalid');
  }
});