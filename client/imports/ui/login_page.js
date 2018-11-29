import React, { Component } from 'react';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import LoginWithSocialNetwork from './login_with_social_network.js';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accnLogin: {
                email: '',
                password : ''
            }
        };
    }

    componentDidMount() {
        $('.page-footer').hide();
        $('#top-navigation-container').hide();
    };

    handleOnChangeField = (field, event) => {
        var account = this.state.accnLogin;
        account[field] = event.target.value;
        this.setState({ accnLogin: account });
    };

    validateAccount = (account) => {
        if (!util.isEmpty(account.email)) {
            util.hide_loading_progress();
            Bert.alert('email is required', 'danger','growl-top-right');
            return false;
        } else if (!util.validationEmail(account.email)) {
            util.hide_loading_progress();
            Bert.alert('Invalid email format', 'danger','growl-top-right');
            return false;
        } else if (!util.isEmpty(account.password)) {
            util.hide_loading_progress();
            Bert.alert('password is required', 'danger','growl-top-right');
            return false;
        }
        return true;
    }

    handleOnKeyDown = (event) => {
        if (event.keyCode == 13) {
            this.handleOnSignIn();
        }
    };

    handleOnSignIn = () => {
        util.show_loading_progress();
        var account = this.state.accnLogin;
        var path_access = $('#path_access').val();

        if (this.validateAccount(account)) {
            var that = this;
            Meteor.loginWithPassword(account.email, account.password, function(error) {
                if (error) {
                    util.hide_loading_progress();
                    Bert.alert( error.reason, 'danger','growl-top-right');
                } else if (Meteor.user().emails[0].verified === true) {
                    localStorage.setItem("loggedIn", true);
                    // if (Meteor.user().profile.chef_signup === true && !Kitchen_details.findOne({user_id: Meteor.userId()})) {
                    //     util.hide_loading_progress();
                    //     FlowRouter.go("/followup");
                    //     // check if have already cookies, create a promotion balance for this user
                    //     if (getCookie('promotion')) {
                    //         Meteor.call('promotion.check_history', (err, res) => {
                    //             let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                    //             if (Object.keys(res).length == 0) { // this user not already have promotion before
                    //                 Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount ,(err, res) => {
                    //                     if (!err) {
                    //                         delete_cookies('promotion');
                    //                     }
                    //                 });
                    //             }
                    //         });
                    //     }
                    // } else {
                        Bert.alert('Login successfully!' , 'success', 'fixed-top');
        
                        path_access != null && path_access.length > 0 ?
                            FlowRouter.go(path_access)
                        :
                            FlowRouter.go("/main");

                        // Insert or update data into DB after login success
                        that.addLocalCartIntoDataBase();
        
                        // check if have already cookies, create a promotion balance for this user
                        if (getCookie('promotion')) {
                            Meteor.call('promotion.check_history', (err, res) => {
                                if (Object.keys(res).length == 0) { // this user not already have promotion before
                                    let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
                                    Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount, (err, res) => {
                                        if (!err) {
                                            delete_cookies('promotion');
                                        }
                                    });
                                }
                            });
                        }
                    // }
                    util.hide_loading_progress()
                } else {
                    //- logout
                    Meteor.logout(function(err){
                        if (err) {
                            util.hide_loading_progress()
                            Bert.alert(err.reason, "danger", "growl-top-right");
                        } else {
                            util.hide_loading_progress()
                            Session.clear();
                            Bert.alert( 'Please verify your email before login!', 'danger','growl-top-right' );
                        }
                    });
                }
            });
        }
    };

    addLocalCartIntoDataBase = () => {
        var dishesLocal = JSON.parse(localStorage.getItem("localCart"));
        if (dishesLocal) {
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
                        Meteor.call('shopping_cart.update', order_id, quantity, total_price_per_dish,
                            function(err) {
                                localStorage.setItem("localCart", JSON.stringify([]));

                                // To make sure the dish we add from localStorage can display on foodies's shopping cart 
                                if (location.pathname.indexOf('shopping_cart') > -1) {
                                    location.reload();
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
                            cart_item.product_type,
                            function(err) {
                                localStorage.setItem("localCart", JSON.stringify([]));

                                // To make sure the dish we add from localStorage can display on foodies's shopping cart 
                                if (location.pathname.indexOf('shopping_cart') > -1) {
                                    location.reload();
                                }
                            }
                        );
                    }
                });
            });
        }
    };

    render = () => {

        return (
            <div className="container" id="login-page-container" onKeyDown={ (event) => {this.handleOnKeyDown(event)}}>
                <div onClick={() => FlowRouter.go('/main')} className="loginpage-main-page">
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BPLogo_sysmbol.svg"
                        className="navbar_logo" height="30" width="30"/>
                </div>

                <div className="row">
                    <div className="col s12 m6 l6 login-page-block">
                        <div id="loginpage-title">
                            <span>blueplate.co</span>
                        </div>

                        <div id="loginpage-content">
                            <div className="input-field">
                                <input id="email" type="text" className="form_field" 
                                    onChange={(event) => this.handleOnChangeField('email', event)}
                                />
                                <label  className="active" htmlFor="email">email</label>
                            </div>
                            
                            <div className="input-field">
                                <input id="password" type="password" className="form_field" 
                                    onChange={(event) => this.handleOnChangeField('password', event)}
                                />
                                <label className="active" htmlFor="password">password</label>
                            </div>
                            <input id="path_access" type="hidden" className="form_field" />
                        </div>

                        <div className="row" id="loginpage-btn">
                            <button className="waves-effect btn waves-red right login_submit_btn" id="login" type="submit"  onClick={() => this.handleOnSignIn()}>Login</button>
                        </div>
                        
                        <div className="row" id="loginpage-forgot-signup">
                            <div className="col s6 m6 l6 loginpage-forgot-pass" onClick={() => FlowRouter.go('/forgot-password')}>
                                <span className="no-padding loginpage-forgot-password">Forgot password</span>
                            </div>

                            <div className="text-right col s6 m6 l6" onClick={() => FlowRouter.go('/register')}>
                                <span className="loginpage-chef-signup text-right no-padding">Sign up</span>
                            </div>
                        </div>
                        
                        <LoginWithSocialNetwork actionSocial="Login "/>
                    </div>
                </div>
            </div>
        );
    }
}