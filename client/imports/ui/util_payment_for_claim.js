import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

export default class PaymentForClaim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    Meteor.call('claim.getListRequestForCS', (err, res) => {
      if (!err) {
          this.setState({
              history: res
          })
      }
    })
  }

  confirmPayForUser(id, user_id) {
    if (confirm("Please make sure you paid to chef before when click Yes on this popup.")) {
      Meteor.call('claim.confirmPay', id, user_id, (err, res) => {
        if (!err) {
          alert('Paid done!')
        }
      });
    }
  }

  renderListClaimRequest() {
    return this.state.history.map((item, index) => {
        var dateFormat = moment(item.createdAt).format('ddd Do MMMM YYYY');
        return (
            <tr key={index}>
                <td>{dateFormat}</td>
                <td>{item.placeholder_name}</td>
                <td>{item.bank_info}</td>
                <td>{item.bank_account_number}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td><button onClick={() => this.confirmPayForUser(item._id, item.user_id)} className="waves-effect waves-dark btn">Confirm</button></td>
            </tr>
        )
    })
  }

  render() {
    return (
      <div className="card section">
        <h5>Payment for chef/claim</h5>
        <span>
          Get list user in system doesn't have Stripe customer ID and init
          credits. Click generate button to auto generate Stripe ID and credits
          for users in list below.
        </span>
        <table className="striped highlight responsive-table">
          <thead>
            <tr>
              <th>Time request</th>
              <th>Placeholder name</th>
              <th>Bank Info</th>
              <th>Bank Account Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Confirm</th>
            </tr>
          </thead>

          <tbody>{this.renderListClaimRequest()}</tbody>
        </table>
      </div>
    );
  }
}
