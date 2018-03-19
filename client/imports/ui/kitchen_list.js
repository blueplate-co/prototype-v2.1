import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import ChefAvatar from './chef_avatar';

import { navbar_find_by } from './../../../imports/functions/find_by';

// App component - represents the whole app
class KitchenList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      loading: false
    }
  }

  handleClick = (item) => {
    // this.props.popup(item);
  }

  renderList = () => {
    return this.props.kitchen.map((item, index) => {
      return (
        <div key={index} className="col xl4 l4 m6 s12 modal-trigger" onClick={ () => this.handleClick(item) }>
          <div className="kitchen-images-thumbnail">
            <ProgressiveImages
              large={ item.bannerKitchenImg.origin }
              small={ item.bannerKitchenImg.small }
            />
          </div>
          <div className="row no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.kitchen_name }</h5>
            <ChefAvatar userId={item.user_id} />
          </div>
          <div className="row no-margin">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              <span className="order-count">{ item.order_count }</span>
            </div>
          </div>

        </div>
      )
    })
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding'>
        {/* title */}
        <div className="row">
          <div className="col s6 m6 l6">
            <h5>{ this.props.title }</h5>
          </div>
          <div className="col s6 m6 l6 text-right">
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
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      kitchen: kitchen_info
  };
})(KitchenList);