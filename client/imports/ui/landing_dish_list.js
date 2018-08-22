import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import Rating from './rating';
import ProgressiveImages from './progressive_image';

// App component - represents the whole app
class LandingDishList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
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
        <a key={index} className="col xl3 l4 m6 s12 modal-trigger dish-wrapper" href="#signup_modal">
          <div className="images-thumbnail" style =  {{ background: '#ccc' }}>
            {
              (hasThumbnail) ?
                <ProgressiveImages
                  large={ item.meta.large }
                  small={ item.meta.small }
                />
              : ""
            }
          </div>
          <div className="no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.dish_name }</h5>
          </div>
          <div className="no-margin">
            <div className="dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-count">{ item.order_count }</span>
                : ''
              }
            </div>
          </div>
          <div className="col l12 m12 dish-price no-padding text-left">$ { item.dish_selling_price }</div>

        </a>
      )
    })
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* list items */}
          {
            (this.props.listLoading)
            ?
              <span>...loading</span>
            :
              this.renderList()
          }
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('landingDishes');
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      dishes: Dishes.find({deleted: false, online_status: true},{sort: {average_rating: -1, createdAt: -1}, limit: 4 }).fetch(),
  };
})(LandingDishList);
