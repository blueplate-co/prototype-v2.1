import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    Meteor.call("dashboard.ordersummary", (err, response) => {
      this.setState({
        data: response,
      });
    });
  }

  renderList() {
    return (
      <ul>
        <li><span className="dot pending"></span> { this.state.data.pending } pending orders</li>
        <li><span className="dot confirmed"></span> { this.state.data.confirmed } confirmed orders</li>
        <li><span className="dot completed"></span> { this.state.data.completed } completed orders</li>
        <li><span className="dot rejected"></span> { this.state.data.rejected } rejected orders</li>
      </ul>
    );
  }

  render() {
    return (
      <div className="card dashboard-summaryorder">
        <div className="ordersummary_content">
          <h5>Orders</h5>
          {this.renderList()}
        </div>
      </div>
    );
  }
}
