import React, { Component } from 'react';
import DishList from './dish_list';
import Modal from './modal';

export default class ShowDishProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDish: {},
      selectedMenu: {}
    }
  }

  handleDishPopup = (item) => {
    this.setState({
      selectedDish: item
    });
  }

  render() {
    return (
      <div className = "col xl12 l12 m12 s12">
        <DishList title="" seemore = "" popup={ this.handleDishPopup } />
        <Modal dish = {this.state.selectedDish} />
      </div>
    )
  }

}
