import React, { Component } from "react";
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
    this.state = {
      fullName: '',
      email:'',
      password:'',
      confirmPassword: '',
      stage: 'sign up',
    }
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
    this.setState({stage: 'verification'});

    var trimInput = function(value){
      return value.replace(/^\s*|\s*$/g,"");
    }

    var isNotEmpty = function(value){
      if (value && value !== ''){
        return true;
      }
      Bert.alert("Email or password fields cannot be blank", "danger", "growl-top-right");
      return false;
    }
    //Email Validation
    isEmail = function(value){
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(filter.test(value)){
        return true;
      }
      Bert.alert("Please use a valid email address","danger","growl-top-right")
      return false;
    }
    //Check Password fields
    isValidPassword=function(password){
      if(password.length < 8){
      Bert.alert("Password must be greater than 8 charaters", "danger","growl-top-right");
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
    if (this.props.role == "Chef") {
      var chef_signup = true;
      var foodie_signup = false;
    } else {
      var chef_signup = false;
      var foodie_signup = true;
    }
    var full_name = trimInput(this.state.fullName);
    var district = trimInput(this.props.district);
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
            }
          }, function(err){
            if(err){
              Bert.alert(err.reason,"danger", "growl-top-right");
            } else {
              Meteor.call('sendVerificationEmail', Meteor.userId(),function(err, response) {
                if (!err) {
                  //- create Stripe user id for that user register
                  Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
                }
              });
            }
          });
        }
        return false;
      }

  handleResend() {
    Meteor.call('sendVerificationEmail', Meteor.userId());
  }

  render() {
    switch (this.state.stage) {
      case 'sign up':
        return (
          <div className = "modal-content container" id="signup_content">
            <div className="signup_form col l12 m12 s12">
              <h5 className = "bp-red-text center">{this.props.title}</h5>
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
              </div>

              <p><small>By submitting your email and password, you have agreed our website <a href="#">terms of use</a>, <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>.</small></p>
              <div className="right">
                <div className="modal_buttons">
                  <button className="waves-effect waves-red btn right bp-red signup_submit_btn" id="signup" type="submit" onClick = {this.handleSignUp}>Sign up</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'verification':
        return (
          <div className = "marketing_modal_content valign-wrapper">
            <div className = "container">
              <h4 className = "bp-red-text center-align">Thanks for signing up!</h4>
              <h6 className = "bp-red-text center-align">A verification email has been sent to your email address. Please verify your account by clicking the link in the email.</h6>
              <h6 className = "bp-red-text center-align">If you don't see our verification email coming in, don't forget to check your junk/spam mailbox.</h6>
              <p className = "bp-red-text center-align"><small>Haven't received our verification email yet? Click <a href="#" onClick = {this.handleResend}>here</a> to resend.</small></p>
            </div>
          </div>
        )
        break;
    }
  }



}