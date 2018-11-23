import React, { Component } from 'react';
import SearchMap from '../search_map';
import SearchPageForm from '../search_page_form/search_page_form';
import SearchPageFormMobile from '../search_page_form_mobile/search_page_form_mobile';
import ChefItem from '../chef_card_item/chef_card_item';
import BouncingLoader from '../bouncing_loader/bouncing_loader';
import './search_page.css';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.handleChangeUrl = this.handleChangeUrl.bind(this);
        this.toggleMap = this.toggleMap.bind(this);
        this.generateClassList = this.generateClassList.bind(this);
        this.state = {
            serving_option: '',
            district: '',
            loading: true,
            data: [],
            lat: '',
            lng: '',
            width: window.innerWidth,
            showMap: true
        }
    }

    handleChangeUrl(district, serving_option) {
        this.fetchData(district, serving_option);
    }

    toggleMap() {
        this.setState({
            showMap: !this.state.showMap
        })
    }

    fetchData(district, serving_option) {
        this.setState({ loading: true })
        Meteor.call('searchingKitchenByDistrict', district, serving_option, (err, res) => {
            if (!err) {
                if( navigator.geolocation ) {
                    // Call getCurrentPosition with success and failure callbacks
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.setState({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            loading: false,
                            data: res
                        })
                    }, (err) => {
                        // when fail
                        this.setState({
                            loading: false,
                            data: res
                        })
                        Materialize.toast(err.message, 4000, 'rounded bp-green');
                    });
                } else {
                    this.setState({
                        loading: false,
                        data: res
                    })
                    Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
                }
            } else {
                this.setState({
                    loading: false,
                    data: res
                })
                Materialize.toast('Oops! Error when searching. Please try again. ' + err, 4000, 'rounded bp-green');
            }
        });
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }
    
    handleWindowSizeChange = () => {
        this.setState({ widthWindow: window.innerWidth });
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        setTimeout(() => {
            var self = this;
            let url = new URL(location.href);
            let serving_option = url.searchParams.get("option");
            let district = url.searchParams.get("district");
            this.setState({
                serving_option: serving_option,
                district: district
            },() => {
                this.fetchData(district, serving_option);
            });
        }, 500);
    }

    renderListResult() {
        if (this.state.data.length == 0) {
            return (
                <div className="no-dishes-container">
                    <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/no_dishes_emotion.png" />
                    <p>Sorry! There’re have no kitchen to show, you can try another place.</p>
                </div>
            )
        } else {
            return this.state.data.map((item) => {
                return <ChefItem key={item.kitchen_details[0]._id} id={item.kitchen_details[0]._id} name={item.kitchen_details[0].kitchen_name} rating={item.kitchen_details[0].average_rating} banner={item.kitchen_details[0].bannerProfileImg} tags={item.kitchen_details[0].kitchen_tags} location={item.kitchen_details[0].kitchen_address_conversion} currentLat={this.state.lat} currentLng={this.state.lng} />
            });
        }
    }

    generateClassList() {
        var width = window.innerWidth;
        if (width > 992) {
            if (this.state.showMap) {
                return "col l8 m12 s12 list-result";
            } else {
                return "col l12 m12 s12 list-result";
            }
        } else {

        }
        if (width < 992 && width > 600) {
            if (this.state.showMap) {
                return "col l8 m12 s12 list-result inline-list";
            } else {
                return "col l12 m12 s12 list-result";
            }
        }
        if (width < 600) {
            if (this.state.showMap) {
                return "col l8 m12 s12 list-result";
            } else {
                return "col l12 m12 s12 list-result";
            }
        }
    }

    render() {
        return (
            <div className="search-page-container">
                <div className="row col l12 m12 s12 result-container">
                    <SearchPageForm serving_option={this.state.serving_option} district={this.state.district} changeUrl={this.handleChangeUrl} toggleMap={this.toggleMap}/>
                    <SearchPageFormMobile serving_option={this.state.serving_option} district={this.state.district} changeUrl={this.handleChangeUrl} toggleMap={this.toggleMap}/>
                    <div className={this.generateClassList()}>
                    {
                        (this.state.loading) ? (
                            <BouncingLoader />
                        ) : (
                            this.renderListResult()
                        )
                    }
                    </div>
                </div>
                <div className="col l4 m12 s12 map-container">
                    {
                        (this.state.showMap) ? <SearchMap data={this.state.data} /> : null
                    }
                </div>
            </div>
        )
    }
}