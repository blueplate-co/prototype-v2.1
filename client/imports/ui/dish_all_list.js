import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import Like from './like_button';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { navbar_find_by } from './../../../imports/functions/find_by';
import DishStatus from './dish_status';

// App component - represents the whole app
class DishAllList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  handleOnViewDish(item) {
    BlazeLayout.reset();
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
        <div key={index} className="col xl2 l2 m3 s6 modal-trigger dish-wrapper" onClick={() => this.handleOnViewDish(item)}>
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

          </div>
          {
            (!isNaN(item.dish_selling_price))
            ? (
              <div className="row no-margin">
                <div className="col s12 l6 m6 dish-price no-padding text-left">$ { item.dish_selling_price }</div>
                <div className="col s12 l6 m6 dish-price no-padding text-right">
                  <DishStatus status={item.online_status}/>
                </div>
              </div>
            ) : ('')
          }

          <div className="row">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-count">{ item.order_count }</span>
                : ''
              }
            </div>
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
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theDishes');
  navbar_find_by("Kitchen_details");
  var kitchen_info = Session.get('searched_result');
  var kitchen_id = [];
  if (kitchen_info) {
    for (i = 0; i < kitchen_info.length; i++) {
      kitchen_id[i] = kitchen_info[i]._id;
    }
  }
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      dishes: Dishes.find({ kitchen_id: {$in: kitchen_id}, deleted: false}, {sort: {online_status: -1, createdAt: -1}}).fetch(),
  };
})(DishAllList);
