import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Like from './like_button';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';

// App component - represents the whole app
class DishSearchList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      loading: false
    }
  }

  handleClick = (item) => {
    Meteor.call('dish.view', item._id, item.user_id);;
    // Session.set('selectedDish', item);
    // Session.set('selectedItem', 'dish');
    // Session.set('modal', true);
    // this.props.popup(item);
    FlowRouter.go("/dish/" + item._id);
  }

  renderList = () => {
    if (this.props.dishes.length == 0) {
      return <p>Has no dishes to be displayed</p>
    }
    let hasThumbnail;
    return this.props.dishes.map((item, index) => {
      if (item.meta) {
        hasThumbnail = true;
      } else {
        hasThumbnail = false;
      }
      return (
        <div key={index} className="col xl4 l4 m6 s12 dish-wrapper" onClick={ () => this.handleClick(item) }>
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
                  large={ item.meta.large }
                  small={ item.meta.small }
                />
              : ""
            }
          </div>
          <div className="row no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.dish_name }</h5>
          </div>
          <div className="row no-margin">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-count">{ item.order_count }</span>
                : ''
              }
            </div>
          </div>
          {
            (!isNaN(item.dish_selling_price))
            ? (
              (checking_promotion_dish(item._id).length > 0) ?
                <div className="row">
                  <div className="col l3 m3 dish-price no-padding text-left">$ { item.dish_selling_price * get_amount_promotion(item._id) }</div>
                  <div className="col l9 m9 dish-old-price no-padding text-left">$ { item.dish_selling_price }</div>
                </div>
              : (
                <div className="row">
                  <div className="col l6 m6 dish-price no-padding text-left">$ { item.dish_selling_price }</div>
                </div>
              )
            ) : ('')
          }


        </div>
      )
    })
  }

  renderResultTitle = () => {
    if (Session.get('search_nearby')) {
      if (Session.get('search_result').dish.length > 20) {
        let overNumber = Session.get('search_result').dish.length - (Session.get('search_result').dish.length % 5);
        return 'Over ' + overNumber + '+ results around you';
      } else {
        return Session.get('search_result').dish.length + ' dishes results around you';
      }
    }
    if (Session.get('search_result')) {
      let keywork = $('#searchQuery').val();
      if (Session.get('search_result').dish.length > 20) {
        let overNumber = Session.get('search_result').dish.length - (Session.get('search_result').dish.length % 5);
        return 'Over ' + overNumber + '+ results for ' + '"'+ keywork +'"';
      } else {
        return Session.get('search_result').dish.length + ' dishes results for ' + '"'+ keywork +'"';
      }
    } else {
      return 'Dishes';
    }
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* title */}
        <div className="row">
          <div className="col s12 m12 l6 no-padding">
            <h5>{ this.renderResultTitle() }</h5>
          </div>
          <div className="col s6 m6 l6 text-right no-padding">
            <a>{ this.props.seemore }</a>
          </div>
        </div>

        {/* list items */}
          <div className="row">
            {
              (this.props.listLoading)
              ?
                <span>Your favorite dishes is searching...</span>
              :
                this.renderList()
            }
          </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theDishes');
  var dish_results = [];
  if (Session.get('search_result')) {
    for (var i = 0; i < Session.get('search_result').dish.length; i++) {
        dish_results.push(Session.get('search_result').dish[i]);
    }
  }
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      dishes: dish_results,
  };
})(DishSearchList);
