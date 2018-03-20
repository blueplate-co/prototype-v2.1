import React, { Component } from 'react';

import DishList from './dish_list';
import MenuList from './menu_list';
import KitchenList from './kitchen_list';
import Modal from './modal';

import ProgressiveImages from './progressive_image';
 
// App component - represents the whole app
export default class ShowRoom extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      selectedDish: {}
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
      <div className="col xl12 l12 m12 s12">
        <div className="row">
          <div className="col xl12 l12 m12 s12 categories_navigation">
            <ul>
              <li id="dish_list_all">
                <span>Dish</span>{DishList}
              </li>
              <li id="menu_list_all">
                <span>Menu</span>
              </li>
              <li id="kitchen_list_all">
                <span>Kitchen</span>
              </li>
            </ul>
          </div>
        </div>
        <DishList title="Explore dish of today" seemore="see more available dish" popup={ this.handleDishPopup }/>
        <div className="row">
          <div className="col l12 m12 s12 banner">
            <h1>everyone's home chef</h1>
          </div>
        </div>
        <MenuList title="Set menu" seemore="see more available menu" popup={ this.handleMenuPopup }/>
        <KitchenList title="Kitchen" seemore="see more available chefs"/>
        <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
      </div>
    );
  }
}