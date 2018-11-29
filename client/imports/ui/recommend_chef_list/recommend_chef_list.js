import React, { Component } from 'react';
import ChefItem from '../chef_card_item/chef_card_item';
import '../recommend_chef_list/recommend_chef_list.css';
import BouncingLoader from '../bouncing_loader/bouncing_loader';

// App component - represents the whole app
export default class RecommendChefList extends Component {

  constructor(props) {
    super(props);
    this.renderListDish = this.renderListDish.bind(this);
    this.state = {
      data: [],
      lat: null,
      lng: null,
      loading: true
    }
  }

  componentDidMount() {
    Meteor.call('chef_categories.create', 'recommend', () => {});
    if ( navigator.geolocation ) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
          })
      }, (err) => {
          Materialize.toast(err.message, 4000, 'rounded bp-green');
      });
    } else {
      Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
    }
    Meteor.call('chef_categories.bestSelling', (err, res) => {
      if (!err) {
        this.setState({
          data: res,
          loading: false
        })
      }
    })
  }

  renderListDish() {
    if (this.state.loading) {
      return <BouncingLoader />
    } else {
      return this.state.data.map((item, index) => {
        return <ChefItem key={item._id} id={item._id} name={item.kitchen_name} rating={item.average_rating} banner={item.bannerProfileImg} tags={item.kitchen_tags} location={item.kitchen_address_conversion} currentLat={this.state.lat} currentLng={this.state.lng} />
      });
    }
  }

  render() {
      return (
        <div>
          <section className="list-chef-container container">
            <div className="row">
              <h2>Recommend by Blueplate</h2>
              <div className="list-chef-wrapper">
                { this.renderListDish() }
              </div>
            </div>
          </section>
        </div>
      )
  }

}
