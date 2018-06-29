import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Mongo } from "meteor/mongo";
import { Session } from "meteor/session";

import KitchenCard from './kitchen_card';

import { navbar_find_by } from "./../../../imports/functions/find_by";

// App component - represents the whole app
class KitchenSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  renderList = () =>
    return this.props.kitchens.map((item, index) => {
      return (
        <div key = {index}>
          <KitchenCard
            bannerProfileImg = {item.bannerProfileImg}
            kitchenId = {item._id}
            userId = {item.user_id}
            kitchenName = {item.kitchen_name}
            chefName = {item.chef_name}
            averageRating = {item.average_rating}
            orderCount = {item.order_count}
          />
        </div>
      )
    });
  };

  render() {
    return (
      <div className="col s12 m12 l12 no-padding list-container">
        {/* title */}
        <div className="row">
          <div className="col s6 m6 l6 no-padding">
            <h5>{this.props.title}</h5>
          </div>
          <div className="col s6 m6 l6 text-right no-padding">
            <a>{this.props.seemore}</a>
          </div>
        </div>

        {/* list items */}
          <div className="row">
            {this.props.listLoading ? (
              <span>...loading</span>
            ) : (
              this.renderList()
            )}
          </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe("theKitchenDetail");
  var kitchen_results = [];
  if (Session.get("advanced_search_results")) {
    for (var i = 0; i < Session.get("advanced_search_results").length; i++) {
      var kitchen = {
        id: "",
        kitchen_name: "",
        banner: "",
      };
      kitchen.id = Session.get("advanced_search_results")[i]._id;
      kitchen.kitchen_name = Session.get("advanced_search_results")[i].kitchen_name;
      if (Session.get("advanced_search_results")[i].bannerProfileImg) {
        kitchen.banner = Session.get("advanced_search_results")[i].bannerProfileImg.origin;
      } else {
        kitchen.banner = "";
      }
      kitchen_results.push(kitchen);
    }
  }
  return {
    currentUser: Meteor.user(),
    listLoading: !handle.ready(),
    kitchens: kitchen_results,
  };
})(KitchenSearchList);
