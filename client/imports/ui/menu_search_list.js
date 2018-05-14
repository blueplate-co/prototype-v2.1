import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import ChefAvatar from './chef_avatar';
import Like from './like_button';

import { navbar_find_by } from './../../../imports/functions/find_by';

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
        <div key={index} className="col xl3 l3 m4 s6 s12 modal-trigger menu-wrapper" onClick={ () => this.handleClick(item) }>
          <div className="images-thumbnail" style={{ height: '150px' }}>
            <Like type="menu" id={item._id} />
            <div className="slider">
              { this.renderListCarousel(index) }
            </div>
          </div>
          <div className="row no-margin text-left" style={{ position: 'relative' }}>
            <h5 className="dish-title">{ item.menu_name }</h5>
            "" 
          </div>
          <div className="row no-margin">
            <div className="col l12 m12 dish-rating no-padding text-left">
              <Rating rating={item.average_rating}/>
              <span className="order-count">{ item.order_count }</span>
            </div>
          </div>
          <div className="row">
            <div className="col l12 m12 dish-price no-padding text-left">$ { item.menu_selling_price }</div>
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
        <div className = "section">
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
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theMenu');
  var menu_results = [];
  if (Session.get('advanced_search_results')) {
    for (var i = 0; i < Session.get('advanced_search_results').length; i++) {
      for (var j = 0; j < Session.get('advanced_search_results')[i].Menu.length; j++) {
        menu_results.push(Session.get('advanced_search_results')[i].Menu[j]);
      }
    }
  }
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      menus: menu_results,
  };
})(MenuSearchList);
