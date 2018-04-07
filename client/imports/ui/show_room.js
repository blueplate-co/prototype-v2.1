import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import DishList from './dish_list';
import MenuList from './menu_list';
import KitchenList from './kitchen_list';
import DishAllList from './dish_all_list';
import MenuAllList from './menu_all_list';
import KitchenAllList from './kitchen_all_list';
import DishSearchList from './dish_search_list';
import MenuSearchList from './menu_search_list';
import WishDishList from './wish_dish_list';
import WishMenuList from './wish_menu_list';
import Modal from './modal';

import ProgressiveImages from './progressive_image';

// App component - represents the whole app
export default class ShowRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDish: {},
      screen: this.props.screen
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

  componentDidMount = () => {
    $("[role=navigation]").height('65px');
    localStorage.setItem('userMode', 'foodie')
  }

  renderCategories = () => {
    return (
      <ul>
        <li id="dish_list_all" onClick={() => { this.setState({ screen: 'all_dish' }); Session.set('modal', false); FlowRouter.go('/see_all/dish');  }}>
          <span>Dish</span>
        </li>
        <li id="menu_list_all" onClick={() => { this.setState({ screen: 'all_menu' }); Session.set('modal', false); FlowRouter.go('/see_all/menu');  }}>
          <span>Menu</span>
        </li>
        <li id="kitchen_list_all" onClick={() => { this.setState({ screen: 'all_kitchen' }); Session.set('modal', false); FlowRouter.go('/see_all/kitchen');  }}>
          <span>Kitchen</span>
        </li>
      </ul>
    )
  }

  render() {
    switch (this.state.screen) {
      case 'all_dish':
        return (
          <div>
            <div className="row">
              <div className="col xl12 l12 m12 s12 categories_navigation">
                { this.renderCategories() }
              </div>
            </div>
            <DishAllList title="All dishes" seemore="" popup={ this.handleDishPopup }/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'all_menu':
        return (
          <div>
            <div className="row">
              <div className="col xl12 l12 m12 s12 categories_navigation">
                { this.renderCategories() }
              </div>
            </div>
            <MenuAllList title="All menus" seemore="" popup={ this.handleDishPopup }/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'all_kitchen':
        return (
          <div>
            <div className="row">
              <div className="col xl12 l12 m12 s12 categories_navigation">
                { this.renderCategories() }
              </div>
            </div>
            <KitchenAllList title="All kitchens" seemore="" popup={ this.handleDishPopup }/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'search':
        return (
          <div>
            <div className="row">
              <div className="col xl12 l12 m12 s12 categories_navigation">
                { this.renderCategories() }
              </div>
            </div>
            <DishSearchList title="Dishes" seemore="" popup={ this.handleDishPopup }/>
            <MenuSearchList title="Menus" seemore="" popup={ this.handleMenuPopup }/>
            <Modal dish={this.state.selectedDish} menu={this. state.selectedMenu}/>
          </div>
        )
        break;
      case 'wish_list':
        return (
          <div>
            <WishDishList title="All dishes you liked" seemore="" popup={ this.handleDishPopup }/>
            <WishMenuList title="All menus you liked" seemore="" popup={ this.handleMenuPopup }/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      default:
        return (
          <div>
            <div className="row">
              <div className="col xl12 l12 m12 s12 categories_navigation">
                { this.renderCategories() }
              </div>
            </div>
            <DishList title="Explore dish of today" seemore="see all" popup={ this.handleDishPopup }/>
            <div className="row">
              <div className="col l12 m12 s12 banner">
                <h1>everyone's home chef</h1>
              </div>
            </div>
            <MenuList title="Set menu" seemore="see all" popup={ this.handleMenuPopup }/>
            <KitchenList title="Kitchen" seemore="see all"/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
    }
  }
}
