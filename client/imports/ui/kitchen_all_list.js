import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import KitchenCard from './kitchen_card';

import { navbar_find_by } from './../../../imports/functions/find_by';
import BouncingLoader from './bouncing_loader/bouncing_loader.js';

// App component - represents the whole app
class KitchenAllList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  renderList = () => {
    if (this.props.kitchen.length == 0) {
      return <p>Has no kitchen to display</p>
    }
    return this.props.kitchen.map((item, index) => {
      return (
        <div key = {index}>
          <KitchenCard
            bannerProfileImg = {item.bannerProfileImg}
            kitchenId = {item._id}
            userId = {item.user_id}
            kitchenName = {item.kitchen_name}
            chefName = {item.chef_name}
            averageRating = {item.average_rating}
            orderCount = {item.order_count}
          />
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
                <BouncingLoader />
              :
                this.renderList()
            }
          </div>
      </div>
    );
  }
}

export default withTracker(props => {
  // const handle = Meteor.subscribe('theDishes');
  navbar_find_by("Kitchen_details");
  var kitchen_info = Session.get('searched_result');
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      kitchen: kitchen_info
  };
})(KitchenAllList);
