import React, { Component } from 'react';
import ProgressiveImages from './progressive_image';

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishDetails: JSON.parse(localStorage.getItem("localCart")),
            array_chef: [],
            chefInfor: {
                chef_id: '',
                chef_name: '',
                chef_image_large: '',
                chef_image_small: '',
                arr_dish_infor: []
            }
        };
    };

    componentDidMount() {
        if (this.state.dishDetails != null) {
            this.state.dishDetails.map( (item, idx) => {
                var chef_infor_dish = {
                    chef_id: '',
                    chef_name: '',
                    chef_image_large: '',
                    chef_image_small: '',
                    arr_dish_infor: []
                };
                
                var chitken = Kitchen_details.findOne({ user_id: item.seller_id});
                if (chitken) {
                    chef_infor_dish.chef_id = chitken._id;
                    chef_infor_dish.chef_name = chitken.chef_name;

                    if (chitken.profileImg) {
                        chef_infor_dish.chef_image_large = chitken.profileImg.large;
                        chef_infor_dish.chef_image_small = chitken.profileImg.small;
                    }
                }

                item.arr_dishs.map( (dish_infor, idx_dish) => {
                    var inforDish = {
                        dish_id :'',
                        dish_name: '',
                        service_option: [],
                        price: 0.0,
                        days: 0,
                        hours: 0,
                        mins: 0,
                        quantity: 0
                    };
                    var dish_detail = Dishes.findOne({ _id: dish_infor.dish_id});
                    if (dish_detail) {

                        inforDish.dish_id = dish_detail._id;
                        inforDish.dish_name = dish_detail.dish_name;
                        inforDish.service_option = dish_detail.serving_option;
                        inforDish.price = dish_detail.dish_selling_price;
                        inforDish.days = dish_detail.days;
                        inforDish.hours = dish_detail.hours;
                        inforDish.mins = dish_detail.mins;
                        inforDish.quantity = dish_infor.quantity
                        
                        chef_infor_dish.arr_dish_infor.push(inforDish);
                    }
                });
                this.state.array_chef.push(chef_infor_dish);
            });
            console.log(this.state.array_chef);
        }
    }

    renderProgressNav() {
        return (
            <div className="row shopping-progress-nav">
                <ul className="col s12 m4 l4 bp-blue-text">
                    <li className="cart-progress-component">
                        <span className="cart-progress-step-number">1</span> 
                        <span className="cart-progress-step-text">Order Summary</span>
                    </li>
                </ul>

                <ul className="col s12 m4 l4 bp-blue-text">
                    <li>
                        <span className="cart-progress-step-number">2</span> 
                        <span className="cart-progress-step-text">Payment</span>
                    </li>
                </ul>

                <ul className="col s12 m4 l4 bp-blue-text">
                    <li>
                        <span className="cart-progress-step-number">3</span> 
                        <span className="cart-progress-step-text">Manage order</span>
                    </li>
                </ul>
            </div>
        );
    };

    renderServiceTimeAddress() {

    };

    render() {
        // console.log(this.state.dishDetails);
        return (
            <div className="container">
                {this.renderProgressNav()}
                <div className="cart-detail-summary">
                    <div className="row cart-kitchen-detail">
                        <div id="cart-kitchen-image" className="text-left">
                            <ProgressiveImages
                                large={ util.getDefaultChefImage() }
                                small={ util.getDefaultChefImage() }
                            />
                        </div>

                        <div id="cart-total-kitchen" className="text-right">
                            <span id="cart-kitchen-total">Total:</span>
                            <span className="bp-blue-text" id="cart-kitchen-price">HK$ 202</span>
                        </div>
                    </div>

                    <div className="row cart-dish-detail">
                        <h5>dish</h5>
                    </div>
                </div>
            </div>
        );
    }
}