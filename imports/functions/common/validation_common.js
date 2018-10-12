
window.util = window.util || {};
(function() {
  "use strict";  //  Safe wrapper for use strict.

  util.getDefaultFoodiesImage = function () {
    return 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foody.svg';
  };

  util.getDefaultChefImage = function () {
    return 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/chef.svg';
  };

  util.loginAccession = function(path_access) {
    $('#login_modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      ready: function() {
         $(".overlay").remove();
      }, // Callback for Modal open. Modal and trigger parameters available
      complete: function() {
          $(".overlay").remove();
      } // Callback for Modal close
    });
    $('#path_access').val(path_access);
    $('#login_modal').modal('open');
  };

  util.validationEmail = function(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(filter.test(email)){
        return true;
      }
      return false;
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