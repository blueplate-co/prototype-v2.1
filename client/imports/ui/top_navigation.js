import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "rc-time-picker/assets/index.css";

import Sidebar from "react-sidebar";
import MultiSelectReact from "multi-select-react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, geocodeByPlaceId } from "react-places-autocomplete";
import TimePicker from "rc-time-picker";
import moment from "moment";

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
    this.renderMultiSelect = this.renderMultiSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.onChange = address => this.setState({ address });
    this.state = {
      sidebarOpen: false,
      search: false,
      address: "",
      lat: null,
      lng: null,
      time: "",
      width: window.innerWidth,
      status: "Search",
      multiSelect: [
        { id: 1, label: "Delivery", value: "Delivery" },
        { id: 2, label: "Dine-in", value: "Dine-in" },
        { id: 3, label: "Pick-up", value: "Pick-up" },
      ],
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

  searching = () => {
    this.setState(
      {
        search: !this.state.search,
        sidebarOpen: false,
      },
      () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setTimeout(() => {
          $("html").css("overflow", "hidden");
        }, 200);
        $("[role=navigation]").height("100%");
      }
    );
  };

  optionClicked = optionsList => {
    this.setState({ multiSelect: optionsList });
  };

  selectedBadgeClicked = optionsList => {
    this.setState({ multiSelect: optionsList });
  };

  changeTime = value => {
    this.setState({
      time: value._d,
    });
  };

  renderMultiSelect = () => {
    const selectedOptionsStyles = {
      color: "#444343",
      backgroundColor: "#fff",
    };
    const optionsListStyles = {
      backgroundColor: "#fff",
      color: "#444343",
    };
    return (
      <MultiSelectReact
        options={this.state.multiSelect}
        optionClicked={this.optionClicked.bind(this)}
        selectedBadgeClicked={this.selectedBadgeClicked.bind(this)}
        selectedOptionsStyles={selectedOptionsStyles}
        optionsListStyles={optionsListStyles}
      />
    );
  };

  handleSearch = () => {
    var self = this;
    let service = [];

    //- limit the records
    let limit = {};
    limit.from = 0;
    limit.to = 2;

    this.setState({
      status: "Searching",
    });

    self.state.multiSelect.map((item, index) => {
      if (item.value !== false) {
        service.push(item.label);
      }
    });
    let date = document.getElementById("date").value;
    let keyword = document.getElementById("keyword").value;
    if (this.state.address.trim().length > 0) {
      geocodeByAddress(this.state.address)
        .then(results => results[0])
        .then(place => {
          self.setState(
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            () => {
              // debugger
              Meteor.call(
                "searching",
                self.state.lat,
                self.state.lng,
                service,
                date,
                this.state.time,
                keyword,
                (error, result) => {
                  if (!error) {
                    Session.set("advanced_search_results", result);
                    this.setState(
                      {
                        search: false,
                      },
                      () => {
                        $("html").css("overflow", "auto");
                        this.setState({
                          status: "Search",
                        });
                        FlowRouter.go("/search");
                      }
                    );
                  } else {
                    console.log("location found");

                    Materialize.toast("Error! " + error, "rounded bp-green");
                  }
                }
              );
            }
          );
        })
        .catch(error => console.error("Error", error));
    } else {
      if ("geolocation" in navigator) {
        var etimeout = setTimeout(() => {
          // when user not enter location, block geolocation
          clearTimeout(etimeout);
          Meteor.call(
            "searching",
            null,
            null,
            service,
            date,
            this.state.time,
            keyword,
            (error, result) => {
              if (!error) {
                Session.set("advanced_search_results", result);
                $("html").css("overflow", "auto");
                this.setState({
                  status: "Search",
                });
                FlowRouter.go("/search");
              } else {
                Materialize.toast("Error! " + error, "rounded bp-green");
              }
            }
          );
        }, 8000);

        navigator.geolocation.getCurrentPosition(
          position => {
            // when user not enter location, allow geolocation
            clearTimeout(etimeout);
            Meteor.call(
              "searching",
              position.coords.latitude,
              position.coords.longitude,
              service,
              date,
              this.state.time,
              (error, result) => {
                if (!error) {
                  Session.set("advanced_search_results", result);
                  this.setState(
                    {
                      search: false,
                    },
                    () => {
                      $("html").css("overflow", "auto");
                      FlowRouter.go("/search");
                      this.setState({
                        status: "Search",
                      });
                    }
                  );
                } else {
                  Materialize.toast("Error! " + error, "rounded bp-green");
                }
              }
            );
          },
          () => {
            // when user not enter location, block geolocation
            clearTimeout(etimeout);
            Meteor.call(
              "searching",
              null,
              null,
              service,
              date,
              this.state.time,
              (error, result) => {
                if (!error) {
                  Session.set("advanced_search_results", result);
                  this.setState(
                    {
                      search: false,
                    },
                    () => {
                      $("html").css("overflow", "auto");
                      FlowRouter.go("/search");
                      this.setState({
                        status: "Search",
                      });
                    }
                  );
                } else {
                  Materialize.toast("Error! " + error, "rounded bp-green");
                }
              }
            );
          },
          { timeout: 5000 }
        );
      } else {
        // when browser not support geolocation
        Materialize.toast(
          "Geolocation is not supported by this browser.",
          "rounded bp-green"
        );
        debugger;
      }
    }
  };

  handlePress = event => {
    if (event.which == 13) {
      this.handleSearch();
    }
  };

  renderSearchPage = () => {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    };
    var curr = new Date();
    curr.setDate(curr.getDate());
    var date = curr.toISOString().substr(0, 10);
    return (
      <div className="search-page-container">
        <span
          className="fa fa-times close-modal"
          onClick={() => {
            this.setState({ search: false });
            $("html").css("overflow", "auto");
            $("[role=navigation]").height("65px");
          }}
        />
        <div className="container">
          <div className="row">
            <div
              onKeyPress={this.handlePress}
              className="search-form col l6 offset-l3 m10 offset-m1 s12"
            >
              <div className="col s12">
                <input
                  id="keyword"
                  type="text"
                  placeholder="Keyword"
                />
              </div>
              <div className="col s12">
                <PlacesAutocomplete inputProps={inputProps} />
              </div>
              <div className="input-field col s12">
                {this.renderMultiSelect()}
              </div>
              <div className="input-field col s12">
                <input
                  defaultValue={date}
                  id="date"
                  type="date"
                  placeholder="date"
                />
              </div>
              <div className="input-field col s12">
                <TimePicker
                  showSecond={true}
                  className=""
                  onChange={this.changeTime}
                />
              </div>
              <div className="input-field col s12 text-center">
                <button
                  disabled={this.state.status == "Searching"}
                  onClick={this.handleSearch}
                  id="search-btn"
                >
                  {this.state.status}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
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
                  <li
                    onClick={() => this.searching()}
                    className="icon"
                    id="search-icon"
                  >
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/search-icon.svg" />
                  </li>
                  {
                    (this.state.width <= 450) ?
                      <a style={{ display: 'inline-block' }} href="/deposit" target="_blank"><li style={{ color: '#717171', cursor: 'pointer', marginTop: '-7px', marginRight: '20px', fontSize: '1.1em' }}>$ {this.props.credits}</li></a>
                    :
                      <a style={{ display: 'inline-block' }} href="/deposit" target="_blank"><li style={{ color: '#717171', cursor: 'pointer', marginTop: '-7px', marginRight: '20px', fontSize: '1.1em' }}>$ {this.props.credits} credits</li></a>
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
  var credits = 0;
  if (Meteor.user()) {
    Meteor.subscribe('userData');
    credits = Meteor.user().credits;
  }
  return {
    currentUser: Meteor.user(),
    credits: credits,
    loading: !handle.ready(),
    shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
  };
})(TopNavigation);
