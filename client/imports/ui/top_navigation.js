import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import Sidebar from 'react-sidebar';
import MultiSelectReact  from 'multi-select-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete';

const styles = {
    root : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
    },
    sidebar : {
        zIndex: 999,
        position: 'fixed',
        top: 0,
        bottom: 0,
        transition: 'transform .3s ease-out',
        WebkitTransition: '-webkit-transform .3s ease-out',
        willChange: 'transform',
        overflowY: 'auto',
        background: 'white',
        width: 300
    },
    content : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'initial',
        WebkitOverflowScrolling: 'touch',
        transition: 'left .3s ease-out, right .3s ease-out',
        zIndex: 990,
        height: 65
    },
    overlay : {
        zIndex: 995,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity .3s ease-out, visibility .3s ease-out',
        backgroundColor: 'rgba(0,0,0,.3)'
    },
    dragHandle : {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        bottom: 0
    }
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
        this.onChange = (address) => this.setState({ address })
        this.state = {
            sidebarOpen: false,
            search: false,
            address: '',
            lat: '',
            lng: '',
            multiSelect: [
                { id: 1, label: 'Delivery', value: 'Delivery' },
                { id: 2, label: 'Dine-in', value: 'Dine-in' },
                { id: 3, label: 'Pick-up', value: 'Pick-up' },
            ],
        }
    }

    openProfile = () => {
        FlowRouter.go('/profile');
    }

    onSetSidebarOpen = (open) => {
        this.setState({sidebarOpen: open});
    }

    toggle = () => {
        this.setState({sidebarOpen: true})
    }

    renderSideBar = () => {
        return (
            <ul className="sidebar-container">
                <li onClick={ () => { this.setState({ sidebarOpen: false }, () => { FlowRouter.go('/profile'); }) } } ><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/profile-icon.svg"/></li>
                <li onClick={ () => { this.setState({ sidebarOpen: false }, () => { FlowRouter.go('/main'); }) } }>
                    <span>Search food</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/search-icon.svg"/></li>
                <li className="divider"></li>
                <li onClick={ () => { this.setState({ sidebarOpen: false }, () => { FlowRouter.go('/shopping_cart'); }) } } >
                    <span>Shopping cart</span>
                    <span id="cart-number-sidebar">{ this.props.shoppingCart.length }</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg"/></li>
                <li>
                    <span>Notification</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/notification.svg"/></li>
                <li>
                    <span>Wishlist</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Heart.svg"/></li>
                <li>
                    <span>Order Status</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/OrderStatus.svg"/></li>
                <li className="divider"></li>
                <li>
                    <span>Switch to cooking</span><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Switch.svg"/></li>
                <li className="divider"></li>
                <li>
                    <span>Help</span>
                </li>
                <li onClick={ () => Meteor.logout(() => { FlowRouter.go('/') }) } >
                    <span>Logout</span>
                </li>
            </ul>
        )
    }

    searching = () => {
        this.setState({
            search: !this.state.search,
            sidebarOpen: false
        });
        $('html').css('overflow', 'hidden');
    }

    optionClicked = (optionsList) => {
        this.setState({ multiSelect: optionsList });
    }

    selectedBadgeClicked = (optionsList) => {
        this.setState({ multiSelect: optionsList });
    }

    renderMultiSelect = () => {
        const selectedOptionsStyles = {
            color: "#444343",
            backgroundColor: "#fff"
        };
        const optionsListStyles = {
            backgroundColor: "#fff",
            color: "#444343"
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
    }

    handleSearch = () => {
        var self = this;
        geocodeByAddress(this.state.address)
            .then(results => results[0])
            .then(place => {
                self.setState({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },() => {
                    let service = [];
                    self.state.multiSelect.map((item, index) => {
                        if (item.value !== false) {
                            service.push(item.value);
                        }
                    })
                    let date = document.getElementById('date').value;
                    let time = document.getElementById('time').value;
                    debugger
                    Meteor.call('searching', self.state.lat, self.state.lng, service, date, time, (error, result) => {
                        if (!error) {
                            // console.log(result);
                        } else {
                            Materialize.toast("Error! " + error, "rounded bp-green");
                        }
                    });
                })
            })
            .catch(error => console.error('Error', error))
    }

    handlePress = (event) => {
        if (event.which == 13) {
            this.handleSearch();
        }
    }

    renderSearchPage = () => {
        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
        }
        return (
            <div className="search-page-container">
                <span className="fa fa-times close-modal" onClick={ () =>  { this.setState({ search: false }); $('html').css('overflow', 'auto')} }></span>
                <div className="container">
                    <div className="row">
                        <div onKeyPress = { this.handlePress } className="search-form col l6 offset-l3 m10 offset-m1 s12">
                            <div className="col s12">
                                <PlacesAutocomplete inputProps={inputProps} />
                            </div>
                            <div className="input-field col s12">
                                {
                                    this.renderMultiSelect()
                                }
                            </div>
                            <div className="input-field col s12">
                                <input id="date" type="date" placeholder="date"/>
                            </div>
                            <div className="input-field col s12">
                                <input id="time" type="number" placeholder="time"/>
                            </div>
                            <div className="input-field col s12 text-center">
                                <button onClick={ this.handleSearch } id="search-btn">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                {
                    (this.state.search) ?
                        this.renderSearchPage()
                    :   ""
                }
                <div className="">
                    <div className="navbar-fixed z-depth-0">
                        <nav className = "z-depth-0">
                            <div className="nav-wrapper white z-depth-0">
                                <a href="" onClick={ () => this.toggle() } className="nav_brand_logo left" data-activates="side_nav"><img src="/navbar/BPLogo_sysmbol.svg" className="navbar_logo" height="40" width="40" /></a>
                                <ul className="right">
                                    <li className="icon" onClick={ () => this.openProfile() } >
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/profile-icon.svg" />
                                    </li>
                                    <li onClick={() => FlowRouter.go('/shopping_cart')} className="icon" id="cart-icon">
                                        <span id="cart-number">{ this.props.shoppingCart.length }</span>
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/cart-icon.svg" />
                                    </li>
                                    <li onClick={ () => this.searching() } className="icon" id="search-icon">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/search-icon.svg" />
                                    </li>
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
    const handle = Meteor.subscribe('getUserShoppingCart');
    return {
        currentUser: Meteor.user(),
        loading: !handle.ready(),
        shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch()
    };
})(TopNavigation);
