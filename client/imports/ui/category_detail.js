import React, { Component } from 'react';
import ChefItem from '../ui/chef_card_item/chef_card_item';

export default class Category_detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            chefs: []
        }
    }

    componentDidMount() {
        Meteor.call('chef_categories.getInfoById', this.props.id, (err, res) => {
            if (!err) {
                this.setState({
                    data: res
                }, () => {
                    Meteor.call('chef_categories.get', this.state.data.categories_name,(err, res) => {
                        if (!err) {
                            this.setState({
                                chefs: res
                            })
                        }
                    });
                });
            }
        });
    }

    renderListDish() {
        return this.state.chefs.map((item) => {
          return <ChefItem key={item._id} id={item._id} name={item.kitchen_name} rating={item.average_rating} banner={item.bannerProfileImg} tags={item.kitchen_tags} location={item.kitchen_address_conversion} currentLat={this.state.lat} currentLng={this.state.lng} />
        });
    }

    render() {
        return (
            <div>
                <div className="category_banner" style={{ backgroundImage: "url(" + this.state.data.banner + ")" }}>
                    <div className="shadow-mask"></div>
                    <div className="container">
                        <h1>{this.state.data.categories_name}</h1>
                        <h4>{this.state.data.description}</h4>
                    </div>
                </div>
                <div className="container list-chef-wrapper">
                    { this.renderListDish() }
                </div>
            </div>
        );
    }
}
