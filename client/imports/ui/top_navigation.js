import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import Sidebar from "react-sidebar";
import { Index, MinimongoEngine } from 'meteor/easy:search';

const styles = {
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    height: 65,
  },
  sidebar: {
    zIndex: 999,
    position: "fixed",
    top: 0,
    bottom: 0,
    transition: "transform .3s ease-out",
    WebkitTransition: "-webkit-transform .3s ease-out",
    willChange: "transform",
    overflowY: "auto",
    background: "white",
    width: 300,
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "initial",
    WebkitOverflowScrolling: "touch",
    transition: "left .3s ease-out, right .3s ease-out",
    zIndex: 990,
    height: 65,
  },
  overlay: {
    zIndex: 995,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: "hidden",
    transition: "opacity .3s ease-out, visibility .3s ease-out",
    backgroundColor: "rgba(0,0,0,.3)",
  },
  dragHandle: {
    zIndex: 1,
    position: "fixed",
    top: 0,
    bottom: 0,
  },
};

// App component - represents the whole app
class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.renderSideBar = this.renderSideBar.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      sidebarOpen: false,
      search: false,
      width: window.innerWidth,
      status: "Search",
      credits: 0,
      avatar: '',
      isLogin: Meteor.userId() != undefined ? true : false
    };
  }

  openProfile = () => {
    if (Meteor.userId()) {
      if (Profile_details.findOne({ user_id: Meteor.userId() })) {
        FlowRouter.go("/profile/edit_foodie_profile");
      } else {
        FlowRouter.go("/profile");
      }
    } else {
      util.loginAccession('/profile/edit_foodie_profile');
    }
  };

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: open });
  };

  toggle = () => {
    Session.set('modal', false);
    $('.modal').modal('close');
    this.setState({ 
      sidebarOpen: this.state.sidebarOpen ? false : true, 
      isLogin: Meteor.userId() != undefined ? true : false
    }, () => {
      this.state.isLogin ? "" : localStorage.setItem("userMode", "foodie");
    });
  };

  handleGoHome = () => {
    Session.set('modal', false);
    $('.modal').modal('close');
    $(window).scrollTop(0);
    this.setState({ sidebarOpen: false });
    Session.set('list_kitchen_for_map', null);
    Session.set('search_result', null)
    Session.set('search_result_origin', null);
    Session.set('search_nearby', false);
    $('#searchQuery').val('');
    Session.set()
    FlowRouter.go("/");
  }

  checkKitchenProfileExists = () => {
    if (Kitchen_details.findOne({ user_id: Meteor.userId() })) {
      FlowRouter.go("/profile/show_homecook_profile");
    } else {
      FlowRouter.go("/profile/create_homecook_profile");
    }
  };

  checkAccessPermission = (access_path) => {
    this.setState({ sidebarOpen: false });
    if (!Meteor.user() && !Meteor.loggingIn()) {
      util.loginAccession("/" + access_path);
    } else {
      FlowRouter.go("/" + access_path);
    }
  }

  checkIsLoginAccn = () => {
    this.setState({ sidebarOpen: false });
    if (this.state.isLogin) {
      util.show_loading_progress();
      Meteor.logout(() => {
        util.hide_loading_progress();
        this.setState({ isLogin: false })
        FlowRouter.go("/");
        location.href = '/';
      })
    } else {
      util.loginAccession("");
    }
  }

  renderSideBar = () => {
    return localStorage.getItem("userMode") == "foodie" ? (
      <ul className="sidebar-container">
        <li className="not-cursor foodie-title-text">
          <span id="menu-foodie-mode-title">Foodie</span>
          <img id="foodies-title-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foodie_sidebar_icon.svg"/>
        </li>

        <li className="visted-color"
          onClick={() => {
            this.checkAccessPermission("wish-list");
          }}
        >
          <span>Wishlist</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/love.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.checkAccessPermission('orders_tracking');
          }}
        >
          <span>Order Status</span>
          { (this.props.orderStatus.length > 0)
            ?
              <span className="notification-status"></span>
            :
              ""
           }
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/curent+order.svg" />
        </li>
        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/message");
            });
          }}
        >
          <span>Chat</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/chat-icon-blur.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/shopping_cart");
              //- send to Facebook Pixel
              if (location.hostname == 'www.blueplate.co') {
                fbq('trackCustom', 'ClickOnShoppingCartSidebar', { content_id: Meteor.userId() });
              }
              this.setState({ sidebarOpen: false }, () => {
                FlowRouter.go("/shopping_cart");
              });
            });
          }}
        >
          <span>Shopping cart</span>
          <span id="cart-number-sidebar">{this.props.shoppingCart.length}</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/shopping+cart.svg" />
        </li>

        <li className="switch-chef-text"
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "chef");
            if (!Meteor.user() && !Meteor.loggingIn()) {
              util.loginAccession("/profile/show_homecook_profile");
            } else {
              setTimeout(() => {
                this.setState({ sidebarOpen: true });
              }, 500);
              BlazeLayout.reset();
              FlowRouter.go("/profile/show_homecook_profile");
            }
          }}
        >
          <span>Switch to cooking</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/swift+mode.svg" />
        </li>
        <li
          onClick={() => {
              this.checkIsLoginAccn();
            }
          }
        >
          {
            this.state.isLogin ? 
              <span>Log out</span>
            :
              <span>Log in</span>
          }
        </li>
      </ul>
    ) : (
      <ul className="sidebar-container">

        <li className="not-cursor chef-title-text">
          <span id="menu-chef-mode-title">Chef</span>
          <img id="chef-title-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/chef_sidebar_icon.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              this.checkKitchenProfileExists();
            });
          }}
        >
          <span className="your-kitchen-menu">Your Kitchen</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/kitchen.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/dashboard");
            });
          }}
        >
          <span>Dashboard</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/dash.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/message");
            });
          }}
        >
          <span>Chat</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Chat.svg" />
        </li>

        <li className="visted-color"
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/orders");
            });
          }}
        >
          <span>Current orders</span>
          { (this.props.currentOrder.length > 0)
            ?
              <span className="notification-status"></span>
            :
              ""
           }
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/curent+order.svg" />
        </li>

        <li className="switch-foodie-text"
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "foodie");
            setTimeout(() => {
              this.setState({ sidebarOpen: true });
            }, 500);
            FlowRouter.go("/main");
          }}
        >
          <span>Switch to foodie</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/swift+mode.svg" />
        </li>
        <li
          onClick={() => {
              this.checkIsLoginAccn();
            }
          }
        >
          {
            this.state.isLogin ?
              <span>Log out</span>
            :
              <span>Log in</span>
          }
        </li>
      </ul>
    );
  };

  removeDeletedItem(arr) {
    let deleted = arr.filter(element => element.deleted === true);
    deleted.forEach(f => arr.splice(arr.findIndex(element => element.deleted === f.deleted),1));
    return arr;
  }

  searching(e) {
    if (e.keyCode == 13) {
      var queryString = $('#searchQuery').val();
      //- send to Facebook Pixel
      if (location.hostname == 'www.blueplate.co') {
        fbq('track', 'Search', { search_string: queryString });
      }
      // excute searching when keyword longer than 2 characters
      if (queryString.length >= 2) {
        // create index search for dish_name
        const dishIndex = new Index({
            collection: Dishes,
            fields: ['dish_name'],
            name: 'dishIndex',
            engine: new MinimongoEngine({
                sort: () => { score: 1 }, // sort by score
            }),
        });
        // create index search for menu_name
        const menuIndex = new Index({
            collection: Menu,
            fields: ['menu_name'],
            name: 'menuIndex',
            engine: new MinimongoEngine({
                sort: () => { score: 1 }, // sort by score
            }),
        });
        // create index search for kitchen_name
        const kitchenIndex = new Index({
            collection: Kitchen_details,
            fields: ['kitchen_name'],
            name: 'kitchenIndex',
            engine: new MinimongoEngine({
                sort: () => { score: 1 }, // sort by score
            }),
        });
        // forming the result object
        var result = {
          dish: [],
          menu: [],
          kitchen: []
        }
        // filter again to remove all deleted item in array with search in minimongodb
        result.dish = this.removeDeletedItem(dishIndex.search(queryString).mongoCursor.fetch());
        result.menu = this.removeDeletedItem(menuIndex.search(queryString).mongoCursor.fetch());
        result.kitchen = this.removeDeletedItem(kitchenIndex.search(queryString).mongoCursor.fetch());
        Session.set('search_result', result);
        // get location of kitchens for map markers
        //- get unique kitchen id of 3 lists.
        let uniqueDishKitchen = [...new Set(result.dish.map(item => item.kitchen_id))];
        let uniqueMenuKitchen = [...new Set(result.menu.map(item => item.kitchen_id))];
        let uniqueKitchen = [...new Set(result.kitchen.map(item => item._id))];
        let kitchen_id_list = [...uniqueDishKitchen, ...uniqueMenuKitchen, ...uniqueKitchen];
        // concat 3 arrays and remove duplicated items
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
        Session.set('search_result_origin', result);
        Session.set('search_nearby', false);
        FlowRouter.go('/search#all');
      } else {
        Materialize.toast('Your keyword must longer than 1 characters',4000,"rounded bp-green");
      }
    }
  }

  handlePress = event => {
    if (event.which == 13) {
      this.handleSearch();
    }
  };

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillReceiveProps() {
    if (Profile_details.findOne({ user_id: Meteor.userId() })) {
      var profile_img = Profile_details.findOne({ user_id: Meteor.userId() }).profileImg;
      this.setState({
        avatar: !profile_img ? util.getDefaultFoodiesImage() : profile_img.large
      })
    } else {
      this.setState({
        avatar: util.getDefaultFoodiesImage()
      })
    }
  }

  nearby = () => {
    util.show_loading_progress();
    if( navigator.geolocation ) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition((position) => {
        // when success
        Session.set('search_nearby', true);
        Meteor.call('mapping.nearby', position.coords.latitude, position.coords.longitude, 10, (err, res) => {
          if (!err) {
            console.log(res);
            //- result store all result from get search nearby
            var result = {
              dish: [],
              menu: [],
              kitchen: []
            };
            result.kitchen = res;
            for (var i = 0; i < res.length; i++) {
              var single_dish = Dishes.findOne({ kitchen_id: res[i]._id, deleted: false });
              if (single_dish) {
                result.dish.push(single_dish);
              }
            }
            for (var j = 0; j < res.length; j++) {
              var single_menu = Menu.findOne({ kitchen_id: res[j]._id, deleted: false });
              if (single_menu) {
                result.menu.push(single_menu);
              }
            }
            Session.set('search_result', result);
            Session.set('search_result_origin', result);
            Session.set('list_kitchen_for_map', res);
            FlowRouter.go('/search#all');
            util.hide_loading_progress();
          } else {
            util.hide_loading_progress();
            Materialize.toast("No kitchen in your range.", 4000, 'rounded bp-red');
          }
        });
      }, (err) => {
        // when fail
        util.hide_loading_progress();
        Materialize.toast(err.message, 4000, 'rounded bp-green');
      });
    } else {
      util.hide_loading_progress();
      Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
    }
  }

  shouldComponentUpdate() {
    var credits = 0;
    Meteor.call('payment.getStripeBalance', (err, res) => {
      if (err) {
        var stripebalance = 0;
      } else {
        var stripebalance = parseFloat(res.account_balance / 100);
      }
      Meteor.call('payment.getCredits', (err, res) => {
        credits = res + stripebalance;
        var promotion_credits = 0;
        Meteor.call('promotion.check_history', (err, res) => {
          if (Object.keys(res).length > 0) {
            if (res) {
              promotion_credits = res.balance;
              if (!res) promotion_credits = 0;
              this.setState({
                credits: (parseFloat(promotion_credits.toString()) + parseFloat(credits.toString())).toFixed(2)
              });
            } else {
              this.setState({
                credits: (parseFloat(credits.toString())).toFixed(2)
              });
            }
          } else {
            this.setState({
              credits: credits
            });
          }
        });
      });
    });
    return true;
  }

  render() {
    var sidebarContent = this.renderSideBar();
    return (
      <div>
        <div className="nav_brand_logo">
          <div className="display-sidebar-menu" onClick={() => this.toggle()}>
            <img
              src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/list.svg"
              className="navbar_logo"
              height="20"
              width="20"
            />
          </div>
          <div
            onClick={() => this.handleGoHome()}
            className="display-main-page"
            data-activates="side_nav"
          >
            <img
              src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BPLogo_sysmbol.svg"
              className="navbar_logo"
              height="30"
              width="30"
            />
          </div>
        </div>
        <Sidebar
          sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={styles}
        >
          {this.state.search ? this.renderSearchPage() : ""}
            <div className="navbar-fixed z-depth-0">
              <nav className="z-depth-0">
                <div className="nav-wrapper white z-depth-0">
                  <ul className="left">
                    <li>
                      <input className="searchinput" placeholder="Try 'Muffin'" type="text" id="searchQuery" onKeyDown={(e) => this.searching(e)}/>
                    </li>
                    <li className="nearby waves-effect waves-light white" title="Nearby you" onClick={() => this.nearby()}>
                      <i className="material-icons bp-blue-text center-align">location_on</i>
                    </li>
                  </ul>
                  <ul className="right hide-on-small-only">
                    {
                      Meteor.userId() ?
                        (this.state.width <= 850) ?
                          <a style={{ display: 'inline-block'}} href="/deposit" target="_blank">
                            <li className = "center-align" style={{ color: '#717171', cursor: 'pointer', height: '40px', lineHeight: '43px', fontSize: '1.1em' }}>
                              $ {this.state.credits}
                            </li>
                          </a>
                        :
                          <a style={{ display: 'inline-block'}} href="/deposit" target="_blank">
                            <li className = "center-align" style={{ color: '#717171', cursor: 'pointer', height: '40px', lineHeight: '43px', fontSize: '1.1em' }}>
                              $ {this.state.credits} credits
                            </li>
                          </a>
                      :
                        ""
                    }

                    {
                      (Meteor.userId()) ? 
                        <li
                          onClick={() => {
                            //- send to Facebook Pixel
                            if (location.hostname == 'www.blueplate.co') {
                              fbq('trackCustom', 'ClickOnShoppingCartTopNav', { content_id: Meteor.userId() });
                            }
                            FlowRouter.go("/shopping_cart");
                          }}
                          className="icon"
                          id="cart-icon"
                        >
                          <span id="cart-number">
                            {this.props.shoppingCart.length}
                          </span>
                          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg" />
                        </li>
                      :
                      ""
                    }
                    {
                      (Meteor.userId()) ?
                        <li className="icon" onClick={() => this.openProfile()}>
                          <img style={{ width: '35px', height: '35px', borderRadius: '50%'}} src={this.state.avatar} />
                        </li>
                      :
                        <a id="login-text" href="#signup_modal" className="bp-blue-text">sign up</a>
                    }
                  </ul>
                </div>
              </nav>
            </div>
        </Sidebar>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe("getUserShoppingCart");
  const profile = Meteor.subscribe("theProfileDetail");
  if (Meteor.user()) {
    Meteor.subscribe('userData');
    Meteor.subscribe("theProfileDetail");
  }
  return {
    currentUser: Meteor.user(),
    loading: !handle.ready(),
    shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
    currentOrder: Order_record.find({'seller_id': Meteor.userId(), 'status': 'Created'}).fetch(),
    orderStatus: Order_record.find({'buyer_id': Meteor.userId(), 'status': 'Created'}).fetch()
  };
})(TopNavigation);

$(document).on('click', ".visted-color, .switch-foodie-text, .switch-chef-text", function() {
    $(".visted-color").children("span:nth-child(-n+1)").css("color","#212121");
    $('.your-kitchen-menu').css("color","#212121");

    if ( ($(this).attr('class') !== 'switch-foodie-text') && ( $(this).attr('class') !== 'switch-chef-text') ) {
      $(this).children("span:nth-child(-n+1)").css("color", "#56AACD");
    }

    if ($(this).attr('class') === 'switch-chef-text') {
        setTimeout(() => {
          $('.your-kitchen-menu').css("color", "#56AACD");
        }, 10);
    }
});
