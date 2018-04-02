import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
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
        menus: []
    }
  }

  closeModal = () => {
    $('#dish-modal').modal('close');
  }

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

  componentWillReceiveProps = () => {
    
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

  renderCuisinesTagList = (cuisines) => {
    if (cuisines) {
        return cuisines.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Cuisines Tags</span>
        )
    }
  }

  renderProteinsTagList = (proteins) => {
    if (proteins) {
        return proteins.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Proteins Tags</span>
        )
    }
  }

  renderCaterogiesTagList = (categories) => {
    if (categories) {
        return categories.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Caterogies Tag</span>
        )
    }
  }

  renderCookingMethodsTagList = (cooking_methods) => {
    if (cooking_methods) {
        return cooking_methods.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    }  else {
        return (
            <span className="row none no-padding">No Cooking Methods Tags</span>
        )
    }
  }

  renderTasteTagList = (tastes) => {
    if (tastes) {
        return tastes.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Taste Tags</span>
        )
    }
  }

  renderTexturesTagList = (textures) => {
    if (textures) {
        return textures.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Textures Tag</span>
        )
    }
  }

  renderVegetablesTagList = (vegetables) => {
    if (vegetables) {
        return vegetables.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Vegetables Tags</span>
        )
    }
  }

  renderCondimentsTagList = (condiments) => {
    if (condiments) {
        return condiments.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Condiments Tags</span>
        )
    }
  }

  renderServingTemperatureTagList = (serving_temperature) => {
    if (serving_temperature) {
        return serving_temperature.map((item, index) => {
            return(
                <li key={index}>{ item }</li>
            )
        })
    } else {
        return (
            <span className="row none no-padding">No Serving Temperatures Tags</span>
        )
    }
  }

  renderDish = (item, ingredients, index) => {
    return (
        <div className="row no-margin" key={index}>
            <div className="col l4 m4 s12 dish-preview-banner no-padding">
                <Like type="menu" id={ Session.get('selectedMenu')._id } />
                <ProgressiveImages
                    large={ item.meta.large }
                    small={ item.meta.small }
                />
            </div>

            <div className="col l8 m8 s12 dish-preview-content">
                <span className="fa fa-times close-modal" onClick={ this.closeModal }></span>
                <div className="row dish-preview-navigation">
                    <div className="row">
                        <div className="col l1 s2 m2" style={{ position: 'relative' }}>
                            <ChefAvatar userId={Session.get('selectedMenu').user_id} />
                        </div>
                        <div className="col l10 s10 m10">
                            <h1 className="title">{ Session.get('selectedMenu').menu_name }</h1>
                        </div>
                        <div className="col l4 s12 m4 m-visible">
                            <button className="btn" onClick={ this.props.order } >Order</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l8 s12 m8">
                            <span className="price">$ { Session.get('selectedMenu').menu_selling_price }</span>
                            <span className="qty">
                                <span className="decreaseQty" onClick={ this.decreaseQty } >-</span>
                                <span className="number">{ this.state.qty }</span>
                                <span className="increaseQty" onClick={ this.increaseQty }>+</span>
                            </span>
                            <Rating rating={ item.average_rating } />
                            <span className="order-count">{ item.order_count }</span>
                        </div>
                        <div className="col l4 s4 m4 m-hidden">
                            <button className="btn" onClick={ this.props.order }>Order</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l12 s12 m12">
                            <span className="descrition">{ Session.get('selectedMenu').menu_description }</span>
                        </div>
                    </div>
                </div>
                <div className="row dish-preview-information no-padding">
                    <div className="row">
                        <div className="col l12 s12 m12">
                            <span className="dish_name">{ item.dish_name }</span>
                        </div>
                    </div>
                    <div className="col l6 m6 s12">
                        <div className="row dish-preview-ingredients no-padding">
                            <div className="col l12 m12 s12 no-padding">
                                <h5>Ingredients</h5>
                                {
                                    (ingredients.length == 0)
                                    ?
                                        <span>...loading</span>
                                    :
                                        <ul className="dish-preview-list-ingredient">
                                            { this.renderIngredients(ingredients) }
                                        </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col l6 m6 s12">
                        <div className="row dish-preview-ingredients no-padding">
                            <div className="col l12 m12 s12 no-padding">
                                <h5>Allergies &amp; Dietary preference </h5>
                                {
                                    (ingredients.length == 0)
                                    ?
                                        <span>...loading</span>
                                    :
                                        <ul className="dish-preview-list-allergies">
                                            { this.renderAllergiesList(item.allergy_tags) }
                                            { this.renderDietaryList(item.dietary_tags) }
                                        </ul>
                                }
                            </div>
                        </div>
                        <div className="row dish-preview-tags no-padding">
                            <div className="col l12 m12 s12 no-padding">
                                <h5>Tags </h5>
                                {
                                    (ingredients.length == 0)
                                    ?
                                        <span>...loading</span>
                                    :
                                        <ul className="dish-preview-list-tags">
                                            { this.renderCuisinesTagList(item.cuisines_tags) }
                                            { this.renderProteinsTagList(item.proteins_tags) }
                                            { this.renderCaterogiesTagList(item.categories_tags) }
                                            { this.renderCookingMethodsTagList(item.cooking_methods_tags) }
                                            { this.renderTasteTagList(item.tastes_tags) }
                                            { this.renderTexturesTagList(item.textures_tags) }
                                            { this.renderVegetablesTagList(item.vegetables_tags) }
                                            { this.renderCondimentsTagList(item.condiments_tags) }
                                            { this.renderServingTemperatureTagList(item.serving_temperature_tags) }
                                        </ul>
                                }
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