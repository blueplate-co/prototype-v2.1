
/**
 * Validate phone number
 * 
 * @param {*} phoneNumber phone number
 * @param {*} countryCode country code phone number
 */
export function validatePhoneNumber(phoneNumber, countryCode) {
    if (phoneNumber.indexOf("+") == -1) {
        if (countryCode != null && countryCode == '+84') {
          if (phoneNumber.indexOf('0') == 0) {
            phoneNumber = countryCode + phoneNumber.substr(1);
          } else if (phoneNumber.indexOf('84') == 0) {
            phoneNumber = countryCode + phoneNumber.substr(2);
          } else {
            phoneNumber = countryCode + phoneNumber;
          }
        } else {
            if (phoneNumber.indexOf('0') == '0') {
              // for number is not have 0 at first 123xxxxxx
              phoneNumber = '+852' + phoneNumber.substr(1);
            } else if (phoneNumber.indexOf('852') == 0) {
              phoneNumber = countryCode + phoneNumber.substr(2);
            } else {
              // for number is have 0 at first 0123xxxxx
              phoneNumber = "+852" + phoneNumber.substr(1);
            }
        }
      }
    
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
      isCheckbox = $('.form_field').closest('input[type=checkbox]').is(':checked');

  if ( (newVal == oldVal) || oldVal == isCheckbox) {
    $el.removeClass('dirty_field');
  } else {
    $el.addClass('dirty_field');
  }
});