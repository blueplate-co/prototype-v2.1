import React, { Component } from 'react';
import { Session } from 'meteor/session';

import Rating from './rating/rating';
import ProgressiveImages from './progressive_image';
import Like from './like_button';
import ChefAvatar from './chef_avatar';

// App component - represents the whole app
export default class DishCarousel extends Component {

  constructor(props) {
    super(props);
    this.state = {
        item: {},
        qty: 1,
        ingredients: [],
        menus: [],
        isMobile: false,
    }
  }

  closeModal = () => {
    Session.set('modal', false);
    Session.set('selectedItem', '');
    $('#dish-modal').modal('close');
    $('.modal-overlay').remove();
  }

/*
  decreaseQty = () => {
    if (this.state.qty > 1) {
        this.setState({
            qty: this.state.qty - 1
        },() => {
            this.props.qty(this.state.qty);
        })
    }
  }

  increaseQty = () => {
    this.setState({
        qty: this.state.qty + 1
    },() => {
        this.props.qty(this.state.qty);
    })
  }
*/

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

    if (Session.get('selectedMenu')) {
      if (Session.get('selectedMenu').online_status) {
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
        if (Session.get('selectedItem') == 'menu') {
            let menu = [];
            Session.get('selectedMenu').dishes_id.map((item, index) => {
                let dish = Dishes.find({ _id: item }).fetch();
                menu.push(dish);
            })
            this.setState({
                menus: menu
            },() => {
                setTimeout(() => {
                    $('.dish-carousel').slick({
                        slickSetOption: true
                    });
                    $('.dish-carousel').slick('reinit');
                }, 1000);
                $('#dish-modal').modal('open');
            })
        }
    }
  }

  renderServingOptions = (option) => {
    if (option) {
      return option.map((item, index) => {
        return (
          <span key = {index}>{item}, </span>
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
    } else {
        return (
            <span className="row none no-padding">No Allergies</span>
        )
    }
  }

  renderDietaryList = (dietary) => {
    if (dietary) {
        return dietary.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Dietary</span>
        )
    }
  }

  renderTagList = (tag) => {
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

  renderDish = (item, ingredients, index) => {
    const alignMobile = this.state.isMobile ? '' : 'right';
    return (
        <div className="row no-margin" key={index}>
            <div className="col l4 m12 s12 dish-preview-banner no-padding">
                <Like type="menu" id={ Session.get('selectedMenu')._id } />
                <ProgressiveImages
                    large={ item.meta.large }
                    small={ item.meta.small }
                />
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
                        :   <button className="btn" onClick={ this.props.order } >Order</button>
                    }
                </div>
              </div>
                <div className="row dish-preview-navigation">
                    <div className="row headline">
                        <div className="col l1 s2 m2 no-padding float-left" style={{ position: 'relative' }}>
                            <ChefAvatar userId={Session.get('selectedMenu').user_id} />
                        </div>
                        <div className="col l8 s10 m6">
                            <h1 className="title">{ Session.get('selectedMenu').menu_name }</h1>
                        </div>
                        <div className="col l3 s12 m4 hide-on-small-only">
                            {
                                (this.state.status == false) ?
                                    <button disabled className="btn">Offline</button>
                                :   <button className="btn" onClick={ this.props.order } >Order</button>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l8 s10 m8 offset-l1 offset-m2 offset-s2">
                            <Rating rating={  Session.get('selectedMenu').average_rating } />
                            {
                                (parseInt(Session.get('selectedMenu').order_count) >= 10)
                                ? <span className="order-count">{ Session.get('selectedMenu').order_count }</span>
                                : ''
                            }
                            <p className="price">$ { Session.get('selectedMenu').menu_selling_price }</p>
                            {/**<span className="qty">
                                <span className="decreaseQty" onClick={ this.decreaseQty } >-</span>
                                <span className="number">{ this.state.qty }</span>
                                <span className="increaseQty" onClick={ this.increaseQty }>+</span>
                            </span>**/}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l12 s12 m12">
                            <span className="description">{ Session.get('selectedMenu').menu_description }</span>
                        </div>
                    </div>
                    <div className = "row">
                      <div className = "col l12 s12 m12">
                        <span><b>Serving Options: </b>{this.renderServingOptions(Session.get('selectedMenu').serving_option)}</span>
                      </div>
                    </div>
                    <div className = "row">
                      <div className = "col l12 s12 m12">
                        <span><b>Advanced Order: </b>{!Session.get('selectedMenu').lead_days || Session.get('selectedMenu').lead_days === "0" ? " " :Session.get('selectedMenu').lead_days + "days "}
                            {!Session.get('selectedMenu').lead_hours || Session.get('selectedMenu').lead_hours === "0" ? " " :Session.get('selectedMenu').lead_hours + "hours "}
                        </span>
                      </div>
                    </div>
                    <div className = "row">
                      <div className = "col l12 s12 m12">
                        <span><b>Minimum order: </b>{Session.get('selectedMenu').min_order}</span>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col l12 m12 s12">
                            <h6>Tags</h6>
                            {
                                (Session.get('selectedMenu').menu_tags.length == 0)
                                ?
                                    <span>No Tags available</span>
                                :
                                    <ul className="dish-preview-list-tags">
                                        { this.renderTagList(Session.get('selectedMenu').menu_tags) }
                                    </ul>
                            }
                        </div>
                    </div>
                    <div className ="row">
                      <div className = "col l12 m12 s12">
                        <span><b>Dish details</b> - Swipe left / right to view more details about the dishes</span>
                      </div>
                    </div>
                </div>
                <div className="row dish-preview-information no-padding">
                    <div className="row">
                        <div className="col l12 s12 m12">
                            <h6>{ item.dish_name }</h6>
                        </div>
                    </div>
                    <div className="col l6 m6 s12">
                        <div className="row dish-preview-ingredients no-padding">
                            <div className="col l12 m12 s12 no-padding">
                                <h6>Ingredients</h6>
                                {
                                    (ingredients.length == 0)
                                    ?
                                        <span>No ingredients details</span>
                                    :
                                        <ul className="dish-preview-list-ingredient">
                                            { this.renderIngredients(ingredients) }
                                        </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col l6 m6 s12">
                      <div className = {alignMobile}>
                        <div className="row dish-preview-ingredients no-padding">
                            <div className="col l12 m12 s12 no-padding">
                                <h6>Allergies &amp; Dietary preference </h6>
                                {
                                    (ingredients.length == 0)
                                    ?
                                        <span>No allergies and dietary details</span>
                                    :
                                        <ul className="dish-preview-list-allergies">
                                            { this.renderAllergiesList(item.allergy_tags) }
                                            { this.renderDietaryList(item.dietary_tags) }
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
        <div className="dish-carousel">
            {
                this.state.menus.map((item, index) => {
                    let ingredients = Ingredients.find({ user_id: item[0].user_id, dish_name: item[0].dish_name }).fetch();
                    return (
                        this.renderDish(item[0], ingredients, index)
                    )
                })
            }
        </div>
    );
  }
}
