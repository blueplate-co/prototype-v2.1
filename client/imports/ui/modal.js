import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import DishCarousel from './dish_carousel';
import Like from './like_button';
import ChefAvatar from './chef_avatar';

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
        }
    }

    closeModal = () => {
        $('#dish-modal').modal('close');
        $('.modal-overlay').remove();
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
            qty: 1
        })

        if (this.props.dish == {}) {
            return true;
        }

        if (Session.get('selectedDish')) {
          if (Session.get('selectedDish').online_status === true) {
              this.setState({
                  status: true
              })
          } else {
              this.setState({
                  status: false
              })
          }
        }

        if (Session.get('modal')) {
            if (Session.get('selectedItem') == 'dish') {
                this.setState({
                    item: Session.get('selectedDish'),
                    origin: Session.get('selectedDish').meta.origin,
                    small: Session.get('selectedDish').meta.small
                },() => {
                    // get ingredients from database follow dish id
                    let dummyIngredients = Ingredients.find({ user_id: this.state.item.user_id, dish_name: this.state.item.dish_name }).fetch();
                    this.setState({
                        ingredients: dummyIngredients
                    },() => {
                        $('#dish-modal').modal('open');
                    });
                })
            } else {
                this.setState({
                    item: Session.get('selectedMenu'),
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

    setQty = (qty) => {
        this.setState({
            qty: qty
        })
    }

    // when click order button
    order = () => {
        if (Session.get('selectedItem') == 'dish') {
            var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
            if ((typeof foodie_details == 'undefined' || foodie_details.foodie_name == '')) {
                Materialize.toast('Please complete your foodie profile before order.', 4000, 'rounded bp-green');
            } else {
                var dish_details = Dishes.findOne({"_id": this.state.item._id});
                var foodie_id = Meteor.userId();
                var homecook_id = dish_details.user_id;
                var homecook_details = Kitchen_details.findOne({"user_id": homecook_id});
                var foodie_name = foodie_details.foodie_name;
                var homecook_name =  homecook_details.chef_name;
                var dish_id = dish_details._id;
                var dish_price = dish_details.dish_selling_price;
                var dish_name = dish_details.dish_name;
                var ready_time = dish_details.cooking_time;
                var quantity = this.state.qty;


                var serving_option = Session.get('method');
                var address = Session.get('address');
                //check if the dish has been put in shopping check_shopping_cart
                var order = Shopping_cart.findOne({"product_id": this.state._id, 'buyer_id': foodie_id});
                var total_price_per_dish = 0;
                if (order) {
                    var order_id = order._id;
                    quantity = parseInt(order.quantity) + this.state.qty;
                    total_price_per_dish = parseInt(dish_price) * quantity;
                    Meteor.call('shopping_cart.update',
                        order_id,
                        quantity,
                        total_price_per_dish,
                        function(err) {
                            if (err) Materialize.toast('Oops! Error when change your shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                        }
                    )
                } else{
                    Meteor.call('shopping_cart.insert',
                        foodie_id,
                        homecook_id,
                        foodie_name,
                        homecook_name,
                        address,
                        serving_option,
                        ready_time,
                        dish_id,
                        dish_name,
                        quantity,
                        dish_price,
                        function(err) {
                            if (err) {
                                Materialize.toast('Oops! Error when add into shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                            } else {
                                Materialize.toast(dish_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded bp-green");
                                $('#dish-modal').modal('close');
                            }
                        }
                    );
                }
            }
        } else if (Session.get('selectedItem') == 'menu') {
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

            if (this.state.qty < quantity) {
                Materialize.toast('Oops! Your quantities must not less than minium order of this menu. Please set at least ' + quantity + ' item.', 'rounded bp-green');
                return true;
            }


            var serving_option = Session.get('method')
            var address = Session.get('address')
            //check if the dish has been put in shopping check_shopping_cart
            var order = Shopping_cart.findOne({"product_id":this._id, 'buyer_id':foodie_id});
            var total_price_per_dish = 0;

            if (order) {
                var order_id = order._id;
                quantity = parseInt(order.quantity) + this.state.qty;
                total_price_per_dish = parseInt(menu_price) * quantity
                Meteor.call('shopping_cart.update',
                    order_id,
                    quantity,
                    total_price_per_dish,
                    function(err) {
                        if (err) Materialize.toast('Oops! Error when update your shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                    }
                )
            } else {
                quantity = this.state.qty;
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
                        } else {
                            Materialize.toast(menu_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded bp-green");
                            $('#dish-modal').modal('close');
                        }
                    }
                );
            }
        }
    }

    renderDish = () => {
        const alignMobile = this.state.isMobile ? '' : 'right';
        return (
            <div className="row no-margin">
                <div className="col l4 m12 s12 dish-preview-banner no-padding" style={{backgroundImage: "url(" + this.state.origin + ")"}}>
                  <div className = "like-modal-container">
                    <Like type="dish" id={this.state.item._id} />
                  </div>
                </div>

                <div className="col l8 m12 s12 dish-preview-content">
                    <a className = "btn-floating waves-effect waves-red z-depth-0 transparent black-text close-modal" onClick={ this.closeModal }>
                      <i className="material-icons black-text text-darken-1">close</i>
                    </a>
                    <div className = "row show-on-small hide-on-med-and-up">
                      <div className="col s12 ">
                          {
                              (this.state.status == false) ?
                                  <button disabled className="btn">Offline</button>
                              :   <button className="btn" onClick={ this.order } >Order</button>
                          }
                      </div>
                    </div>
                    <div className="row dish-preview-navigation">
                        <div className="row headline">
                            <div className="col l1 s2 m2 no-padding float-left" style={{ position: 'relative' }}>
                                <ChefAvatar userId={Session.get('selectedDish').user_id} />
                            </div>
                            <div className="col l8 s10 m6">
                                <h2 className="title">{ this.state.item.dish_name }</h2>
                            </div>
                            <div className="col l3 s12 m4 hide-on-small-only">
                                {
                                    (this.state.status == false) ?
                                        <button disabled className="btn">Offline</button>
                                    :   <button className="btn" onClick={ this.order } >Order</button>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col l8 s10 m8 offset-l1 offset-m2 offset-s2">
                                <Rating rating={ this.state.item.average_rating } />
                                <span className="order-count">{ this.state.item.order_count }</span>
                                <p className="price">$ { this.state.item.dish_selling_price }</p>
                                {/**<span className="qty">
                                    <span className="decreaseQty" onClick={ this.decreaseQty } >-</span>
                                    <span className="number">{ this.state.qty }</span>
                                    <span className="increaseQty" onClick={ this.increaseQty }>+</span>
                                </span>**/}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col l12 s12 m12">
                                <span className="description">{ this.state.item.dish_description }</span>
                            </div>
                        </div>
                        <div className = "row">
                          <div className = "col l12 s12 m12">
                            <span><b>Serving Options: </b>{this.renderServingOptions(this.state.item.serving_option)}</span>
                          </div>
                        </div>
                        <div className = "row">
                          <div className = "col l12 s12 m12">
                            <span><b>Advanced Order: </b>{!this.state.item.days || this.state.item.days === "0" ? " " :this.state.item.days + "days "}
                                {!this.state.item.hours || this.state.item.hours === "0" ? " " :this.state.item.hours + "hours "}
                                {!this.state.item.minutes || this.state.item.minutes === "0" ? " " :this.state.item.minutes + "minutes "}
                            </span>
                          </div>
                        </div>
                    </div>
                    <div className="row dish-preview-information no-padding">
                        <div className="col l6 m6 s12">
                            <div className="row dish-preview-ingredients no-padding">
                                <div className="col l12 m12 s12 no-padding">
                                    <h5>Ingredients</h5>
                                    {
                                        (this.state.ingredients.length == 0)
                                        ?
                                            <span>No ingredients details</span>
                                        :
                                            <ul className="dish-preview-list-ingredient">
                                                { this.renderIngredients(this.state.ingredients) }
                                            </ul>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col l6 m6 s12">
                          <div className = {alignMobile}>
                              <div className="row dish-preview-ingredients no-padding">
                                  <div className="col l12 m12 s12 no-padding">
                                      <h5>Allergies &amp; Dietary preference </h5>
                                      {
                                          (this.state.ingredients.length == 0)
                                          ?
                                              <span>No allergies and dietary details</span>
                                          :
                                              <ul className="dish-preview-list-allergies">
                                                  { this.renderAllergiesList(this.state.item.allergy_tags) }
                                                  { this.renderDietaryList(this.state.item.dietary_tags) }
                                              </ul>
                                      }
                                  </div>
                              </div>
                              <div className="row dish-preview-tags no-padding">
                                  <div className="col l12 m12 s12 no-padding">
                                      <h5>Tags </h5>
                                      {
                                          (this.state.ingredients.length == 0)
                                          ?
                                              <span>No Tags available</span>
                                          :
                                              <ul className="dish-preview-list-tags">
                                                  { this.renderDishTagList(this.state.item.dish_tags) }
                                              </ul>
                                      }
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="modal" id="dish-modal">
                {
                    (Session.get('selectedItem') == 'dish')
                    ?
                        this.renderDish()
                    :
                        <DishCarousel order={ this.order } qty={ this.setQty }/>
                }
            </div>
        );
    }
}
