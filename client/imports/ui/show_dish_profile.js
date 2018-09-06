import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import SelfDishList from '../../imports/ui/self_dish_list.js';
import SelfMenuList from '../../imports/ui/self_menu_list.js';
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

  handleMenuPopup = (item) => {
    this.setState({
      selectedMenu: item
    });
  }

  render() {
    if (FlowRouter.getParam('homecook_id')) {
      return (
        <div className = "col xl12 l12 m12 s12">
          <DishList title="Dishes" seemore = ""/>
          <MenuList title = "Menus" seemore = "" popup = { this.handleMenuPopup }/>
          <Modal dish = {this.state.selectedDish} menu = {this.state.selectredMenu}/>
        </div>
      )
    } else {
      return (
        <div className = "col xl12 l12 m12 s12">
          <SelfDishList title = "Dishes" manageDish = "manage dishes" />
          <SelfMenuList title = "Menus" manageMenu = "manage menu"/>
        </div>
      )
    }
  }

}
