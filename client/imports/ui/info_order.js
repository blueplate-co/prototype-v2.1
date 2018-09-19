import React, { Component } from 'react';
import { open_dialog_edit_confirm } from '/imports/functions/common';
import { Accounts } from 'meteor/accounts-base';
import districts from '/imports/functions/common/districts_common.json';


export default class InfoOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_obj: this.props.order_obj,
            foodies_name: Meteor.user() ? Meteor.user().profile.name : "",
            bHasAccn: false,
            account: {
                email: '',
                password: ''
            }
        }
    };

    componentDidMount() {
        $('#phone_ordering').intlTelInput({
            initialCountry: "HK",
            utilsScript: "../intlTelInput/utils.js"
        });
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
                $('#' + field).addClass('invalid');
            } else {
                $('#' + field).removeClass('invalid');
            }
        }
        order_info[field] = ev.target.value;

        var phone_formated = $('#phone_ordering').intlTelInput("getNumber");
        order_info['phone_ordering'] = phone_formated;
        this.setState({ order_obj:order_info});
    };

    scrollToFieldRequired(el, styleSheet) {
        var $el = $('#' + el);
        $el.addClass(styleSheet);
        $el.focus();
    };

    handleOnCloseOrderInfo() {
        var hasChangeField = $('.dirty_field'),
        bChangeField = hasChangeField.length > 0;

        if (bChangeField) {
            open_dialog_edit_confirm("Are you sure?", "Some change field not save, are you sure exit?", () => {
              // Cancel
      
            }, () => {
                $('#ordering-popup').removeClass('.dirty_field');
                this.props.closeOrderingPopup();
                $('#ordering-popup').modal('close');
            });
        } else {
            this.props.closeOrderingPopup();
            $('#ordering-popup').modal('close');
        }
    };

    handleOnSaveOrderingInfo() {
        var ordering_info = this.state.order_obj;
        this.state.foodies_name !== undefined && this.state.foodies_name !== '' ? this.state.order_obj.name_ordering = this.state.foodies_name : "do nothing";
        
        if (!this.validateInforOrdering(ordering_info)) {
            return;
        }
        util.show_loading_progress();
        this.createFoodiesName(this.state.order_obj.name_ordering);
        this.createUserInfo(ordering_info);
        
        Meteor.call('ordering.createProfileOrder', ordering_info, (err, res) => {
            if (!err) {
                console.log('Create info success');
                $('#ordering-popup').removeClass('.dirty_field');
                $('#ordering-popup').modal('close');
                this.props.handleOnSaveOrderingInfo();
            }
        });
    };

    createUserInfo(user) {

        Accounts.createUser({
            email: user.email_ordering,
            password: "123456789",
            profile: {
              name: user.name_ordering,
              chef_signup: false,
              foodie_signup: true,
              district: user.district_ordering,
            }
          }, function(err){
            if(err){
                util.hide_loading_progress();
                Bert.alert( error.reason, 'danger','growl-top-right');
            } else {
                //- send to Facebook Pixel
                if (location.hostname == 'www.blueplate.co') {
                    fbq('trackCustom', 'CompleteRegistration', { fullname: user.name_ordering, email: user.email_ordering });
                }

                Meteor.call('manualVerifyEmail');
                //- create Stripe user id for that user register
                Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
            }
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
        if (ordering_info.name_ordering.trim() == '') {
            this.scrollToFieldRequired('name_ordering', 'invalid');
            Materialize.toast('Name is required.', 4000, 'rounded bp-green');
            return false;
        } else if (ordering_info.district_ordering.trim() == '') {
            this.scrollToFieldRequired('district_ordering', 'invalid');
            Materialize.toast('Please select your district.', 4000, 'rounded bp-green');
            return false;
        } else if (ordering_info.email_ordering.trim() == '') {
            this.scrollToFieldRequired('email_ordering', 'invalid');
            Materialize.toast('Email is required.', 4000, 'rounded bp-green');
            return false;
        } else if (!util.validationEmail(ordering_info.email_ordering)) {
            this.scrollToFieldRequired('email_ordering', 'invalid');
            Materialize.toast('Email is not valid format.', 4000, 'rounded bp-green');
            return false;
        } else if (!$('#phone_ordering').intlTelInput("isValidNumber")) {
            this.scrollToFieldRequired('phone_ordering', 'invalid');
            Materialize.toast('Mobile number is not valid format.', 4000, 'rounded bp-green');
            return false;
        } 
    //     else if ( ordering_info.address_conversion.lng == '' || ordering_info.address_conversion.lat == '' ) {
    //        this.scrollToFieldRequired('address_ordering', 'invalid');
    //        Materialize.toast('Please select correct address!', 4000, 'rounded bp-green');
    //        return false;
    //    }
        return true;
    };

    validateLoginAccount(account) {
        if (account.email.trim() == '') {
            this.scrollToFieldRequired('email', 'invalid');
            Materialize.toast('Email is required.', 4000, 'rounded bp-green');
            return false;
        } else if (!util.validationEmail(account.email)) {
            this.scrollToFieldRequired('email', 'invalid');
            Materialize.toast('Email is not valid format.', 4000, 'rounded bp-green');
            return false;
        } else if (account.password.trim() == '') {
            this.scrollToFieldRequired('password', 'invalid');
            Materialize.toast('Password is required.', 4000, 'rounded bp-green');
            return false;
        }
        return true;
    };

    handleLogin() {
        this.setState({ bHasAccn: !this.state.bHasAccn ? true : false });
    };

    handleBacktoInfo() {
        this.setState({ bHasAccn: this.state.bHasAccn ? false : true})
    };

    handleOnChangeFieldLoginAccn(field, event) {
        var accnt = this.state.account;
        accnt[field] = event.target.value;
        this.setState({ account: accnt});
    };

    handleOnLoginAccount() {
        var accnt = this.state.account;
        var that = this;

        if (!this.validateLoginAccount(accnt)) {
            return;
        }
        util.show_loading_progress();
        Meteor.loginWithPassword(accnt.email, accnt.password, function(error){
            if (error) {
                util.hide_loading_progress();
                Bert.alert( error.reason, 'danger','growl-top-right');
            } else {
                $('#ordering-popup').removeClass('.dirty_field');
                $('#ordering-popup').modal('close');
                that.props.handleOnSaveOrderingInfo();
            }
        });
    };


    render() {
        return (
            <div id="ordering-popup" style={{'display': this.props.isOpen ? 'block' : 'none'}} className="modal modal-fixed-footer ordering-popup-infor">
                { (this.state.bHasAccn) ?
                    <span>
                        <div className="modal-content">
                            <div>
                                <p id='btn-back-to-info' onClick={() => this.handleBacktoInfo()}><i className="fa fa-arrow-left"></i></p>
                                <h5 className="text-center">Log in</h5>
                            </div>
                            <div className="input-field col s6">
                                <input id="email" type="text" className="form_field" value={this.state.account.email || ''} onChange={this.handleOnChangeFieldLoginAccn.bind(this, 'email')} />
                                <label className="active" htmlFor="email">email</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="password" type="password" className="form_field" value={this.state.account.password || ''} onChange={this.handleOnChangeFieldLoginAccn.bind(this, 'password')} />
                                <label className="active" htmlFor="password">password</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-confirm" onClick={() => this.handleOnLoginAccount()}>submit</a>
                        </div>
                    </span>
                    :
                    <span>
                        <div className="modal-content">
                            <h5>Please fill your info before order</h5>
                            {
                                (this.state.foodies_name !== undefined && this.state.foodies_name !== '') ?
                                    ''
                                :
                                    <div className="input-field col s6">
                                        <input id="name_ordering" type="text" className="form_field" value={this.state.order_obj.name_ordering} onChange={this.handleOnChange.bind(this, 'name_ordering')}/>
                                        <label className="active" htmlFor="name_ordering">name</label>
                                    </div>
                            }
                            <div id="email-distric-display">
                                <div className="input-field col s6 email_ordering">
                                    <input id="email_ordering" type="text" className="form_field" value={this.state.order_obj.email_ordering || ''} onChange={this.handleOnChange.bind(this, 'email_ordering')}/>
                                    <label className="active" htmlFor="email_ordering">email</label>
                                </div>
                                <div id="district-option">
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
                            <div className="input-field col s6">
                                <input id="phone_ordering" type="text" className="form_field" value={this.state.order_obj.phone_ordering} onChange={this.handleOnChange.bind(this, 'phone_ordering')}/>
                                <label className="active" htmlFor="phone_ordering">phone number</label>
                            </div>
                        </div>
                        <div className="modal-footer get-info">
                            <p id="have-accn-text">Already have account? <span className="bp-blue-text handle-login-text" onClick={ () => this.handleLogin()}>Login</span></p>
                            <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-close" onClick={() => this.handleOnCloseOrderInfo()}>close</a>
                            <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-confirm" onClick={() => this.handleOnSaveOrderingInfo()}>save</a>
                        </div>
                    </span>
                }
            </div> 
        );
    }

}