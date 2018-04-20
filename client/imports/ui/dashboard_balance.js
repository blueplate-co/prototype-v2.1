import React, { Component } from "react";

export default class DashboardBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_balance: "0",
      credits: 0
    };
  }

  numberWithCommas = x => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  getStripeBalance() {
    let self = this;
    Meteor.call("payment.getStripeBalance", (err, response) => {
      self.setState({
        account_balance: this.numberWithCommas(
          parseInt(response.account_balance) / 100
        ),
      });
    });
    Meteor.call("payment.getCredits", (err, response) => {
      self.setState({
        credits: response,
      });
    });
  }

  componentDidMount() {
    this.getStripeBalance();
  }

  render() {
    return (
        <div className="col l8 m12 s12 dashboard-block-wrapper amount-wrapper">
            <h5>Balance amount: <span className="price">{this.state.account_balance}</span></h5>
            <h5>Credits amount: <span className="price">{this.state.credits}</span></h5>
        </div>
    )
  }
}
