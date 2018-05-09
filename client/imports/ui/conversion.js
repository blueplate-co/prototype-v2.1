import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Conversions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewsPerSales: 0,
    };
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  componentDidMount() {
    Meteor.call("dashboard.salesCount", (err, response) => {
      if (!err) {
        var sales = response;
        Meteor.call("total.views", (error, result) => {
          var views = result;
          this.setState({
            viewsPerSales: this.precisionRound((sales / views) * 100, 2)
          });
        });
      }
    });
  }

  render() {
    return (
      <div className="card dashboard-conversion">
        <div className="totalview-content">
          <h6>Conversions Funnel</h6>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
          <ul className="list-fields">
            <li>search</li>
            <li>views</li>
            <li>sales</li>
          </ul>
          <span className="viewsPerSales">{this.state.viewsPerSales} %</span>
        </div>
      </div>
    );
  }
}
