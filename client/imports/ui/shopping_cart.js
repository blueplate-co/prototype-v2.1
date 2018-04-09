import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ProgressiveImages from './progressive_image';
import ChefAvatar from '../ui/chef_avatar';

// Shopping cart component
class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.renderListKitchen = this.renderListKitchen.bind(this);
        this.renderKitchen = this.renderKitchen.bind(this);
    }

    // remove item in shopping cart
    removeItem(id) {

        Meteor.call('shopping_cart.remove', id);
    }

    // increaseQty of item in shopping cart
    increaseQty(id) {
        var item = Shopping_cart.find({ _id: id }).fetch()[0];
        var quantity = item.quantity + 1;
        var total_price_per_dish = quantity * item.product_price;

        Meteor.call('shopping_cart.update',
            id,
            quantity,
            total_price_per_dish,
            function (err) {
                if (err) Materialize.toast('Oops! Error when update the quantities of the dish in your shopping cart. Please try again.' + err.message.message, 4000, 'rounded bp-green');
            }
        )
    }

    // decreaseQty of item in shopping cart
    decreaseQty(id) {
        var item = Shopping_cart.find({ _id: id }).fetch()[0];
        if (item.quantity == 1) { // not allow set quantity = 0
            return true;
        }
        var quantity = item.quantity - 1;
        var total_price_per_dish = quantity * item.product_price;

        Meteor.call('shopping_cart.update',
            id,
            quantity,
            total_price_per_dish,
            function (err) {
                if (err) Materialize.toast('Oops! Error when update the quantities of the dish in your shopping cart. Please try again.' + err.message.message, 4000, 'rounded bp-green');
            }
        )
    }

    renderSingleProduct(product) {
        return product.map((item, index) => {
            var type = "dish";
            var detail = Dishes.find({ _id: item.product_id }).fetch()[0];
            if (!detail) {
                detail = Menu.find({ _id: item.product_id }).fetch()[0];
                type = "menu";
                var background = Dishes.find({ _id: detail.dishes_id[0] }).fetch()[0].meta.large;
            }
            return (
                (type == "dish") ?
                (
                    <div key={index} className="row detail-product">
                        <div className="col s1 m1 l1 xl1">
                            <div className="detail-thumbnail" style={{ backgroundImage: "url(" + detail.meta.large + ")" }} ></div>
                        </div>
                        <div className="col s11 m11 l11 xl11 product-info">
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id) }></span>
                            <span className="detail-title">{ detail.dish_name }</span>
                            <span className="detail-price">HK${ detail.dish_selling_price }</span>
                            <div className="quantity-control">
                                <span onClick={ () => this.decreaseQty(item._id) }>-</span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id) }>+</span>
                            </div>
                        </div>
                    </div>
                )   :
                (
                    <div key={index} className="row detail-product">
                        <div className="col s1 m1 l1 xl1">
                            <div className="detail-thumbnail" style={{ backgroundImage: "url(" + background + ")" }} ></div>
                        </div>
                        <div className="col s11 m11 l11 xl11 product-info">
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id) }></span>
                            <span className="detail-title">{ detail.menu_name }</span>
                            <span className="detail-price">HK${ detail.menu_selling_price }</span>
                            <div className="quantity-control">
                                <span onClick={ () => this.decreaseQty(item._id) }>-</span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id) }>+</span>
                            </div>
                        </div>
                    </div>
                )
            )
        });
    }

    renderKitchen(seller_id, index) {
        var product = Shopping_cart.find({ seller_id: seller_id }).fetch();
        var sellerName = product[0].seller_name;
        var subtotal = 0;
        for (var i = 0; i < product.length; i++) {
            subtotal += parseInt(product[i].total_price_per_dish);
        }
        return (
            <div className="row" key={index}>
                <div className="row kitchen-name">
                    { sellerName }'s kitchen
                    <ChefAvatar userId={seller_id} />
                </div>
                { this.renderSingleProduct(product) }
                <div className="row subtotal">
                    <div className="col s4 text-left">subtotal</div>
                    <div className="col s8 text-right">HK${ subtotal }</div>
                </div>
            </div>
        )
    }

    renderListKitchen() {
        //- get unique seller_id
        let unique = [...new Set(this.props.shoppingCart.map(item => item.seller_id))];
        if (unique.length > 0) {
            return (
                unique.map((item, index) => {
                    return this.renderKitchen(item, index);
                })
            )
        } else {
            return <h5>Shopping cart is empty</h5>
        }
    }

    render() {
        var total = 0;
        for (var i = 0; i < this.props.shoppingCart.length; i++ ) {
            total += parseInt(this.props.shoppingCart[i].total_price_per_dish);
        }
        return (
            <div className="container">
                <h3>Order summary</h3>
                {
                    (this.props.listLoading) ?
                        <span>Loading...</span>
                    :    
                        this.renderListKitchen()
                }
                <div className="row total">
                    <div className="col s4 text-left">Total</div>
                    <div className="col s8 text-right">HK${ total }</div>
                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    const handle = Meteor.subscribe('getUserShoppingCart');
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
    };
})(ShoppingCart);