import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import ChefAvatar from './chef_avatar';
import Like from './like_button';

import { navbar_find_by } from './../../../imports/functions/find_by';

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
    Session.set('selectedDish', item);
    Session.set('selectedItem', 'dish');
    Session.set('modal', true);
    this.props.popup(item);
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
        <div key={index} className="col xl2 l2 m3 s6 modal-trigger dish-wrapper" onClick={ () => this.handleClick(item) }>
          <div className="images-thumbnail" style =  {{ background: '#ccc' }}>
            <Like type="dish" id={item._id} />
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
            ""
          </div>
          <div className="row no-margin">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              <span className="order-count">{ item.order_count }</span>
            </div>
          </div>
          <div className="row">
            <div className="col l12 m12 dish-price no-padding text-left">$ { item.dish_selling_price }</div>
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
          <div className="col s6 m6 l6 text-right no-padding">
            <a>{ this.props.seemore }</a>
          </div>
        </div>

        {/* list items */}
        <div className = "section">
          <div className="row">
            {
              (this.props.listLoading)
              ?
                <span>...loading</span>
              :
                this.renderList()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theDishes');
  var dish_results = [];
  if (Session.get('advanced_search_results')) {
    for (var i = 0; i < Session.get('advanced_search_results').length; i++) {
      for (var j = 0; j < Session.get('advanced_search_results')[i].Dish.length; j++) {
        dish_results.push(Session.get('advanced_search_results')[i].Dish[j]);
      }
    }
  }
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      dishes: dish_results,
  };
})(DishSearchList);
