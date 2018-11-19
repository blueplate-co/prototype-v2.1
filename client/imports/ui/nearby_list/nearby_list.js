import React, { Component } from 'react';
import ChefItem from '../chef_card_item/chef_card_item';
import '../recommend_chef_list/recommend_chef_list.css';

// App component - represents the whole app
export default class NearbyList extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {}

  renderListDish() {
      return <DishItem />
  }

  render() {
      return (
        <div>
          <section className="list-chef-container container">
            <div className="row">
              <h2>Exciting cuisines nearby!</h2>
              <div className="list-chef-wrapper">
                  <ChefItem />
                  <ChefItem />
                  <ChefItem />
                  <ChefItem />
              </div>
            </div>
          </section>
        </div>
      )
  }

}
