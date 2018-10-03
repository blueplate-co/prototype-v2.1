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
import TagsDisplay from './tags_display';
import SearchMap from './search_map';
import PromotionList from './promotion_list';

// App component - represents the whole app
class ShowRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kitchenExisted: false,
      screen: this.props.screen,
      tab: 'all',
      width: 0,
      showmap: false
    }
  }

  handleMenuPopup = (item) => {
    this.setState({
      selectedMenu: item
    });
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillReceiveProps = (nextProps, nextState) => {
    if (nextProps.searchingData !== this.props.searchingData) {
      this.changeTab(this.state.tab, 1);
    }
  }

  componentDidMount = () => {
    // Session.set('list_kitchen_for_map', null);
    // Session.set('search_result', null)
    // Session.set('search_result_origin', null);
    // Session.set('search_nearby', false);

    //- procedure for promotion $50HKD
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var promotion = url.searchParams.get("promotion");
    var dish = url.searchParams.get("dish");
    var kitchen = url.searchParams.get("kitchen");
    // check if already have cookies
    var dc = document.cookie;
    var prefix = "promotion" + "=";
    var begin = dc.indexOf(prefix);
    //- when user already logged in, just apply promotion program for they
    if (Meteor.userId() && promotion) {
      Meteor.call('promotion.check_history', (err, res) => {
        if (Object.keys(res).length == 0) { // this user not already have promotion before
          Meteor.call('promotion.insert_history', Meteor.userId(), 'HKD50', (err, res) => {
            if (err) {
              Materialize.toast(err, 4000, 'rounded bp-green');
            } else {
                setTimeout(() => {
                  $('#promotion_modal').modal();
                  $('#promotion_modal').modal('open');
                }, 2000);
              //- end promotion modal
            }
          });
        }
      });
    } else {
      //- when user not logged in, create a cookies to store this program
      if (begin == -1 && promotion) {
        document.cookie = "promotion=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        setTimeout(() => {
          $('#promotion_modal').modal();
          $('#promotion_modal').modal('open');
        }, 1000);
      }
    }

    $('#searchQuery').val('');
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
      $('.page-footer').hide();
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

  get_list_kitchen = (kitchen_id_list) => {
    // get location of kitchens for map markers
    for (var i = 0; i < kitchen_id_list.length; ++i) {
      for (var j = i + 1; j < kitchen_id_list.length; ++j) {
        if (kitchen_id_list[i] === kitchen_id_list[j])
          kitchen_id_list.splice(j--, 1);
      }
    }
    //- get location of item in array
    var listkitchens = [];
    for (var i = 0; i < kitchen_id_list.length; i++) {
      let selected_kitchen = Kitchen_details.findOne({ _id: kitchen_id_list[i] });
      listkitchens.push(selected_kitchen);
    }
    Session.set('list_kitchen_for_map', listkitchens);
  }

  changeTab = (tab, time) => {
    this.setState({
      tab: tab
    },() => {
      //- get unique kitchen id of 3 lists.
      if (Session.get('search_result')) {
        let uniqueDishKitchen, uniqueMenuKitchen, uniqueKitchen;
        if (Session.get('search_result').dish) {
          uniqueDishKitchen = [...new Set(Session.get('search_result').dish.map(item => item.kitchen_id))];
        } else {
          uniqueDishKitchen = [];
        }
        if (Session.get('search_result').menu) {
          uniqueMenuKitchen = [...new Set(Session.get('search_result').menu.map(item => item.kitchen_id))];
        } else {
          uniqueMenuKitchen = [];
        }
        if (Session.get('search_result').kitchen) {
          uniqueKitchen = [...new Set(Session.get('search_result').kitchen.map(item => item._id))];
        } else {
          uniqueKitchen = [];
        }
        switch (tab) {
          case 'all':
            let kitchen_id_list = [...uniqueDishKitchen, ...uniqueMenuKitchen, ...uniqueKitchen];
            this.get_list_kitchen(kitchen_id_list);
            break;
          case 'dishes':
            this.get_list_kitchen(uniqueDishKitchen);
            break;
          case 'menus':
            this.get_list_kitchen(uniqueMenuKitchen);
            break;
          case 'kitchens':
            this.get_list_kitchen(uniqueKitchen);
            break;
        }
      }
      if (time == 1) {
        this.changeTab(tab, 2);
      }
    });
  }

  render() {
    switch (this.state.screen) {
      case 'all_dish':
        return (
          <div>
            <DishAllList title="All dishes" seemore=""/ >
            <Modal menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'all_menu':
        return (
          <div>
            <MenuAllList title="All Menus" seemore="" />
            <Modal menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'all_kitchen':
        return (
          <div>
            <KitchenAllList title="All Kitchens" seemore=""/>
            <Modal menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      case 'search':
        return (
          <div>
            <div className="row">
              {/* Begin tab component */}
              <a onClick={() => { this.setState({ showmap: true }); $('.search-map-container').toggle(); }} className="btn-floating btn-large waves-effect waves-light float-map" style={{display: 'none'}}></a>
              <div className="row">
                <div id="search_result_container" className="col l8 m6 s12">
                  <ul className="tabs">
                    <li onClick={() => this.changeTab('all', 1)} className="tab col s3"><a className="active" href="#all">All</a></li>
                    <li onClick={() => this.changeTab('dishes', 1)} className="tab col s3"><a href="#dishes">Dishes</a></li>
                    <li onClick={() => this.changeTab('menus', 1)} className="tab col s3"><a href="#menus">Menus</a></li>
                    <li onClick={() => this.changeTab('kitchens', 1)} className="tab col s3"><a href="#kitchens">Kitchens</a></li>
                  </ul>
                  {/* Tab all */}
                  <ListFilter tab={this.state.tab}/>
                  <div id="all" className="col s12">
                    <DishSearchList />
                    <MenuSearchList popup={ this.handleMenuPopup }/>
                    <KitchenSearchList />
                  </div>
                  {/* Tab dishes */}
                  <div id="dishes" className="col s12">
                    <DishSearchList />
                  </div>
                  {/* Tab menus */}
                  <div id="menus" className="col s12">
                    <MenuSearchList popup={ this.handleMenuPopup }/>
                  </div>
                  {/* Tab kitchens */}
                  <div id="kitchens" className="col s12">
                    <KitchenSearchList />
                  </div>
                </div>
                <div className="col l4 m6 s12 search-map-container">
                  <i id="close_map" onClick={ () => $('.search-map-container').toggle() } className="material-icons">close</i>
                  <SearchMap />
                </div>
              </div>
              <Modal menu={this. state.selectedMenu}/>
            </div>
          </div>
        )
        break;
      case 'wish_list':
        return (
          <div>
            <WishDishList title="All dishes you liked" seemore="" />
            <WishMenuList title="All menus you liked" seemore="" popup={ this.handleMenuPopup }/>
            <Modal menu={this.state.selectedMenu}/>
          </div>
        )
        break;
      default:
        return (
          <div>
            <TagsDisplay />
            <PromotionList title="Special Discount" />
            <div className="row">
              <DishList title="Dishes Highlight" seemore="see all" showStatus="false"/>
            </div>
            <div className="row">
              <ShowroomBanner kitchenExisted = {this.state.kitchenExisted} />
            </div>
            <div className = "row">
              <MenuList title="Menus Highlight" seemore="see all" popup={ this.handleMenuPopup }/>
            </div>
            <div className = "row">
              <KitchenList title="Kitchens" seemore="see all"/>
            </div>
            <Modal menu={this.state.selectedMenu}/>
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
