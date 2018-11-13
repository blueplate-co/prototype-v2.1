import React, { Component } from 'react';
import './list_categories.css';

const CategoryItem = (props) => {
  return (
    <div key={props.district} className="district-item">
    </div>
  )
}

// App component - represents the whole app
export default class ListCategories extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  renderListCategories() {
    return (
        <CategoryItem />
    )
  }

  render() {
      return (
        <div>
          <section className="container" id="list-district">
            <div className="row">
              <h2>Stuck? we've got it all!</h2>
              <div className="list-district-wrapper">
                <ul>
                  { this.renderListCategories() }
                </ul>
              </div>
            </div>
          </section>
        </div>
      )
  }
}
