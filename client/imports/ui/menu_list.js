import React, { Component } from 'react';
import { Session } from 'meteor/session';
import Rating from './rating';
import Like from './like_button';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import BouncingLoader from './bouncing_loader/bouncing_loader.js';


export default class MenuList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      loading: true,
      menus: []
    }
  }
  componentDidMount = ()  => {
    var kitchen_id = '';
    if (FlowRouter.getParam('homecook_id')) {
      kitchen_id = FlowRouter.getParam('homecook_id');
      Meteor.call('menu.getListMenuShowroom', kitchen_id, (err, res) => {
        this.setState({
          menus: res,
          loading: false
        })
      })
    } else {
      Meteor.call('menu.getListMenuShowroom', kitchen_id, (err, res) => {
        this.setState({
          menus: res,
          loading: false
        })
      })
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

  renderListCarousel = (index, self) => {
    let listDish = self.state.menus[index];
    let id = listDish.dishes_id;
    let listImages = [];

    id.map((item, index) => {
      let dish = Dishes.find({ _id: item }).fetch();
      let images = { medium: dish[0].meta.medium, small: dish[0].meta.small };
      listImages.push(images);
    })

    if (listImages.length > 1) {
      return listImages.map((item, index) => {
        if (item) {
          return (
            <div key={index} className="slider-item" style={{backgroundImage: "url(" + item.medium + ")"}}></div>
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
          <div key={index} className="slider-item" style={{backgroundImage: "url(" + listImages[0].medium + ")"}}></div>
        )
      } else {
        return (
          <div key={index} className="slider-item" style={{backgroundImage: "#ccc"}}></div>
        )
      }
    }
  }

  renderList = () => {
    if (this.state.menus.length == 0) {
      return <p>No menu to display</p>
    }
    return this.state.menus.map((item, index) => {
      return (
        <div key={index} className="col xl3 l4 m6 s12 modal-trigger menu-wrapper" onClick={ () => this.handleClick(item) }>
          <div className="images-thumbnail">
            <Like type="menu" id={item._id} />
            <div className="slider">
              { this.renderListCarousel(index, this) }
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

  render() {
    return (
      <div className='col s12 m12 l12 no-padding list-container'>
        {/* title */}
        <div className="row">
          <div className="col s6 m6 l6 no-padding">
            <h5>{ this.props.title }</h5>
          </div>
          <div className="col s6 m6 l6 text-right no-padding seeall">
            <a href="/see_all/menu" >{ this.props.seemore }</a>
          </div>
        </div>
        {
          (!this.props.listLoading) ?
            (
              <div className="row">
                {
                  (this.state.loading)
                  ?
                    <BouncingLoader />
                  :
                    this.renderList()
                }
              </div>
            ) : (
              <BouncingLoader />
            )
        }
      </div>
    );
  }
}

