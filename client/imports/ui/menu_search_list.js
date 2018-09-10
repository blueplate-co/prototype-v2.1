import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import Like from './like_button';

// App component - represents the whole app
class MenuSearchList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      loading: false
    }
  }

  handleClick = (item) => {
    Meteor.call('menu.view', item._id, item.user_id);;
    Session.set('selectedMenu', item);
    Session.set('selectedItem', 'menu');
    Session.set('modal', true);
    this.props.popup(item);
  }

  componentDidUpdate = () => {
    $('.slider').slick({
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
      lazyLoad: 'progressive'
    });
  }

  renderListCarousel = (index) => {
    let listDish = this.props.menus[index];
    let id = listDish.dishes_id;
    let listImages = [];

    id.map((item, index) => {
      let dish = Dishes.find({ _id: item }).fetch();
      let images = { origin: dish[0].meta.origin, small: dish[0].meta.small };
      listImages.push(images);
    })

    if (listImages.length > 1) {
      return listImages.map((item, index) => {
        if (item) {
          return (
            <div key={index} className="slider-item" style={{backgroundImage: "url(" + item.origin + ")"}}></div>
          )
        } else {
          return (
            <div key={index} className="slider-item" style={{backgroundImage: "#ccc"}}></div>
          )
        }
      })
    } else {
      if (listImages.length > 0) {
        return (
          <div key={index} className="slider-item" style={{backgroundImage: "url(" + listImages[0].origin + ")"}}></div>
        )
      } else {
        return (
          <div key={index} className="slider-item" style={{backgroundImage: "#ccc"}}></div>
        )
      }
    }
  }

  renderList = () => {
    if (this.props.menus.length == 0) {
      return <p>Has no menus to be displayed</p>
    }
    return this.props.menus.map((item, index) => {
      return (
        <div key={index} className="col xl4 l4 m6 s12 menu-wrapper" onClick={ () => this.handleClick(item) }>
          <div className="images-thumbnail" style={{ height: '150px' }}>
            <Like type="menu" id={item._id} />
            <div className="slider">
              { this.renderListCarousel(index) }
            </div>
          </div>
          <div className="row no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.menu_name }</h5>
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
            <div className="col l12 m12 dish-price no-padding text-left">$ { item.menu_selling_price }</div>
          </div>

        </div>
      )
    })
  }

  renderResultTitle = () => {
    if (Session.get('search_nearby')) {
      if (Session.get('search_result').menu.length > 20) {
        let overNumber = Session.get('search_result').menu.length - (Session.get('search_result').menu.length % 5);
        return 'Over ' + overNumber + '+ results around you';
      } else {
        return Session.get('search_result').menu.length + ' menus results around';
      }
    }
    if (Session.get('search_result')) {
      let keywork = $('#searchQuery').val();
      if (Session.get('search_result').menu.length > 20) {
        let overNumber = Session.get('search_result').menu.length - (Session.get('search_result').menu.length % 5);
        return 'Over ' + overNumber + '+ results for ' + '"'+ keywork +'"';
      } else {
        return Session.get('search_result').menu.length + ' menus results for ' + '"'+ keywork +'"';
      }
    } else {
      return 'Menus';
    }
  }

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* title */}
        <div className="row">
          <div className="col s12 m12 l6 no-padding">
            <h5>{ this.renderResultTitle() }</h5>
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
                <span>Your favorite menus is searching...</span>
              :
                this.renderList()
            }
          </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theMenu');
  var menu_results = [];
  if (Session.get('search_result')) {
    for (var i = 0; i < Session.get('search_result').menu.length; i++) {
        menu_results.push(Session.get('search_result').menu[i]);
    }
  }
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      menus: menu_results,
  };
})(MenuSearchList);
