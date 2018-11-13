import React, { Component } from 'react';
import DishItem from '../dish_card_item/dish_card_item';

// App component - represents the whole app
export default class PopularDishList extends Component {

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
          <section className="container" id="list-district">
            <div className="row">
              <h2>Popular near you</h2>
              <div className="list-district-wrapper">
                <div>
                  {/* { this.renderListDish() } */}
                  <DishItem />
                  <DishItem />
                  <DishItem />
                  <DishItem />
                </div>
              </div>
            </div>
          </section>
        </div>
      )
  }

}
