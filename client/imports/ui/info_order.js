import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import districts from '/imports/functions/common/districts_common.json';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';

export default class InfoOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_obj: this.props.order_obj,
            foodies_name: Meteor.user() ? Meteor.user().profile.name : "",
            bHasFoodiesProfile: false,
            verification_timing: false,
            verification_countdown_time: 30,
            isValidPhone: false
        }
    };

    componentDidMount() {
        $('#phone_ordering').intlTelInput({
            initialCountry: "HK",
            utilsScript: "../intlTelInput/utils.js"
        });

        var profile_detail = Profile_details.findOne({"user_id": Meteor.userId()});
        if (profile_detail != undefined && profile_detail.email != '') {
            this.setState({ bHasFoodiesProfile: true });
        }
    }

    handleOnChange(field, ev) {
        var order_info = this.state.order_obj;

        // if (field === 'address_ordering') { // get address and geocode
        //     // Clear value before get new geocode
        //     order_info.address_conversion.lng = '';
        //     order_info.address_conversion.lat = '';

        //     var address_ordering = document.getElementById('address_ordering');
        //     var autocomplete = new google.maps.places.Autocomplete(address_ordering);
        //     google.maps.event.addListener(autocomplete, 'place_changed', function() {
        //         $('#address_ordering').removeClass('invalid');
        //         order_info.address_ordering = autocomplete.getPlace().formatted_address;
        //         order_info.address_conversion.lng = autocomplete.getPlace().geometry.location.lng();
        //         order_info.address_conversion.lat = autocomplete.getPlace().geometry.location.lat();
        //     });
        // }

        if (field === 'email_ordering') {
            if (!util.validationEmail(ev.target.value.trim())) {
                $('#email').addClass('invalid');
            } else {
                $('#email').removeClass('invalid');
            }
        }
        order_info[field] = ev.target.value;

        var phone_formated = $('#phone_ordering').intlTelInput("getNumber");
        order_info['phone_ordering'] = phone_formated;

        if (field === 'phone_ordering' && $('#phone_ordering').intlTelInput("isValidNumber")) {
            this.setState({ isValidPhone: true});
        } else if (field === 'phone_ordering') {
            this.setState({ isValidPhone: false});
        }

        this.setState({ order_obj:order_info});
    };

    scrollToFieldRequired(el, styleSheet) {
        var $el = $('#' + el);
        $el.addClass(styleSheet);
        $el.focus();
    };

    handleOnSaveOrderingInfo() {
        util.show_loading_progress();
        var ordering_info = this.state.order_obj;
        var password = this.generatePassword();

        this.state.foodies_name !== undefined && this.state.foodies_name !== '' ? this.state.order_obj.name_ordering = this.state.foodies_name : "do nothing";

        if (!this.validateInforOrdering(ordering_info)) {
            util.hide_loading_progress();
            return false;
        }
        
        //- validation about phone number before
        let full_phonenumber = $('#phone_ordering').val();
        let phone_number = this.getCountryCode(full_phonenumber).withoutCountryCode.replace(/ /g, '');
        let country_code = this.getCountryCode(full_phonenumber).countryCode.replace('+','');
        let verification_code = $('#verify_code').val().replace(/ /g, '');

        Meteor.call('message.verify_verification_number', phone_number, country_code, verification_code, (err, res) => {
            if (err) {
                this.scrollToFieldRequired('verify_code', 'invalid');
                Materialize.toast(err+ '. Please try again.', 6000, 'rounded bp-green');
                util.hide_loading_progress();
                return false;
            } else {
                var result = JSON.parse(res.content);
                if (!result.success) {
                    Materialize.toast('Error when verify the phone number with verification code. Please try again.', 4000, 'rounded bp-green');
                    util.hide_loading_progress();
                    return false;
                } else {
                    //- CONTINOUS RUN STEP BY STEP
                    util.show_loading_progress();
                    this.createFoodiesName(this.state.order_obj.name_ordering);
            
                    /**
                     * If don't have account, will create new account
                     */
                    if (!Meteor.userId()) {
                        this.createUserInfo(ordering_info, password);
                    }
                    
                    this.handleFoodiesProfile(ordering_info);
                }
            }
        });
    };

    /**
     * Create or update foodies profile if users has exist but
     * have no foodies profile.
     */
    handleFoodiesProfile(ordering_info) {
        if (!this.state.bHasFoodiesProfile) {
            // Create new profile
            Meteor.call('ordering.createProfileOrder', ordering_info, (err, res) => {
                if (!err) {
                    this.insertProductIntodDataBase();
                } else {
                    util.hide_loading_progress();
                }
            });
        } else {
            // Update profile
            Meteor.call('ordering.updateProfileOrder', ordering_info, (err, res) => {
                if (!err) {
                    this.insertProductIntodDataBase();
                } else {
                    util.hide_loading_progress();

                }
            })
        }
    }

    sendWelcomeEmail(name, email, password) {
        var content =   "Hi " + name + ",\n\n" +
                        "Thank you for joining us. Your account has been created with below information:\n" + 
                        "\tEmail: " + email + ",\n" + 
                        "\tPassword: " + password +"\n\n" + 
                        "For security reason please change you default password here: "
        
        Meteor.call('dish.send_welcome_email', Meteor.userId(), content, (err, res) => {
            if(!err) {
                // console.log('oke');
            }
        })
    }

    createUserInfo(user, password) {
        var that = this;
        Accounts.createUser({
            email: user.email_ordering,
            password: password,
            profile: {
              name: user.name_ordering,
              chef_signup: false,
              foodie_signup: true,
              district: user.district_ordering,
            }
          }, function(err){
            if(err){
                util.hide_loading_progress();
                Bert.alert( err.reason, 'danger','growl-top-right');
            } else {
                //- send to Facebook Pixel
                if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
                    fbq('trackCustom', 'CompleteRegistration', { fullname: user.name_ordering, email: user.email_ordering });
                }
        
                Meteor.call('manualVerifyEmail');
                //- create Stripe user id for that user register
                Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
                // that.sendWelcomeEmail(user.name_ordering, user.email_ordering, password);
            }
        });
        // check if have already cookies, create a promotion balance for this user
        if (getCookie('promotion')) {
            Meteor.call('promotion.check_history', (err, res) => {
                if (Object.keys(res).length == 0) { // this user not already have promotion before
                    let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                    Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount, (err, res) => {
                        if (!err) {
                            delete_cookies('promotion');
                            console.log('OK');
                        }
                    });
                }
            });
        }
    }

    // Insert or update data into DB after login success
    insertProductIntodDataBase = () => {
        var that = this;
        var dishesLocal = JSON.parse(localStorage.getItem("localCart"));
        dishesLocal.map( (cart_item, index) => {
          var foodie_details = Profile_details.findOne({user_id: Meteor.userId()});
          
          //check if the dish has been put in shopping check_shopping_cart
          var order = Shopping_cart.findOne({"product_id": cart_item.product_id, 'buyer_id': Meteor.userId()});
          var total_price_per_dish = 0;
          
          Meteor.call('shopping_cart.find_one', cart_item.product_id, Meteor.userId(), (err, res) => {
            if (res) {
                var order_id = order._id;
                var quantity = parseInt(order.quantity) + cart_item.quantity;
                total_price_per_dish = parseInt(cart_item.product_price) * quantity;
                Meteor.call('shopping_cart.update',
                    order_id,
                    quantity,
                    total_price_per_dish,
                    function(err) {
                        localStorage.setItem("localCart", JSON.stringify([]));
                        if (dishesLocal.length == index + 1) {
                            that.props.handleOnSaveOrderingInfo();
                        }
                    }
                )
              } else {
                  var foodie_name = foodie_details.foodie_name;
                  Meteor.call('shopping_cart.insert',
                      Meteor.userId(),
                      cart_item.seller_id,
                      foodie_name,
                      cart_item.seller_name,
                      cart_item.address,
                      cart_item.serving_option,
                      cart_item.ready_time,
                      cart_item.product_id,
                      cart_item.product_name,
                      cart_item.quantity,
                      cart_item.product_price,
                      function(err) {
                            localStorage.setItem("localCart", JSON.stringify([]));
                            if (dishesLocal.length == index + 1) {
                                that.props.handleOnSaveOrderingInfo();
                            }
                      }
                  );
              }
            });
        });
    }

    createFoodiesName(fullName) {
        var first_name = '',
            last_name = '';

        if (fullName.indexOf(" ") > 0) {
            first_name = fullName.substr(0, fullName.indexOf(" "));
            last_name = fullName.substr(fullName.indexOf(" "));
        } else {
            first_name = fullName;
            last_name = fullName;
        }
        var order_info = this.state.order_obj;
        order_info["first_name_order"] = first_name;
        order_info["last_name_order"] = last_name;

        this.setState({ order_obj: order_info });
    }

    validateInforOrdering(ordering_info) {
        let verification_code = $('#verify_code').val().replace(/ /g, '');

        if (ordering_info.name_ordering.trim() == '') {
            this.scrollToFieldRequired('name_ordering', 'invalid');
            Materialize.toast('Name is required.', 4000, 'rounded bp-green');
            return false;
        } 
        
        if (!this.state.bHasFoodiesProfile) {
            if (ordering_info.email_ordering.trim() == '') {
                this.scrollToFieldRequired('email', 'invalid');
                Materialize.toast('Email is required.', 4000, 'rounded bp-green');
                return false;
            }  else if (ordering_info.district_ordering.trim() == '') {
                this.scrollToFieldRequired('district_ordering', 'invalid');
                Materialize.toast('Please select your district.', 4000, 'rounded bp-green');
                return false;
            } else if (!util.validationEmail(ordering_info.email_ordering)) {
                this.scrollToFieldRequired('email', 'invalid');
                Materialize.toast('Email is not valid format.', 4000, 'rounded bp-green');
                return false;
            } else if (!$('#phone_ordering').intlTelInput("isValidNumber")) {
                this.scrollToFieldRequired('phone_ordering', 'invalid');
                Materialize.toast('Mobile number is not valid format.', 4000, 'rounded bp-green');
                return false;
            } else if (verification_code.length !== 4 || isNaN(parseInt(verification_code))) { // length must = 4 and 4 number
                this.scrollToFieldRequired('verify_code', 'invalid');
                Materialize.toast('Verification number invalid.', 4000, 'rounded bp-green');
                util.hide_loading_progress();
                return false;
            }
            return true;
        } 
    //     else if ( ordering_info.address_conversion.lng == '' || ordering_info.address_conversion.lat == '' ) {
    //        this.scrollToFieldRequired('address_ordering', 'invalid');
    //        Materialize.toast('Please select correct address!', 4000, 'rounded bp-green');
    //        return false;
    //    }
    };

    handleLogin() {
        util.loginAccession(location.origin +"/shopping_cart");
    };

    getCountryCode(input) {
        // Set default country code to US if no real country code is specified
        const defaultCountryCode = input.substr(0, 1) !== '+' ? 'US' : null;
        let formatted = new libphonenumber.asYouType(defaultCountryCode).input(input);
        let countryCode = '';
        let withoutCountryCode = formatted;

        if (defaultCountryCode === 'US') {
            countryCode = '+1';
            formatted = '+1 ' + formatted;
        } else {
            const parts = formatted.split(' ');
            countryCode = parts.length > 1 ? parts.shift() : '';
            withoutCountryCode = parts.join(' ');
        }

        return {
            formatted,
            withoutCountryCode,
            countryCode,
        }
    }

    generatePassword() {
        var currDate = new Date().getTime().toString();
        var password = currDate.substr(currDate.length - 5);
        for (var i = 0; i < 5; i++) {
            var pw = Math.floor(Math.random() * 35);
            if (pw > 9) {
                pw = String.fromCharCode(pw - 10 + 'a'.charCodeAt('0'));
            }
            password += pw;
        }
        return password;
    }

    handleSendVerifyCode() {
        var full_phonenumber = $('#phone_ordering').val();
        if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
            fbq('trackCustom', 'clickVerifyPhoneNumberButton', { content_ids: Meteor.userId(), phone_number: full_phonenumber });
        }
        if (!$('#phone_ordering').intlTelInput("isValidNumber")) {
            Materialize.toast('Mobile number is not valid format.', 4000, 'rounded bp-green');
            return false;
        } else {
            let phone_number = this.getCountryCode(full_phonenumber).withoutCountryCode.replace(/ /g, '');
            let country_code = this.getCountryCode(full_phonenumber).countryCode.replace('+','');
            Meteor.call('message.send_verify_phonenumber_code', phone_number, country_code, (err, res) => {
                if (err) {
                    Materialize.toast(err, 4000, 'rounded bp-green');
                    return false;
                } else {
                    var result = JSON.parse(res.content);
                    if (result.success) {
                        Materialize.toast('The verify code has been sent to your phone. Please check.', 4000, 'rounded bp-green');
                    } else {
                        return false;
                    }
                }
            })
        }
        this.setState({
            verification_timing: true
        }, () => {
            //- callback for timing
            var countdown = setInterval(() => {
                let currentSeconds = this.state.verification_countdown_time;
                if (currentSeconds == 0) {
                    this.setState({ verification_timing: false, verification_countdown_time: 30 });
                    clearInterval(countdown);
                } else {
                    this.setState({
                        verification_countdown_time: currentSeconds - 1
                    })
                }
            }, 1000);
        });
    }

    render() {
        return (
            <div id="ordering-popup" className="ordering-popup-infor container">
                <div className="">
                    <h5>Please let's us know who are you!</h5>
                    {
                        (this.state.foodies_name !== undefined && this.state.foodies_name !== '') ?
                            ''
                        :
                            <div className="input-field">
                                <input id="name_ordering" type="text" className="form_field" value={this.state.order_obj.name_ordering} onChange={this.handleOnChange.bind(this, 'name_ordering')}/>
                                <label className="active" htmlFor="name_ordering">name</label>
                            </div>
                    }

                    {
                        (this.state.bHasFoodiesProfile) ? 
                        ''
                        :
                        <span>
                            <div className="" id="email-distric-display">
                                <div className="no-padding input-field email_ordering">
                                    <input id="email" type="text" className="form_field" value={this.state.order_obj.email_ordering || ''} onChange={this.handleOnChange.bind(this, 'email_ordering')}/>
                                    <label className="active" htmlFor="email_ordering">email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col l7 m7 s7">
                                    <input id="phone_ordering" type="text" className="form_field" value={this.state.order_obj.phone_ordering} onChange={this.handleOnChange.bind(this, 'phone_ordering')}/>
                                    <label className="active" htmlFor="phone_ordering">phone number</label>
                                </div>
                                <div className="input-field col l5 m5 s5">
                                    <button disabled={this.state.verification_timing || !this.state.isValidPhone} className="verify-btn waves-green btn-flat btn-info-ordering-close" onClick={() => this.handleSendVerifyCode()}>
                                        {
                                            (!this.state.verification_timing) ?
                                                'Send verify code'
                                            :   'Resend in '
                                        }
                                        {
                                            (this.state.verification_timing) ?
                                                <span className="countdown-time">{this.state.verification_countdown_time}s</span>
                                            :   ''
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col l5 m5 s4">
                                    <input id="verify_code" type="text" className="form_field" />
                                    <label className="active" htmlFor="email_ordering">Verify code</label>
                                </div>
                                <div className="col l7 m7 s8" id="district-option">
                                    <i className="dropdown-arrow material-icons">expand_more</i>
                                    <select ref="dropdown" className="browser-default" id="district_ordering" value={this.state.order_obj.district_ordering} onChange={this.handleOnChange.bind(this, 'district_ordering')}>
                                        <option value="">Choose a district</option>
                                        {
                                            districts.map((item, index) => {
                                                return (
                                                        <option key = {index} value = {item.districtName}>{item.districtName}</option>
                                                    )
                                                })
                                        }
                                    </select>
                                </div>
                            </div>
                        </span>
                    }

                </div>
                <div className="modal-footer get-info">
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <p id="have-accn-text">Already have account? <span className="bp-blue-text handle-login-text" onClick={ () => this.handleLogin()}>Login</span></p>
                        </div>
                        <div className="col l6 m12 s12">
                            <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-close" onClick={() => this.props.handleBackToShopping()}>back</a>
                            <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-confirm" onClick={() => this.handleOnSaveOrderingInfo()}>save</a>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }

}