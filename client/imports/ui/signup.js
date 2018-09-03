import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Accounts } from 'meteor/accounts-base';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleFullName = this.handleFullName.bind(this);
    this.inputEmail = this.inputEmail.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleResend = this.handleResend.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDistrictChange =this.handleDistrictChange.bind(this);
    this.handleDistrictConfirm = this.handleDistrictConfirm.bind(this);
    this.handleDistrictBack = this.handleDistrictBack.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChooseChef = this.handleChooseChef.bind(this);
    this.state = {
      fullName: '',
      email:'',
      password:'',
      confirmPassword: '',
      stage: 1,
      signUpLoading: false,
      role: '',
      district: '',
      resendVerify: '',
    }
    this.baseState = this.state;
    this.districts = [
          {
            districtName: "Central and Western",
            region: "Hong Kong Island"
          },
          {
            districtName: "Eastern",
            region: "Hong Kong Island"
          },
          {
            districtName: "Southern",
            region: "Hong Kong Island"
          },
          {
            districtName: "Wan Chai",
            region: "Hong Kong Island"
          },
          {
            districtName: "Sham Shui Po",
            region: "Kowloon"
          },
          {
            districtName: "Kowloon City",
            region: "Kowloon"
          },
          {
            districtName: "Kwun Tong",
            region: "Kowloon"
          },
          {
            districtName: "Wong Tai Sin",
            region: "Kowloon"
          },
          {
            districtName: "Yau Tsim Mong",
            region: "Kowloon"
          },
          {
            districtName: "Islands",
            region: "New Territories"
          },
          {
            districtName: "Kwai Tsing",
            region: "New Territories"
          },
          {
            districtName: "North",
            region: "New Territories"
          },
          {
            districtName: "Sai Kung",
            region: "New Territories"
          },
          {
            districtName: "Sha Tin",
            region: "New Territories"
          },
          {
            districtName: "Tai Po",
            region: "New Territories"
          },
          {
            districtName: "Tsuen Wan",
            region: "New Territories"
          },
          {
            districtName: "Tuen Mun",
            region: "New Territories"
          },
          {
            districtName: "Yuen Long",
            region: "New Territories"
          },
        ]
  }

  handleNext = () => {
    this.setState({
      stage: this.state.stage + 1,
    })
  }

  handleBack = () => {
    this.setState({
      stage: this.state.stage + 1,
    })
  }

  handleClose = () => {
    this.setState(this.baseState)
  }

  handleChooseChef = () => {
    this.setState({
      role: 'Chef',
      stage: this.state.stage + 1,
    })
  }

  handleChooseFoodie = () => {
    this.setState({
      role: 'Foodie',
      stage: this.state.stage + 1,
    })
  }

  handleDistrictChange = (event) => {
    this.setState({
      district: event.target.value,
    })
  }

  handleDistrictConfirm = () => {
    this.setState({
      stage: this.state.stage + 1
    })
  }

  handleDistrictBack() {
    this.setState({
      stage: this.state.stage - 1
    })
  }

  handleFullName(event) {
    this.setState({
      fullName: event.target.value
    })
  }

  inputEmail(event) {
    this.setState({
      email: event.target.value
    })
  }

  inputPassword(event) {
    this.setState({
      password: event.target.value
    })
  }

  confirmPassword(event) {
    this.setState({
      confirmPassword: event.target.value
    })
  }

  handleSignUp = () => {
    const self = this;
    self.setState({
      signUpLoading: true
    })
    var trimInput = function(value){
      return value.replace(/^\s*|\s*$/g,"");
    }

    var isNotEmpty = function(value){
      if (value && value !== ''){
        return true;
      }
      Bert.alert("Email or password fields cannot be blank", "danger", "growl-top-right");
      self.setState({signUpLoading: false});
      return false;
    }
    //Email Validation
    isEmail = function(value){
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(filter.test(value)){
        return true;
      }
      Bert.alert("Please use a valid email address","danger","growl-top-right")
      self.setState({signUpLoading: false});
      return false;
    }
    //Check Password fields
    isValidPassword=function(password){
      if(password.length < 8){
        Bert.alert("Password must be greater than 8 charaters", "danger","growl-top-right");
        self.setState({signUpLoading: false});
        return false;
      }
        return true;
      };
    //Match Password
    areValidPassword = function(password, cpassword){
      if(!isValidPassword(password)){
        return false;
      }
      if(password !== cpassword){
        Bert.alert("Password and confirm password mismatch. Please try again !","danger","growl-top-right");
        self.setState({signUpLoading: false});
        return false;
      }
        return true;
    }

    //- validating email
    var validateEmail = function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    var email = trimInput(this.state.email);
    var password = trimInput(this.state.password);
    var cpassword = trimInput(this.state.confirmPassword);
    if (this.state.role == "Chef") {
      var chef_signup = true;
      var foodie_signup = false;
    } else {
      var chef_signup = false;
      var foodie_signup = true;
    }
    var full_name = trimInput(this.state.fullName);
    var district = trimInput(this.state.district);
    if( isNotEmpty(email)      &&
        isNotEmpty(password)   &&
        isNotEmpty(full_name)  &&
  //      isNotEmpty(first_name) &&
        isEmail(email)         &&
        areValidPassword(password, cpassword)) {
          Accounts.createUser({
            email: email,
            password: password,
            profile: {
              name: full_name,
              chef_signup: chef_signup,
              foodie_signup: foodie_signup,
              district: district,
            }
          }, function(err){
            if(err){
              self.setState({signUpLoading: false});
              Bert.alert(err.reason,"danger", "growl-top-right");
            } else {
              //- send to Facebook Pixel
              fbq('trackCustom', 'CompleteRegistration', { fullname: full_name, email: email });
              Meteor.call('sendVerificationEmail', Meteor.userId(),function(err, response) {
                if (!err) {
                  self.setState({stage: 4, signUpLoading: false,});
                  //- create Stripe user id for that user register
                  Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
                } else {
                  self.setState({signUpLoading: false});
                  Bert.alert(err.reason,"danger", "growl-top-right");
                }
              });
            }
          });
        }
        return false;
      }

  handleResend = () => {
    var self = this;
    self.setState({signupLoading: true, resendVerify: ''})
    Meteor.call('sendVerificationEmail', Meteor.userId(), (error) => {
      if (error) {
        self.setState({signUploading: false, resendVerify: false})
      } else {
        self.setState({signUploading: false, resendVerify: true})
      }
    });
  }

  signUpFlow() {
    switch (this.state.stage) {
      case 1:
        return (
          <div className = "section">
            <div className = "row">
              <h5 className = "bp-red-text center-align">Thanks for showing your interest to join the food revolution! There are 3 questions we would like to check with you.</h5>
            </div>
            <div className = "row">
              <h3 className = "bp-red-text center-align">Do you love making food, or you rather prefer eating?</h3>
            </div>
            <div className = "row">
              <h5 className = "bp-red-text center-align">I am a</h5>
            </div>
            <div className = "row">
              <div className = "col l6 m6 s6">
                <button className = "btn bp-red marketing_popup_btn right" onClick = {this.handleChooseChef}>chef</button>
              </div>
              <div className = "col l6 m6 s6">
                <button className = "btn bp-red marketing_popup_btn left" onClick = {this.handleChooseFoodie}>foodie</button>
              </div>
            </div>
          </div>
        )
        break;
      case 2:
        return (
          <div className = "container">
            <div className = "row">
              <h5 className = "bp-red-text center-align">2 more questions!</h5>
            </div>
            <div className = "row">
              <h2 className = "bp-red-text center-align">Which district do you live in?</h2>
            </div>
            <div className = "row">
              <select ref="dropdown" className="browser-default" id="district_selection" onChange={this.handleDistrictChange} value={(this.state.district)?this.state.district:""}>
                <option value="">Choose a district</option>
                {
                  this.districts.map((item, index) => {
                    return (
                      <option key = {index} value = {item.districtName}>{item.districtName}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className = "row">
              <div className = "col s12 m6 l6 center ">
                <button className = "btn bp-red marketing_popup_btn center-align add-margin-top" onClick = {this.handleDistrictBack}>back</button>
              </div>
              <div className = "col s12 m6 l6 center">
                <button className = "btn bp-red marketing_popup_btn center-align add-margin-top" onClick = {this.handleDistrictConfirm} disabled={(!this.state.district)?true:false}>next</button>
              </div>
            </div>
          </div>
        )
        break;
      case 3:
        return (
          <div>
            <h4 className = "bp-red-text">And, the last one!</h4>
            <div className="row">
              <div className="input-field">
                <input id="signup_full_name" name="fullName" type="text" className="validate" value = {this.state.fullname} onChange = {this.handleFullName} />
                <label htmlFor="signup_full_name">Full Name</label>
              </div>

              <div className="input-field">
                <input id="signup_email" name="email" type="email" className="validate" value = {this.state.email} onChange = {this.inputEmail} />
                <label htmlFor="signup_email">Email</label>
              </div>
              <div className="input-field">
                <input id="signup_password" name="password" type="password" className="validate" value = {this.state.password} onChange = {this.inputPassword} />
                <label htmlFor="signup_password">Create a Password</label>
              </div>
              <div className="input-field">
                <input id="signup_cpassword" name="cpassword" type="password" className="validate" value = {this.state.confirmPassword} onChange = {this.confirmPassword}/>
                <label htmlFor="signup_cpassword">Confirm your Password</label>
              </div>
              <p><small>By submitting your email and password, you have agreed our website <a href="#">terms of use</a>, <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>.</small></p>
              <div className = "col l12 m12 s12 center">
                <button
                  className="btn bp-red marketing_popup_btn add-margin-top"
                  type="submit"
                  onClick = {this.handleSignUp}
                  disabled = {
                    (this.state.fullName && this.state.email && this.state.password && this.state.confirmPassword)?
                      (this.state.signUpLoading) ?
                        true
                      :
                        false
                    :
                      true
                    }
                >{(this.state.signUpLoading)?"loading...":"sign up"}</button>
              </div>
            </div>
          </div>
        )
        break;
      case 4:
        return (
          <div className = "container">
            <h5 className = "bp-red-text center-align">Thanks for signing up!</h5>
            <h5 className = "bp-red-text center-align">A verification email has been sent to your email address. Please verify your account by clicking the link in the email.</h5>
            <h5 className = "bp-red-text center-align">If you don't see our verification email coming in, don't forget to check your junk/spam mailbox.</h5>
            <p className = "bp-red-text center-align"><small>Haven't received our verification email yet? Click <a href="#" onClick = {this.handleResend}>here</a> to resend.</small></p>
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
        )
        break;
    }
  }

  render () {
    return (
      <div className = "modal-content marketing_modal_content valign-wrapper">
        <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
        <div className = "modal-content" id="signup_content">
          <div className="signup_form col l12 m12 s12">
            {this.signUpFlow()}
          </div>
        </div>
      </div>
    )
  }



}
