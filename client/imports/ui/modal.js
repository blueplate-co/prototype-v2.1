import React, { Component } from 'react';
import { Session } from 'meteor/session';

import DishCarousel from './dish_carousel';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// App component - represents the whole app
export default class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shouldRender: false,
            item: {},
            qty: 1,
            ingredients: [],
            menu: [],
            isMobile: false,
            location: [],
        }
    }

    decreaseQty = () => {
        if (this.state.qty > 1) {
            this.setState({
                qty: this.state.qty - 1
            })
        }
    }

    increaseQty = () => {
        this.setState({
            qty: this.state.qty + 1
        })
    }

    componentDidMount = () => {
      window.addEventListener('resize', () => {
          this.setState({
              isMobile: window.innerWidth < 601
          });
      }, false);
    }

    componentWillUnmount = () => {
      window.removeEventListener('resize', () => {
        this.setState({
          isMobile: false
        })
      }, false);
    }

    componentWillReceiveProps = () => {
        this.setState({
            qty: 1,
        })

        if (Session.get('modal')) {
            this.setState({
                item: Session.get('selectedMenu'),
            });

            if (this.state.item.user_id) {
              this.setState({
                location: Kitchen_details.findOne({ user_id: this.state.item.user_id}).kitchen_address_conversion
              })
            }
        }
    }

    renderServingOptions = (option) => {
      if (option) {
        return option.map((item, index) => {
          return (
            <span key = {index}>{item} </span>
          )
        })
      }
    }

    renderIngredients = (ingredient) => {
        if (ingredient) {
            return ingredient.map((item, index) => {
                return(
                    <li className="row no-padding" key={index}>
                        <div className="col l8 m8 s8 no-padding">
                            <span className="name">{ item.ingredient_name }</span>
                        </div>
                        <div className="col l4 m4 s4 no-padding">
                            <span className="unit"> { item.ingredient_unit }</span>
                            <span className="qty">{ item.ingredient_quantity }</span>
                        </div>
                    </li>
                )
            })
        } else {
            return (
                <span className="row none no-padding">No ingredients</span>
            )
        }
    }

    renderAllergiesList = (allergies) => {
        if (allergies) {
            return allergies.map((item, index) => {
                return(
                    <li key={index}>{ item }</li>
                )
            })
        }
    }

    renderDietaryList = (dietary) => {
        if (dietary) {
            return dietary.map((item, index) => {
                return(
                    <li key={index}>{ item }</li>
                )
            })
        }
    }

    renderDishTagList = (tag) => {
        if (tag) {
            return tag.map((item, index) => {
                return(
                    <li key={index}>{ item.tag }</li>
                )
            })
        } else {
            return (
                <span className="row none no-padding">No Tags</span>
            )
        }
    }

    /*
    setQty = (qty) => {
        this.setState({
            qty: qty
        })
    }
    */

    // when click order button
    order = () => {
        if (!Meteor.userId()) {
            FlowRouter.go('/');
            util.loginAccession("");
        } else {
            util.show_loading_progress();
            if (Session.get('selectedItem') == 'menu') {
                var menu_details = Menu.findOne({"_id":this.state.item._id});
                var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
                var foodie_id = Meteor.userId();
    
                if (typeof foodie_details == 'undefined' || foodie_details.foodie_name == '') {
                  Materialize.toast('Please complete your foodie profile before order.', 4000, 'rounded bp-green');
                }
    
                var homecook_id = menu_details.user_id;
                var homecook_details = Kitchen_details.findOne({"user_id": homecook_id});
                var foodie_name = foodie_details.foodie_name;
                var homecook_name =  homecook_details.chef_name;
                var menu_id = menu_details._id;
                var menu_price = menu_details.menu_selling_price;
                var menu_name = menu_details.menu_name;
                var ready_time = parseInt(menu_details.lead_days) * 24 * 60 + parseInt(menu_details.lead_hours) * 60;
                var quantity = menu_details.min_order;
    
                /* quantity selected was disabled, so the quantity adds to the shopping cart is the min order set from the menu
    
                if (this.state.qty < quantity) {
                    Materialize.toast('Oops! Your quantities must not less than minium order of this menu. Please set at least ' + quantity + ' item.', 'rounded bp-green');
                    return true;
                } */
    
    
                var serving_option = Session.get('method')
                var address = Session.get('address')
                //check if the dish has been put in shopping check_shopping_cart
                var order = Shopping_cart.findOne({"product_id":this._id, 'buyer_id':foodie_id});
                var total_price_per_dish = 0;
    
                if (order) {
                    var order_id = order._id;
                    quantity = menu_details.min_order; /* quantity selected was disabled, so the quantity adds to the shopping cart is the min order set from the menu */
                    total_price_per_dish = parseInt(menu_price) * quantity
                    Meteor.call('shopping_cart.update',
                        order_id,
                        quantity,
                        total_price_per_dish,
                        function(err) {
                            if (err) Materialize.toast('Oops! Error when update your shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                            util.hide_loading_progress();
                        }
                    )
                } else {
                    quantity = menu_details.min_order; /* quantity selected was disabled, so the quantity adds to the shopping cart is the min order set from the menu */
                    Meteor.call('shopping_cart.insert',
                        foodie_id,
                        homecook_id,
                        foodie_name,
                        homecook_name,
                        address,
                        serving_option,
                        ready_time,
                        menu_id,
                        menu_name,
                        quantity,
                        menu_price,
                        function(err) {
                            if (err) {
                                Materialize.toast('Oops! Error when add into shopping cart. Please try again. ' + err.message, 4000, "rounded bp-green");
                                util.hide_loading_progress();
                            } else {
                                Materialize.toast(menu_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded bp-green");
                                $('#dish-modal').modal('close');
                                Session.set('modal', false);
                                util.hide_loading_progress();
                            }
                        }
                    );
                }
            }
        }
    }

    render() {
        return (
            <div className="modal" id="dish-modal">
                <DishCarousel order={ this.order } />
            </div>
        );
    }
}

/**
 * Check if user press Esc key to close popup, set session modal to false
 * 
 */
$(document).on('keydown', function(e) {
    if (e.keyCode === 27) {
        Session.set('modal', false);
    }
});