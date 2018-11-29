import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';
import { getCookie, delete_cookies } from '/imports/functions/common/promotion_common';
import LoginWithSocialNetwork from './login_with_social_network.js';
import districts from '/imports/functions/common/districts_common.json';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleResend = this.handleResend.bind(this);
    this.state = {
      accnSignup: {
        fullName: '',
        district: '',
        email: '',
        password: ''
      },
      stage :1,
      signUpLoading: false,
      resendVerify: '',
      userId: ''
    }
  }

  handleOnChangeField(field, event) {
    accnSignup = this.state.accnSignup;
    accnSignup[field] = event.target.value;
    this.setState({ accnSignup: accnSignup });
  };

  validationSignUpAccn(full_name, district, email, password) {
    if (!util.isEmpty(full_name)) {
      Bert.alert("Name's field cannot be blank", "danger", "growl-top-right");
      return false;
    } else if (!util.isEmpty(district)) {
      Bert.alert("Select your district, please!", "danger", "growl-top-right");
      return false;
    } else if (!util.isEmpty(email)) {
      Bert.alert("Email's field cannot be blank", "danger", "growl-top-right");
      return false;
    } else if (!util.validationEmail(email)) {
      Bert.alert("Email address is invalid","danger","growl-top-right")
      return false;
    } else if (!util.isEmpty(password)) {
      Bert.alert("Password's field cannot be blank", "danger", "growl-top-right");
      return false;
    } else if (password.length < 8) {
      Bert.alert("Password must be greater than 8 charaters", "danger","growl-top-right");
      return false;
    }
    return true;
  };

  handleSignUp = () => {
    const that = this;
    var trimInput = function(value) {
      return value.replace(/^\s*|\s*$/g,"");
    };

    var email = trimInput(this.state.accnSignup.email),
    password = trimInput(this.state.accnSignup.password),
    full_name = trimInput(this.state.accnSignup.fullName),
    district = this.state.accnSignup.district;
    
    if(this.validationSignUpAccn(full_name, district, email, password)) {
      that.setState({signUpLoading: true});
      util.show_loading_progress();
      var profile = {
        name: full_name,
        chef_signup: false,
        foodie_signup: true,
        district: district,
      };

      Accounts.createUser({email: email, password: password, profile: profile}, function(err){
        if (err) {
          util.hide_loading_progress();
          that.setState({signUpLoading: false});
          Bert.alert(err.reason,"danger", "growl-top-right");
        } else {
          //- send to Facebook Pixel
          if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
            fbq('trackCustom', 'CompleteRegistration', { fullname: full_name, email: email });
          }

          that.setState({stage: 2, userId: Meteor.userId()});
          // check if have already cookies, create a promotion balance for this user
          if (getCookie('promotion')) {
            Meteor.call('promotion.check_history', (err, res) => {
                if (Object.keys(res).length == 0) { // this user not already have promotion before
                    let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                    Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount, (err, res) => {
                        if (!err) {
                            util.hide_loading_progress();
                            delete_cookies('promotion');
                            that.sendEmailVerification();
                        }
                    });
                } else {
                  util.hide_loading_progress();
                }
            });
          } else {
            //- when have any promotion cookies
            that.sendEmailVerification();
          }
        }
      });
    }
  };

  sendEmailVerification() {
    var that = this;
    Meteor.call('sendVerificationEmail', Meteor.userId(),function(err, response) {
      if (!err) {
        util.hide_loading_progress();
        that.setState({signUpLoading: false});
        //- create Stripe user id for that user register
        Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
        Meteor.logout(function(err){});
        Materialize.toast('Signup successful.', 4000, 'rounded bp-green');
      } else {
        util.hide_loading_progress();
        that.setState({signUpLoading: false});
        Bert.alert(err.reason,"danger", "growl-top-right");
      }
    });
  };

  handleResend = () => {
    var self = this;
    self.setState({signupLoading: true, resendVerify: ''})
    Meteor.call('sendVerificationEmail', this.state.userId, (error) => {
      if (error) {
        self.setState({signUploading: false, resendVerify: false})
      } else {
        self.setState({signUploading: false, resendVerify: true})
      }
    });
  }

  componentDidMount = () => {
    $('.page-footer').hide();
    $('#top-navigation-container').hide();
  };

  signUpFlow() {
    switch (this.state.stage) {
      case 1:
        return (
            <div className="row">

              <div className="input-field">
                <input id="signup_full_name" name="fullName" type="text" className="validate" onChange={(event) => this.handleOnChangeField('fullName', event)} />
                <label htmlFor="signup_full_name">Full Name</label>
              </div>

              <div className="input-field" id="signup-district">
                  <select ref="dropdown" className="browser-default" id="signup-district-option" value={this.state.accnSignup.district} 
                      onChange={(event) => this.handleOnChangeField('district', event)}>
                      <option value="" disabled>Choose your district</option>
                      {
                          districts.map((item, index) => {
                              return (
                                    <option key={index} value={item.districtName}>{item.districtName}</option>
                                  )
                              })
                      }
                  </select>
              </div>

              <div className="input-field">
                <input id="signup_email" name="email" type="email" className="validate" onChange = {(event) => this.handleOnChangeField('email', event)} />
                <label htmlFor="signup_email">Email</label>
              </div>

              <div className="input-field">
                <input id="signup_password" name="password" type="password" className="validate" onChange = {(event) => this.handleOnChangeField('password', event)} />
                <label htmlFor="signup_password">Password</label>
              </div>

              <p id="have-accn-login">Already have account? <span className="bp-blue-text login-accn" onClick={ () => FlowRouter.go("/login")}><strong>Login</strong></span></p> <br />
              <p><small>By submitting your email and password, you have agreed our website <a href="#">terms of use</a>, <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>.</small></p>
              <div className = "no-padding btn-signup-text col l12 m12 s12 center" >
                <button className="btn btn-sigup-accn add-margin-top" type="submit"
                  onClick = {this.handleSignUp}>
                  {(this.state.signUpLoading)?"loading...":"sign up"}</button>
              </div>
              
              <LoginWithSocialNetwork actionSocial="Signup "/>
            </div>
        )
        break;
      case 2:
        return (
          <div className = "row">

            <div className="row">
              <p className = "center-align">Thanks for signing up!</p>
            </div>

            <div className="row">
              <p className = "center-align">A verification email has been sent to your email address. Please verify your account by clicking the link in the email.</p>
            </div>

            <div className="row">
              <p className = "center-align">If you don't see our verification email coming in, don't forget to check your junk/spam mailbox.</p>
            </div>

            <div className="row">
              <p className = "center-align"><small>Haven't received our verification email yet? Click <a href="#" onClick = {this.handleResend}>here</a> to resend.</small></p>
            </div>

            <div className="row">
              {
                this.state.resendVerify == '' ?
                ""
                :
                this.state.resendVerify ?
                  <p className = "center-align">Sent! Please check again!</p>
                :
                  <p className = "center-align">Something's wrong, please try again.</p>
              }
            </div>
          </div>
        )
        break;
    }
  }

  render () {
    return (
      <div className="container" id="signup_content">
        <div onClick={() => FlowRouter.go('/main')} className="signup-page-main-page">
            <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BPLogo_sysmbol.svg"
                className="navbar_logo" height="30" width="30"/>
        </div>

        <div className="row">
          <div className="signup_form col l6 m6 s12">
            <div id="loginpage-title">
              <span>blueplate.co</span>
            </div>
            
            {this.signUpFlow()}
          </div>
        </div>
      </div>
    )
  }
}
