import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import DishList from './dish_list';
import MenuList from './menu_list';
import ShowroomBanner from './showroom_banner';
import KitchenList from './kitchen_list';
import DishAllList from './dish_all_list';
import MenuAllList from './menu_all_list';
import KitchenAllList from './kitchen_all_list';
import DishSearchList from './dish_search_list';
import MenuSearchList from './menu_search_list';
import KitchenSearchList from './kitchen_search_list';
import WishDishList from './wish_dish_list';
import WishMenuList from './wish_menu_list';
import ListFilter from './list_filter';
import Modal from './modal';
import SearchMap from './search_map';

// App component - represents the whole app
class ShowRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDish: {},
      kitchenExisted: false,
      screen: this.props.screen,
      tab: 'all',
      width: 0,
      showmap: true
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

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidMount = () => {
    $("[role=navigation]").height('65px');
    localStorage.setItem('userMode', 'foodie');
    Meteor.call('check_kitchen.get', Meteor.userId(), (err, res) => {
      this.setState({
        kitchenExisted: res
      })
    });
    //- set timeout for delay responsive UI
    setTimeout(() => {
      $('.tabs').tabs({});
      // $('.page-footer').hide();
    }, 500);
    window.addEventListener('resize', this.handleWindowSizeChange);
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

  changeTab = (tab) => {
    this.setState({
      tab: tab
    })
  }

  renderMap = () => {
    if (this.state.width >= 768) {
      return <SearchMap />;
    } else {
      if (this.state.showmap) {
        return <SearchMap />;
      } else {
        return '';
      }
    }
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
            <MenuAllList title="All Menus" seemore="" popup={ this.handleDishPopup }/>
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
            <KitchenAllList title="All Kitchens" seemore="" popup={ this.handleDishPopup }/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'search':
        return (
          <div>
            <div className="row">
              {/* Begin tab component */}
              <a onClick={() => this.setState({ showmap: true })}className="btn-floating btn-large waves-effect waves-light float-map" style={{display: 'none'}}></a>
              <div className="row">
                <div className="col l8 m6 s12">
                  <ul className="tabs">
                    <li onClick={() => this.changeTab('all')} className="tab col s3"><a className="active" href="#all">All</a></li>
                    <li onClick={() => this.changeTab('dishes')} className="tab col s3"><a href="#dishes">Dishes</a></li>
                    <li onClick={() => this.changeTab('menus')} className="tab col s3"><a href="#menus">Menus</a></li>
                    <li onClick={() => this.changeTab('kitchens')} className="tab col s3"><a href="#kitchens">Kitchens</a></li>
                  </ul>
                  {/* Tab all */}
                  <div id="all" className="col s12">
                    <ListFilter tab={this.state.tab}/>
                    <DishSearchList />
                    <MenuSearchList popup={ this.handleMenuPopup }/>
                    <KitchenSearchList />
                  </div>
                  {/* Tab dishes */}
                  <div id="dishes" className="col s12">
                    <ListFilter tab={this.state.tab}/>
                    <DishSearchList />
                  </div>
                  {/* Tab menus */}
                  <div id="menus" className="col s12">
                    <ListFilter tab={this.state.tab}/>
                    <MenuSearchList popup={ this.handleMenuPopup }/>
                  </div>
                  {/* Tab kitchens */}
                  <div id="kitchens" className="col s12">
                    <ListFilter tab={this.state.tab}/>
                  </div>
                </div>
                <div className="col l4 m6 s12 search-map-container">
                {
                  this.renderMap()
                }
                </div>
              </div>
              <Modal dish={this.state.selectedDish} menu={this. state.selectedMenu}/>
            </div>
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
            <DishList title="Dishes Highlight" seemore="see all" popup={ this.handleDishPopup }/>
            <div className="row">
            <ShowroomBanner kitchenExisted = {this.state.kitchenExisted} />
            </div>
            <MenuList title="Menus Highlight" seemore="see all" popup={ this.handleMenuPopup }/>
            <KitchenList title="Kitchens" seemore="see all"/>
            <Modal dish={this.state.selectedDish} menu={this.state.selectedMenu}/>
          </div>
        )
        break;
    }
  }
}

export default withTracker(props => {
  return {
      searchingData: Session.get('search_result')
  };
})(ShowRoom);