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
      <div className="col l6 m12 s12 dashboard-block-wrapper conversion_wrapper">
        <div className="totalview-content">
          <h6>Conversions</h6>
          <p>views - sales</p>
          {this.state.viewsPerSales} %
        </div>
      </div>
    );
  }
}
