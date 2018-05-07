import React, { Component } from "react";

export default class DashboardBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_balance: "0",
      credits: 0,
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
      <div className="card dashboard-balance">
        <div className="infor-pane">
          <h5>
            Balance amount:{" "}
            <span className="price">{this.state.account_balance}</span>
          </h5>
          <h5>
            Credits amount: <span className="price">{this.state.credits}</span>
          </h5>
        </div>
        <div className="action-pane">
          <button>Claim </button>
          <button onClick={ () => window.open('/deposit','_blank')} >Add credits </button>
        </div>
      </div>
    );
  }
}
