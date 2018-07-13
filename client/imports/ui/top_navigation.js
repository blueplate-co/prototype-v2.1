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
      credits: 0
    };
  }

  openProfile = () => {
    if (Profile_details.findOne({ user_id: Meteor.userId() })) {
      FlowRouter.go("/profile/edit_foodie_profile");
    } else {
      FlowRouter.go("/profile");
    }
  };

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: open });
  };

  toggle = () => {
    this.setState({ sidebarOpen: true });
  };

  checkKitchenProfileExists = () => {
    if (Kitchen_details.findOne({ user_id: Meteor.userId() })) {
      FlowRouter.go("/profile/show_homecook_profile");
    } else {
      FlowRouter.go("/profile/create_homecook_profile");
    }
  };

  renderSideBar = () => {
    return localStorage.getItem("userMode") == "foodie" ? (
      <ul className="sidebar-container">
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/main");
            });
          }}
        >
          <span>Search food</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/search-icon.svg" />
        </li>
        <li className="divider" />

        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/shopping_cart");
            });
          }}
        >
          <span>Shopping cart</span>
          <span id="cart-number-sidebar">{this.props.shoppingCart.length}</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg" />
        </li>
        <li>
          <span>Notification</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/notification.svg" />
        </li>

        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/wish-list");
            });
          }}
        >
          <span>Wishlist</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Heart.svg" />
        </li>

        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/orders_tracking");
            });
          }}
        >
          <span>Order Status</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/OrderStatus.svg" />
        </li>

        <li className="divider" />
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "chef");
            setTimeout(() => {
              this.setState({ sidebarOpen: true });
            }, 300);
          }}
        >
          <span>Switch to cooking</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch.svg" />
        </li>
        <li className="divider" />
        <li>
          <span>Help</span>
        </li>
        <li
          onClick={() =>
            Meteor.logout(() => {
              FlowRouter.go("/");
            })
          }
        >
          <span>Logout</span>
        </li>
      </ul>
    ) : (
      <ul className="sidebar-container">
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/main");
            });
          }}
        >
          <span>Search food</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/search-icon.svg" />
        </li>
        <li className="divider" />
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "foodie");
            setTimeout(() => {
              this.setState({ sidebarOpen: true });
            }, 300);
          }}
        >
          <span>Switch to foodie</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch.svg" />
        </li>
        <li className="divider" />
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/dashboard");
            });
          }}
        >
          <span>Dashboard</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/dashboard.svg" />
        </li>
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              this.checkKitchenProfileExists();
            });
          }}
        >
          <span>Kitchen profile</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/profile-icon.svg" />
        </li>
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/dishes");
            });
          }}
        >
          <span>Manage dishes</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/manage-dish.svg" />
        </li>
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/menus");
            });
          }}
        >
          <span>Manage menus</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/manageManage.svg" />
        </li>

        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/cooking/orders");
            });
          }}
        >
          <span>Manage orders</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/oven.svg" />
        </li>

        <li className="divider" />
        <li>
          <span>Help</span>
        </li>
        <li
          onClick={() =>
            Meteor.logout(() => {
              FlowRouter.go("/");
            })
          }
        >
          <span>Logout</span>
        </li>
      </ul>
    );
  };

  searching(e) {
    if (e.keyCode == 13) {
      var queryString = $('#searchQuery').val();
      // excute searching when keyword longer than 2 characters
      if (queryString.length > 2) {
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
        result.dish = dishIndex.search(queryString).mongoCursor.fetch();
        result.menu = menuIndex.search(queryString).mongoCursor.fetch();
        result.kitchen = kitchenIndex.search(queryString).mongoCursor.fetch();
        Session.set('search_result', result);
        FlowRouter.go('/search');
      } else {
        Materialize.toast('Your keyword must longer than 2 characters',4000,"rounded bp-green");
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

  componentDidMount() {
    var credits = 0;
    Meteor.call('payment.getStripeBalance', (err, res) => {
      if (err) {
        var stripebalance = 0;
      } else {
        var stripebalance = parseFloat(res.account_balance / 100).toFixed(2);
      }
      credits = parseFloat(parseFloat(this.props.credits) + parseFloat(stripebalance)).toFixed(2);
      this.setState({
        credits: credits
      });
    });
  }

  render() {
    var sidebarContent = this.renderSideBar();

    return (
      <Sidebar
        sidebar={sidebarContent}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={styles}
      >
        {this.state.search ? this.renderSearchPage() : ""}
        <div className="">
          <div className="navbar-fixed z-depth-0">
            <nav className="z-depth-0">
              <div className="nav-wrapper white z-depth-0">
                <a
                  href=""
                  onClick={() => this.toggle()}
                  className="nav_brand_logo left"
                  data-activates="side_nav"
                >
                  <img
                    src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BPLogo_sysmbol.svg"
                    className="navbar_logo"
                    height="40"
                    width="40"
                  />
                  <i className =
                    {this.state.sidebarOpen
                      ?
                      "material-icons bp-blue-text right nav_brand_logo nav_logo_arrow rotate"
                      :
                      "material-icons bp-blue-text right nav_brand_logo nav_logo_arrow"}
                  >keyboard_arrow_down</i>
                </a>
                <ul className="left">
                  <li>
                    <input className="searchinput" placeholder="Try 'Muffin'" type="text" id="searchQuery" onKeyDown={(e) => this.searching(e)}/>
                    <button className="btn nearby">Nearby</button>
                  </li>
                </ul>
                <ul className="right">
                  <li className="icon" onClick={() => this.openProfile()}>
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/profile-icon.svg" />
                  </li>

                  <li
                    onClick={() => FlowRouter.go("/shopping_cart")}
                    className="icon"
                    id="cart-icon"
                  >
                    <span id="cart-number">
                      {this.props.shoppingCart.length}
                    </span>
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg" />
                  </li>
                  {
                    (this.state.width <= 450) ?
                      <a style={{ display: 'inline-block', marginTop: '10px' }} href="/deposit" target="_blank"><li className = "center-align" style={{ color: '#717171', cursor: 'pointer', height: '40px', lineHeight: '48px', fontSize: '1.1em' }}>$ {this.state.credits}</li></a>
                    :
                      <a style={{ display: 'inline-block', marginTop: '10px' }} href="/deposit" target="_blank"><li className = "center-align" style={{ color: '#717171', cursor: 'pointer', height: '40px', lineHeight: '48px', fontSize: '1.1em' }}>$ {this.state.credits} credits</li></a>
                  }
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </Sidebar>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe("getUserShoppingCart");
  if (Meteor.user()) {
    Meteor.subscribe('userData');
    var credits = Meteor.user().credits;
  }
  return {
    currentUser: Meteor.user(),
    credits: credits,
    loading: !handle.ready(),
    shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
  };
})(TopNavigation);
