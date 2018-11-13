import React, { Component } from 'react';
import Rating from './rating/rating';
import ProgressiveImages from './progressive_image';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import BouncingLoader from './bouncing_loader/bouncing_loader.js';

// App component - represents the whole app
export default class LandingDishList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dishes: []
    }
  }

  componentDidMount() {
    Meteor.call('dish.getDishListLandingPage', (err, res) => {
      if (!err) {
        this.setState({
          dishes: res,
          loading: false
        })
      } else  {
        this.setState({
          dishes: [],
          loading: false
        })
      }
    });
  }

  renderList = () => {
    if (this.state.dishes.length == 0 && !this.state.loading) {
      return <p>Has no dishes to be displayed</p>
    }
    let hasThumbnail;
    return this.state.dishes.map((item, index) => {
      if (item.meta) {
        hasThumbnail = true;
      } else {
        hasThumbnail = false;
      }
      return (
        <div key={index} className="col xl3 l4 m6 s12 modal-trigger dish-wrapper" onClick={ () => FlowRouter.go('/dish/' + item._id)}>
          <div className="images-thumbnail" style =  {{ background: '#ccc' }}>
            {
              (hasThumbnail) ?
                <ProgressiveImages
                  large={ item.meta.medium }
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

        </div>
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
              <BouncingLoader />
            :
              this.renderList()
          }
      </div>
    );
  }
}
