import React, { Component } from 'react';
import './list_categories.css';


class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    Meteor.call('chef_categories.getInfo', this.props.name,(err, res) => {
      if (!err) {
        this.setState({
          data: res
        })
      }
    });
  }

  render() {
    return (
      <div className="category-item">
        <a href={"/category/"+this.state.data._id}>
          <div className="category-banner" style={{ backgroundImage: "url(" + this.state.data.banner + ")" }}>
          </div>
          <div className="category-info">
            <p className="category-heading">{this.state.data.categories_name}</p>
            <p className="category-description">{this.state.data.description}</p>
          </div>
        </a>
      </div>
    )
  }
}

// App component - represents the whole app
export default class ListCategories extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    Meteor.call('chef_categories.create', 'Bake', () => {});
    Meteor.call('chef_categories.create', 'Meal', () => {});
    Meteor.call('chef_categories.create', 'Marketplace', () => {});
  }

  renderListCategories() {
    return (
      <ul className="category-list">
        <CategoryItem name="Bake" />
        <CategoryItem name="Meal" />
        <CategoryItem name="Marketplace" />
      </ul>
    )
  }

  render() {
      return (
        <div>
          <section className="container" id="list-district">
            <div className="row">
              <h2>Stuck? we've got it all!</h2>
              <div className="list-district-wrapper">
                { this.renderListCategories() }
              </div>
            </div>
          </section>
        </div>
      )
  }
}
