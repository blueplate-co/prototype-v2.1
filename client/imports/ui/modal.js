import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import DishCarousel from './dish_carousel';

// App component - represents the whole app
export default class DishModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: {},
            qty: 1,
            ingredients: [],
            menu: []
        }
    }

    closeModal = () => {
        $('#dish-modal').modal('close');
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

    componentWillReceiveProps = () => {
        this.setState({
            qty: 1
        })
        
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
        }
    }

    renderAllergiesList = (allergies) => {
        if (allergies) {
            return allergies.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderDietaryList = (dietary) => {
        if (dietary) {
            return dietary.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderCuisinesTagList = (cuisines) => {
        if (cuisines) {
            return cuisines.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderProteinsTagList = (proteins) => {
        if (proteins) {
            return proteins.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderCaterogiesTagList = (categories) => {
        if (categories) {
            return categories.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderCookingMethodsTagList = (cooking_methods) => {
        if (cooking_methods) {
            return cooking_methods.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderTasteTagList = (tastes) => {
        if (tastes) {
            return tastes.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderTexturesTagList = (textures) => {
        if (textures) {
            return textures.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderVegetablesTagList = (vegetables) => {
        if (vegetables) {
            return vegetables.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderCondimentsTagList = (condiments) => {
        if (condiments) {
            return condiments.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderServingTemperatureTagList = (serving_temperature) => {
        if (serving_temperature) {
            return serving_temperature.map((item, index) => {
                return(
                    <li index={index}>{ item }</li>
                )
            })
        }
    }

    renderDish = () => {
        return (
            <div className="row no-margin">
                <div className="col l4 m4 s12 dish-preview-banner no-padding" style={{backgroundImage: "url(" + this.state.origin + ")"}}>
                </div>

                <div className="col l8 m8 s12 dish-preview-content">
                    <span className="fa fa-times close-modal" onClick={ this.closeModal }></span>
                    <div className="row dish-preview-navigation">
                        <div className="col l12 s12 m12">
                            <h1 className="title">{ this.state.item.dish_name }</h1>
                        </div>
                        <div className="row">
                            <div className="col l8 s8 m8">
                                <span className="price">$ { this.state.item.dish_selling_price }</span>
                                <span className="qty">
                                    <span className="decreaseQty" onClick={ this.decreaseQty } >-</span>
                                    <span className="number">{ this.state.qty }</span>
                                    <span className="increaseQty" onClick={ this.increaseQty }>+</span>
                                </span>
                                <Rating rating={ this.state.item.average_rating } />
                                <span className="order-count">{ this.state.item.order_count }</span>
                            </div>
                            <div className="col l4 s4 m4">
                                <button className="btn">Order</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col l12 s12 m12">
                                <span className="descrition">"{ this.state.item.dish_description }"</span>
                            </div>
                        </div>
                    </div>
                    <div className="row dish-preview-information no-padding">
                        <div className="col l6 m6 s6">
                            <div className="row dish-preview-ingredients no-padding">
                                <div className="col l12 m12 s12 no-padding">
                                    <h5>Ingredients</h5>
                                    {
                                        (this.state.ingredients.length == 0)
                                        ?
                                            <span>...loading</span>
                                        :
                                            <ul className="dish-preview-list-ingredient">
                                                { this.renderIngredients(this.state.ingredients) }
                                            </ul>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col l6 m6 s6">
                            <div className="row dish-preview-ingredients no-padding">
                                <div className="col l12 m12 s12 no-padding">
                                    <h5>Allergies &amp; Dietary preference </h5>
                                    {
                                        (this.state.ingredients.length == 0)
                                        ?
                                            <span>...loading</span>
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
                                            <span>...loading</span>
                                        :
                                            <ul className="dish-preview-list-tags">
                                                { this.renderCuisinesTagList(this.state.item.cuisines_tags) }
                                                { this.renderProteinsTagList(this.state.item.proteins_tags) }
                                                { this.renderCaterogiesTagList(this.state.item.categories_tags) }
                                                { this.renderCookingMethodsTagList(this.state.item.cooking_methods_tags) }
                                                { this.renderTasteTagList(this.state.item.tastes_tags) }
                                                { this.renderTexturesTagList(this.state.item.textures_tags) }
                                                { this.renderVegetablesTagList(this.state.item.vegetables_tags) }
                                                { this.renderCondimentsTagList(this.state.item.condiments_tags) }
                                                { this.renderServingTemperatureTagList(this.state.item.serving_temperature_tags) }
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
            <div className="modal" id="dish-modal">
                {
                    (Session.get('selectedItem') == 'dish')
                    ?
                        this.renderDish()
                    :
                        <DishCarousel />
                }
            </div>
        );
    }
}