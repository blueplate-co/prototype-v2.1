import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import KitchenCard from './kitchen_card';

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
      return <p>Has no kitchen to be displayed</p>
    }
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
    })
  }

  renderResultTitle = () => {
    if (Session.get('search_nearby')) {
      if (Session.get('search_result').kitchen.length > 20) {
        let overNumber = Session.get('search_result').kitchen.length - (Session.get('search_result').kitchen.length % 5);
        return 'Over ' + overNumber + '+ results around you';
      } else {
        return Session.get('search_result').kitchen.length + ' kitchens results around you';
      }
    }
    if (Session.get('search_result')) {
      let keywork = $('#searchQuery').val();
      if (Session.get('search_result').kitchen.length > 20) {
        let overNumber = Session.get('search_result').kitchen.length - (Session.get('search_result').kitchen.length % 5);
        return 'Over ' + overNumber + '+ results for ' + '"'+ keywork +'"';
      } else {
        return Session.get('search_result').kitchen.length + ' kitchens results for ' + '"'+ keywork +'"';
      }
    } else {
      return 'Kitchens';
    }
  }

  render() {
    return (
      <div className="col s12 m12 l12 no-padding list-container">
        {/* title */}
        <div className="row">
          <div className="col s12 m12 l6 no-padding">
            <h5>{this.renderResultTitle()}</h5>
          </div>
        </div>

        {/* list items */}
          <div className="row">
            {this.props.listLoading ? (
              <span>Your favorite kitchen are searching...</span>
            ) : (
              this.renderList()
            )}
          </div>
      </div>
    );
  }
}

export default withTracker(props => {
  var kitchen_results = [];
  if (Session.get('search_result')) {
    for (var i = 0; i < Session.get('search_result').kitchen.length; i++) {
      kitchen_results.push(Session.get('search_result').kitchen[i]);
    }
  }
  return {
      currentUser: Meteor.user(),
      kitchens: kitchen_results,
  };
})(KitchenSearchList);
