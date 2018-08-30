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
      avatar: ''
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
        
        <li className="not-cursor">
          <img id="foodie-logo-mode-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Group_logo.svg" />
        </li>
        <li className="not-cursor">
          <span id="menu-foodie-mode-title">Foodie Mode</span>
          <img id="foodies-title-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BP_icon_20180312_Eat-20.svg" width="61px" height="62px" />
        </li>

        <li className="switch-mode-text"
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "chef");
            // setTimeout(() => {
            //   this.setState({ sidebarOpen: false });
            // }, 200);
            FlowRouter.go("/cooking/dishes");
          }}
        >
          <span className="foodies-mod-text">Switch to cooking</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch.svg" />
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
          { (this.props.orderStatus.length > 0)
            ?
              <span className="notification-status"></span>
            :
              ""
           }
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/OrderStatus.svg" />
        </li>

        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              FlowRouter.go("/shopping_cart");
              //- send to Facebook Pixel
              fbq('trackCustom', 'ClickOnShoppingCartSidebar', { content_id: Meteor.userId() });
              this.setState({ sidebarOpen: false }, () => {
                FlowRouter.go("/shopping_cart");
              });
            });
          }}
        >
          <span className="bp-blue-text">Shopping cart</span>
          <span id="cart-number-sidebar">{this.props.shoppingCart.length}</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg" />
        </li>

        <li className="switch-mode-text">
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

        <li className="not-cursor">
          <img id="chef-logo-mode-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Group_logo.svg" />
        </li>

        <li className="not-cursor">
          <span id="menu-chef-mode-title">Chef Mode</span>
          <img id="chef-title-img" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch+Copy.svg" />
        </li>

        <li className="switch-mode-text"
          onClick={() => {
            this.setState({ sidebarOpen: false });
            localStorage.setItem("userMode", "foodie");
            FlowRouter.go("/main");
          }}
        >
          <span>Switch to foodie</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch.svg" />
        </li>
        
        <li
          onClick={() => {
            this.setState({ sidebarOpen: false }, () => {
              this.checkKitchenProfileExists();
            });
          }}
        >
          <span>Your Kitchen</span>
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/kitchen_profile_sidebar.svg" />
        </li>

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
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/oven.svg" />
        </li>

        <li className="switch-mode-text">
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

  removeDeletedItem(arr) {
    let deleted = arr.filter(element => element.deleted === true);
    deleted.forEach(f => arr.splice(arr.findIndex(element => element.deleted === f.deleted),1));
    return arr;
  }

  searching(e) {
    if (e.keyCode == 13) {
      var queryString = $('#searchQuery').val();
      //- send to Facebook Pixel
      fbq('track', 'Search', { search_string: queryString });
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
        // result.dish = dishIndex.search(queryString).mongoCursor.fetch();
        // result.menu = menuIndex.search(queryString).mongoCursor.fetch();
        // result.kitchen = kitchenIndex.search(queryString).mongoCursor.fetch();
        // filter again to remove all deleted item in array with search in minimongodb
        result.dish = this.removeDeletedItem(dishIndex.search(queryString).mongoCursor.fetch());
        result.menu = this.removeDeletedItem(menuIndex.search(queryString).mongoCursor.fetch());
        result.kitchen = this.removeDeletedItem(kitchenIndex.search(queryString).mongoCursor.fetch());
        Session.set('search_result', result);
        Session.set('search_result_origin', result);
        FlowRouter.go('/search');
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
      this.setState({
        avatar: Profile_details.findOne({ user_id: Meteor.userId() }).profileImg.large
      })
    }
  }

  componentDidMount() {
    var credits = 0;
    Meteor.call('payment.getStripeBalance', (err, res) => {
      if (err) {
        var stripebalance = 0;
      } else {
        var stripebalance = parseFloat(res.account_balance / 100).toFixed(2);
      }
      Meteor.call('payment.getCredits', (err, res) => {
        credits = parseFloat(parseFloat(res) + parseFloat(stripebalance)).toFixed(2);
        this.setState({
          credits: credits
        });
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
                    {/* <button className="btn nearby">Nearby</button> */}
                  </li>
                </ul>
                <ul className="right">
                  <li className="icon" onClick={() => this.openProfile()}>
                    {
                      (this.state.avatar) ?
                        <img style={{ width: '35px', height: '35px', borderRadius: '50%', marginTop: '5px' }} src={this.state.avatar} />
                      :
                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/profile-icon.svg" />
                    }
                  </li>

                  <li
                    onClick={() => {
                      //- send to Facebook Pixel
                      fbq('trackCustom', 'ClickOnShoppingCartTopNav', { content_id: Meteor.userId() });
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
  const profile = Meteor.subscribe("theProfileDetail");
  if (Meteor.user()) {
    Meteor.subscribe('userData');
    Meteor.subscribe("theProfileDetail");
    var credits = Meteor.user().credits;
  }
  return {
    currentUser: Meteor.user(),
    credits: credits,
    loading: !handle.ready(),
    shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
    currentOrder: Order_record.find({'seller_id': Meteor.userId(), 'status': 'Created'}).fetch(),
    orderStatus: Order_record.find({'buyer_id': Meteor.userId(), 'status': 'Created'}).fetch()
  };
})(TopNavigation);
