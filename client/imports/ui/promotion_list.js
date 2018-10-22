import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Rating from './rating';
import ProgressiveImages from './progressive_image';
import Like from './like_button';
import { get_promotion_list, checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';

class PromotionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: []
    }
  }

  handleOnViewDish = (dishId) => {
    BlazeLayout.reset();
    //- tracking access promotion
    if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
      fbq('trackCustom', 'SelectPromotionDish', { dish_id: dishId, user_id: Meteor.userId() });
    }
    FlowRouter.go("/dish/" + dishId);
  }

  renderList = () => {
    let hasThumbnail;
    return this.props.data.map((item, index) => {
      if (item.meta) {
        hasThumbnail = true;
      } else {
        hasThumbnail = false;
      }
      return (
        <div key={index} className="col xl3 l4 m6 s12 dish-wrapper" onClick={() => this.handleOnViewDish(item._id)}>
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
          <div className="row">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              {
                (parseInt(item.order_count) >= 10)
                ? <span className="order-count">{ item.order_count }</span>
                : ''
              }
            </div>
            {
              (!isNaN(item.dish_selling_price))
              ? (
                (checking_promotion_dish(item._id).length > 0) ?
                  <ul className="promotion-price-list">
                    <li className="dish-price no-padding">$ { item.dish_selling_price * get_amount_promotion(item._id) }</li>
                    <li className="dish-old-price no-padding">$ { item.dish_selling_price }</li>
                  </ul>
                : (
                  <div className="row">
                    <div className="col l6 m6 dish-price no-padding text-left">$ { item.dish_selling_price }</div>
                  </div>
                )
              ) : ('')
            }
          </div>
        </div>
      )
    })
  }

  render() {
    return (
        (this.props.data.length > 0) ?
            <div className='col s12 m12 l12 no-padding list-container list-promotion-container' style={{minHeight: '380px'}}>
                {/* title */}
                <div className="row">
                <div className="col s6 m6 l6 no-padding">
                    <h5>{ this.props.title }</h5>
                </div>
                </div>
                {
                    <div className="row" style={{ marginBottom: '0px' }}>
                    {
                        (this.props.listLoading) ?
                        <span>Special thing is coming for you...</span>
                        :
                            this.renderList()
                        }
                    </div>
                }
            </div>
        : (<div></div>)
    );
  }
}

export default withTracker(props => {
    const handle = Meteor.subscribe('theDishes');
    var promotion_dishes = get_promotion_list();
    var result = [];
    if (promotion_dishes.length > 0) {
        for (var i = 0; i < promotion_dishes.length; i++) {
            var single_dish = Dishes.findOne({ _id: promotion_dishes[i].id });
            result.push(single_dish);
        }
    }
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        data: result
    };
  })(PromotionList);
