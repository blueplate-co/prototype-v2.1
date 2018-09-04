
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
 * Validation env throught by domain
 */
export function validateEnv() {
  if (location.hostname == 'www.blueplate.co') {
    return 'production';
  }
  return 'dev';
}

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