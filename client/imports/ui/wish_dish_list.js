import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import Like from './like_button';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import BouncingLoader from './bouncing_loader/bouncing_loader.js';

// App component - represents the whole app
class WishDishList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      loading: false
    }
  }

  handleClick = (item) => {
    // Session.set('modal', true);
    // this.props.popup(item);
    FlowRouter.go('/dish/' + item._id)
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
            <a href="/see_all/dish">{ this.props.seemore }</a>
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
  var result = [];
  var dishID = [];
  var dishLike = DishesLikes.find({ user_id: Meteor.userId() }).fetch();
  for (var i = 0; i < dishLike.length; i++) {
    dishID.push(dishLike[i].dish_id);
  }
  for (i = 0 ; i < dishID.length; i++) {
    var temp = Dishes.find({ _id: dishID[i], deleted: false }).fetch();
    if (temp.length > 0) {
      result.push(temp[0]);
    }
  }
  return {
      currentUser: Meteor.user(),
      dishes: result
  };
})(WishDishList);
