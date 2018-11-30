import React, { Component } from 'react';
import DishCardItem from '../dish_card_item/dish_card_item';
import ChefItem from '../chef_card_item/chef_card_item';
import BouncingLoader from '../bouncing_loader/bouncing_loader';
import { Index, MinimongoEngine } from 'meteor/easy:search'
import './finding.css';

export default class Finding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            loading: true,
            data: [],
            lat: '',
            lng: ''
        }
    }

    removeDeletedItem(arr) {
        let deleted = arr.filter(element => element.deleted === true);
        deleted.forEach(f => arr.splice(arr.findIndex(element => element.deleted === f.deleted),1));
        return arr;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        setTimeout(() => {
            let url = new URL(location.href);
            let keyword = url.searchParams.get("keyword");
            this.setState({
                keyword: keyword
            },() => {
                if (this.state.keyword.length >= 2) {
                    // create index search for dish_name
                    var dishIndex = new Index({
                        collection: Dishes,
                        fields: ['dish_name'],
                        name: 'dishIndex',
                        engine: new MinimongoEngine({
                            sort: () => { score: 1 }, // sort by score
                        })
                    });
                    // create index search for menu_name
                    var menuIndex = new Index({
                        collection: Menu,
                        fields: ['menu_name'],
                        name: 'menuIndex',
                        engine: new MinimongoEngine({
                            sort: () => { score: 1 }, // sort by score
                        })
                    });
                    // create index search for kitchen_name
                    var kitchenIndex = new Index({
                        collection: Kitchen_details,
                        fields: ['kitchen_name'],
                        name: 'kitchenIndex',
                        engine: new MinimongoEngine({
                            sort: () => { score: 1 }, // sort by score
                        })
                    });
                    // filter again to remove all deleted item in array with search in minimongodb
                    let dishes = this.removeDeletedItem(dishIndex.search(this.state.keyword).mongoCursor.fetch());
                    let menus = this.removeDeletedItem(menuIndex.search(this.state.keyword).mongoCursor.fetch());
                    let kitchens = this.removeDeletedItem(kitchenIndex.search(this.state.keyword).mongoCursor.fetch());
                    this.setState({
                        dishes: dishes,
                        menus: menus,
                        kitchens: kitchens,
                        loading: false
                    })
                }
            });
        }, 500);
        if( navigator.geolocation ) {
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            }, (err) => {
                // when fail
                Materialize.toast(err.message, 4000, 'rounded bp-green');
            });
        } else {
            Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
        }
    }

    render() {
        return (
            <div className="search-page-container">
                <div className="row col l12 m12 s12">
                    {
                        (this.state.loading) ? (
                            <BouncingLoader />
                        ) : (
                            <div>
                                <ListDishResult dishes={this.state.dishes} keyword={this.state.keyword} />
                                <ListKitchenResult kitchens={this.state.kitchens} keyword={this.state.keyword} lat={this.state.lat} lng={this.state.lng} />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

class ListDishResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="result-container">
                {
                    (this.props.dishes.length == 0) ? (
                        <div className="no-dishes-container">
                            <h4>{this.props.dishes.length} dishes results for "{this.props.keyword}"</h4>
                            <p style={{ fontWeight: 'bold' }}>Sorry! There’re have no dishes to show, you can try another keywords.</p>
                        </div>
                    ) : (
                        <div>
                            <h4>{this.props.dishes.length} dishes results for "{this.props.keyword}"</h4>
                            <div className="result-list-container">
                                {
                                    this.props.dishes.map((item) => {
                                        return (
                                            <DishCardItem key={item._id} id={item._id} name={item.dish_name} rating={item.average_rating} banner={(item.meta) ? item.meta.medium : null} tags={item.dish_tags} price={item.dish_selling_price} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

class ListKitchenResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="result-container">
                {
                    (this.props.kitchens.length == 0) ? (
                        <div className="no-dishes-container">
                            <h4>{this.props.kitchens.length} kitchens results for "{this.props.keyword}"</h4>
                            <p style={{ fontWeight: 'bold' }}>Sorry! There’re have no kitchens to show, you can try another keywords.</p>
                        </div>
                    ) : (
                        <div>
                            <h4>{this.props.kitchens.length} kitchens results for "{this.props.keyword}"</h4>
                            <div className="result-list-container">
                                {
                                    this.props.kitchens.map((item) => {
                                        return (
                                            <ChefItem key={item._id} id={item._id} name={item.kitchen_name} rating={item.average_rating} banner={item.bannerProfileImg} tags={item.kitchen_tags} location={item.kitchen_address_conversion} currentLat={this.props.lat} currentLng={this.props.lng} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}