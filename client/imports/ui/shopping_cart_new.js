import React, { Component } from 'react';
import ProgressiveImages from './progressive_image';
import ProgressBar from './progress_bar.js';

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
            },
            bLoadComplete: false
        };
    };

    componentDidMount = () => {
        var arr_chefs = [];
        if (this.state.dishDetails != null) {
            this.state.dishDetails.map( (item, idx) => {
                var chef_infor_dish = {
                    chef_id: '',
                    chef_name: '',
                    chef_image_large: '',
                    chef_image_small: '',
                    arr_dish_infor: []
                };
                
                // Get Chef infor
                var chitken = Kitchen_details.findOne({ user_id: item.seller_id});
                if (chitken) {
                    chef_infor_dish.chef_id = chitken._id;
                    chef_infor_dish.chef_name = chitken.chef_name;

                    if (chitken.profileImg) {
                        chef_infor_dish.chef_image_large = chitken.profileImg.large;
                        chef_infor_dish.chef_image_small = chitken.profileImg.small;
                    }
                }

                // Get dish_detail infor 
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
                arr_chefs.push(chef_infor_dish);
            });
            this.setState({ array_chef:arr_chefs }, () => {
                this.setState({ bLoadComplete: true});
                console.log(this.state.array_chef);
            });
        }
    }

    renderServiceTimeAddress() {

    };

    renderKitchenInfor() {
        return (
            this.state.array_chef.map( (itemCart, index) => {
                return (
                    <div className="cart-detail-summary">
                        <div className="row cart-kitchen-detail">
                            <div id="cart-kitchen-image" className="text-left">
                                <ProgressiveImages
                                    large={ itemCart.chef_image_large ? itemCart.chef_image_large: util.getDefaultChefImage() }
                                    small={ itemCart.chef_image_small ? itemCart.chef_image_small: util.getDefaultChefImage() }
                                />
                            </div>
                        </div>
                        {/* Render dishs for per chef */}
                        {this.renderDishDetailByKitchen(itemCart.arr_dish_infor)}
                    </div>
                )
            })
        );
    };

    renderDishDetailByKitchen = (arr_dish_infors) => {
        return (
            arr_dish_infors.map( (itemDish, index) => {
                return (
                    <div className="row">
                        <div className="col s6 m6 l6 cart-address-perdish">
                            <div className="service-option-cart">
                                <span className="service-option-icon"></span>
                                <select id="select-serving-option" className="browser-default no-border" >
                                    <option value="" disabled>How would you like to get your food?</option>
                                    { this.renderServingOption(itemDish.service_option) }
                                </select>
                            </div>
                        </div>
                        
                        <div className="col s6 m6 l6 cart-dish-detail">
                            
                        </div>
                    </div>
                )
            })
        );
    };

    renderServingOption = (serviceOption) => {
        return serviceOption.map(function(item, index){
            return <option key={index} value={item}>{item}</option>
        })
    };

    render() {
        // console.log(this.state.dishDetails);
        return (
            <div className="container shoppingcart-details">
                { (this.state.bLoadComplete) ? 
                    <span>
                        <ProgressBar step_progress="1" />
                        <div className="row">
                            <div className="col s12 m10 l9">
                                {this.renderKitchenInfor()}
                            </div>

                            <div className="col s12 m2 l3">
                                <h5>display total</h5>

                            </div>
                        </div>
                    </span>
                    :
                    <span>Loading...</span>
                }
            </div>
        );
    }
}