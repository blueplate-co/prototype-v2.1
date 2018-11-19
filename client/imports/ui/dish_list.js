import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Rating from './rating/rating';
import ProgressiveImages from './progressive_image';
import Like from './like_button';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';
import BouncingLoader from './bouncing_loader/bouncing_loader.js';

// App component - represents the whole app
export default class DishList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dishes: []
    }
  }

  handleOnViewDish = (dishId) => {
    BlazeLayout.reset();
    FlowRouter.go("/dish/" + dishId);
  }

  componentDidMount = () => {
    var kitchen_id = '';
    if (FlowRouter.getParam('homecook_id')) {
      kitchen_id = FlowRouter.getParam('homecook_id');
      Meteor.call('dish.getDishListShowroom', kitchen_id, (err, res) => {
        this.setState({
          dishes: res,
          loading: false
        })
      });
    } else {
      Meteor.call('dish.getDishListShowroom', kitchen_id, (err, res) => {
        this.setState({
          dishes: res,
          loading: false
        })
      });
    }
  }

  renderList = () => {
    if (this.state.dishes.length == 0) {
      return <p>No dish to display</p>
    }
    let hasThumbnail;
    return this.state.dishes.map((item, index) => {
      if (item.meta) {
        hasThumbnail = true;
      } else {
        hasThumbnail = false;
      }
      return (
        <div key={index} className="col xl3 l4 m6 s12 dish-wrapper" onClick={() => this.handleOnViewDish(item._id)}>
          <div className="images-thumbnail" style =  {{ background: '#ccc' }}>
            <Like type="dish" id={item._id} />
            {
              (checking_promotion_dish(item._id).length > 0) ?
                <span className="promotion_tag">{ '- ' + get_amount_promotion(item._id) * 100 + ' %' }</span>
              : ''
            }
            {
              (hasThumbnail) ?
                <ProgressiveImages
                  large={ item.meta.medium }
                  small={ item.meta.small }
                />
              : ""
            }
          </div>
          <div className="row no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.dish_name }</h5>
          </div>
          <div className="row">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-count">{ item.order_count }</span>
                : ''
              }
            </div>
            {
              (!isNaN(item.dish_selling_price))
              ? (
                (checking_promotion_dish(item._id).length > 0) ?
                  <ul className="promotion-price-list">
                    <li className="dish-price no-padding">$ { item.dish_selling_price * get_amount_promotion(item._id) }</li>
                    <li className="dish-old-price no-padding">$ { item.dish_selling_price }</li>
                  </ul>
                : (
                  <div className="row">
                    <div className="col l6 m6 dish-price no-padding text-left">$ { parseFloat(item.dish_selling_price).toFixed(2) }</div>
                  </div>
                )
              ) : ('')
            }
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* title */}
        <div className="row">
          <div className="col s6 m6 l6 no-padding">
            <h5>{ this.props.title }</h5>
          </div>
          <div className="col s6 m6 l6 text-right no-padding seeall">
            <a href="/see_all/dish">{ this.props.seemore }</a>
          </div>
        </div>

        {/* list items */}
        <div className="row">
          {
            (this.state.loading)
            ?
              <BouncingLoader />
            :
              this.renderList()
          }
        </div>
      </div>
    );
  }
}
