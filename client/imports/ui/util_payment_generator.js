import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

class PaymentGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  renderListUser() {
    if (this.state.users.length > 0) {
      return <span>No result</span>;
    } else {
      return this.state.users.map((item, index) => {
        return (
          <tr key={index}>
            <td>{item._id}</td>
            <td>{item.emails[0].address}</td>
          </tr>
        );
      });
    }
  }

  generate() {
    if (confirm("Please make sure you back-up we database before run it.")) {
      // Save it!
      this.state.users.map((item, index) => {
        Meteor.call(
          "util.generateUserPayment",
          item.emails[0].address,
          item._id,
          (err, res) => {
            if (!err) {
              var users = this.state.users;
              users.filter(user => {
                return user._id !== item._id;
              });
              this.setState({
                users: users,
              });
              Materialize.toast(
                "Generated for email " + item.emails[0].address,
                4000,
                "rounded bp-green"
              );
            } else {
              alert("Error was found. Please check again");
            }
          }
        );
      });
    } else {
      // Do nothing!
    }
  }

  componentDidMount() {
    Meteor.call("util.get_list_no_payment", (err, res) => {
      this.setState({
        users: res,
      });
    });
  }

  render() {
    return (
      <div className="card section">
        <h5>Payment generator</h5>
        <span>
          Get list user in system doesn't have Stripe customer ID and init
          credits. Click generate button to auto generate Stripe ID and credits
          for users in list below.
        </span>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>{this.renderListUser()}</tbody>
        </table>
        <button
          onClick={() => this.generate()}
          style={{ marginTop: "30px", width: "250px", float: "right" }}
          className="waves-effect waves-dark btn"
          type="button"
        >
          Generate
        </button>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe("userData");
  return {
    currentUser: Meteor.user(),
    listLoading: !handle.ready(),
  };
})(PaymentGenerator);
