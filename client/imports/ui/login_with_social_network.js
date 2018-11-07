import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class LoginWithSocialNetwork extends Component {
    constructor(props) {
        super(props);
    }

    handleOnLoginFacebook = () => {
        var that = this;
        util.show_loading_progress();
        Meteor.loginWithFacebook({requestPermissions:['public_profile','email']}, function(err, res){
            if (err) {
                util.hide_loading_progress();
                Bert.alert(err.reason, "danger", "growl-top-right");
            } else {
                util.hide_loading_progress();
                localStorage.setItem("loggedIn", true);
                Meteor.call('payment.createCustomer', Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address);
                var profile_detail = Profile_details.findOne({user_id: Meteor.userId()});
                if (!profile_detail) {
                    that.createProfileNewFoodies();
                }

                FlowRouter.go("/main");
            }
        });
    };

    createProfileNewFoodies = () => {
        var profileImg = {
            origin: Meteor.user().profile.picture,
            large: Meteor.user().profile.picture,
            medium: Meteor.user().profile.picture,
            small: Meteor.user().profile.picture
        },
        obj_foodies = {
            name_ordering: Meteor.user().profile.name,
            first_name_order: Meteor.user().profile.first_name,
            last_name_order: Meteor.user().profile.last_name,
            email: Meteor.user().emails[0].address,
            mobile: '',
            home_address: '',
            home_address_conversion: '',
            profileImg: profileImg
        }
        Meteor.call('ordering.createProfileOrder', obj_foodies);
    };

    render() {
        return (
            <div className="row text-center" id="loginpage-choose-option">
                <span id="loginpage-or">
                    <span>or</span>
                </span>
                
                <div id="loginpage-facebook" onClick={() => this.handleOnLoginFacebook()}>
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/fb-icon.png"
                        width="40px" height="40px" />
                    <span>{this.props.actionSocial} with <strong>Facebook</strong></span>
                </div>

                <div id="loginpage-google" className="text-right">
                    {/* <img src="https://cdn4.iconfinder.com/data/icons/black-icon-social-media/512/099317-google-g-logo.png"
                            width="40px" height="40px" />
                    <span>Login with <strong>Google</strong></span> */}
                </div>
            </div>
        );
    }
}