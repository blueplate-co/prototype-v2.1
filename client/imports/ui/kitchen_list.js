import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import KitchenCard from './kitchen_card';

import { navbar_find_by } from './../../../imports/functions/find_by';

// App component - represents the whole app
class KitchenList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  renderList = () => {
    return this.props.kitchen.map((item, index) => {
      if (Dishes.find({ user_id: item.user_id, deleted: false }).fetch().length > 0) {
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
      }
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
            <a href="/see_all/kitchen" >{ this.props.seemore }</a>
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
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      kitchen: kitchen_info
  };
})(KitchenList);
