import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Mongo } from "meteor/mongo";
import { Session } from "meteor/session";

import Rating from "./rating";
import ProgressiveImages from "./progressive_image";
import ChefAvatar from "./chef_avatar";
import Like from "./like_button";

import { navbar_find_by } from "./../../../imports/functions/find_by";

// App component - represents the whole app
class KitchenSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  renderList = () => {
    if (this.props.kitchens.length == 0) {
      return <p>Has no dishes to be displayed</p>;
    }
    let hasThumbnail;
    return this.props.kitchens.map((item, index) => {
      if (item.banner.length > 0) {
        hasThumbnail = true;
      }
      return (
        <a key={index} href={'/kitchen/' + item.id} target="_blank">
          <div
            className="col xl2 l2 m3 s6 modal-trigger dish-wrapper"
            onClick={() => this.handleClick(item)}
          >
            <div className="images-thumbnail" style={{ background: "#ccc" }}>
              <Like type="dish" id={item._id} />
              {hasThumbnail ? (
                <ProgressiveImages
                  large={item.banner}
                  small={item.banner}
                />
              ) : (
                ""
              )}
            </div>
            <div
              className="row no-margin text-left"
              style={{ position: "relative" }}
            >
              <h5 className="dish-title">{item.kitchen_name}</h5>
            </div>
          </div>
        </a>
      );
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
