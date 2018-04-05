import React, { Component } from 'react';
import DishList from './dish_list';
import MenuList from './menu_list';
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

  handleMenuPopup = (item) => {
    this.setState({
      selectedMenu: item
    });
  }

  render() {
    return (
      <div className = "col xl12 l12 m12 s12">
        <DishList title="Dishes" seemore = "" popup = { this.handleDishPopup } />
        <MenuList title = "Menus" seemore = "" popup = { this.handleMenuPopup }/>
        <Modal dish = {this.state.selectedDish} menu = {this.state.selectredMenu}/>
      </div>
    )
  }

}
