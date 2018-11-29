import React, { Component } from 'react';
import BouncingLoader from '../bouncing_loader/bouncing_loader';
import './list_categories.css';


class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true
    }
  }

  componentDidMount() {
    Meteor.call('chef_categories.getInfo', this.props.name,(err, res) => {
      if (!err) {
        this.setState({
          data: res,
          loading: false
        })
      }
    });
  }

  render() {
    return (
      <div className="category-item" style={{ backgroundImage: "url(" + this.state.data.banner + ")" }}>
        <div className="shadow-mask"></div>
        {
          (this.state.loading) ? (
            <BouncingLoader />
          ) : (
            <a href={"/category/"+this.state.data._id+"/"+this.state.data.categories_name.toLowerCase()}>
              <div className="category-info">
                <p className="category-heading">{this.state.data.categories_name}</p>
              </div>
            </a>
          )
        }
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
    Meteor.call('chef_categories.create', 'Meal', () => {});
    Meteor.call('chef_categories.create', 'Beverage', () => {});
    Meteor.call('chef_categories.create', 'Condiments', () => {});
    Meteor.call('chef_categories.create', 'Cake', () => {});
    Meteor.call('chef_categories.create', 'Noodle', () => {});
    Meteor.call('chef_categories.create', 'Snack', () => {});
  }

  renderListCategories() {
    return (
      <div className="category-list">
        <CategoryItem name="Meal" />
        <CategoryItem name="Beverage" />
        <CategoryItem name="Condiments" />
        <CategoryItem name="Cake" />
        <CategoryItem name="Noodle" />
        <CategoryItem name="Snack" />
      </div>
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
