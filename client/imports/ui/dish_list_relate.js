import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Rating from './rating';
import ProgressiveImages from './progressive_image';
import ChefAvatar from './chef_avatar';
import Like from './like_button';
import DishStatus from './dish_status';

import { navbar_find_by } from '../../../imports/functions/find_by';

// App component - represents the whole app
export class DishListRelate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
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
        <a key={index} target="_blank" className="col xl4 l4 m6 s12 modal-trigger dish-relate-wrapper" href={ "/dish/" + item._id }>
          <div className="relate-images-thumbnail" style =  {{ background: '#ccc' }}>
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
          </div>
          {
            (!isNaN(item.dish_selling_price))
            ? (
              <div className="row no-margin">
                <div className="col l6 m6 s6 dish-price no-padding text-left">$ { item.dish_selling_price }</div>
                <div className="col l6 m6 s6 no-padding">
                  <DishStatus status={item.online_status} />
                </div>
              </div>
            ) : ('')
          }
          <div className="row">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-dish-count">{ item.order_count }</span>
                : ''
              }
            </div>
          </div>
        </a>
      )
    })
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* list items */}
        <div className="row">
          {
              this.renderList()
          }
        </div>
        <a className="col s12 m12 l12 text-right dish-relate-see-more" href={"/kitchen/" + this.props.kitchen_id}>... see more</a>
      </div>
    );
  }
}

export default withTracker(props => {
  var user_id = Session.get('user_dish_id');
  var dish_id_relate = Session.get('dish_id_relate');

  return {
    dishes: Dishes.find({ _id: { $not: dish_id_relate}, user_id: user_id, deleted: false},{sort: {average_rating: -1, online_status: -1},  limit : 3}).fetch(),
  };
})(DishListRelate);
