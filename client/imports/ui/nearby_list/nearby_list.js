import React, { Component } from 'react';
import ChefItem from '../chef_card_item/chef_card_item';
import '../recommend_chef_list/recommend_chef_list.css';

// App component - represents the whole app
export default class NearbyList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    if ( navigator.geolocation ) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        var centerLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        Meteor.call('mapping.check_radius', centerLocation, 5,(err, res) => {
          this.setState({ data: res })
        })
      }, (err) => {
        Materialize.toast(err.message, 4000, 'rounded bp-green');
      });
    } else {
      Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
    }
  }

  renderListDish() {
    return this.state.data.map((item, index) => {
      return <ChefItem key={item._id} id={item._id} name={item.kitchen_name} rating={item.average_rating} banner={item.bannerProfileImg} tags={item.kitchen_tags} location={item.kitchen_address_conversion} currentLat={this.state.lat} currentLng={this.state.lng} />
    });

  }

  render() {
      return (
        <div>
          {
            (this.state.data.length > 0) ? (
              <section className="list-chef-container container">
                <div className="row">
                  <h2>Exciting cuisines nearby!</h2>
                  <div className="list-chef-wrapper">
                    {this.renderListDish()}
                  </div>
                </div>
              </section>
            ) : (
              ''
            )
          }
        </div>
      )
  }

}
