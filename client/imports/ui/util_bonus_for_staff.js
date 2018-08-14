import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

class BonusForStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: []
        };
    }

    submit(event) {
        let email = $('#email').val();   
        let amount = $('#amount').val();
        if (email.indexOf('@blueplate.co') > -1 && parseInt(amount) > 0) {
            // deposit to user
            Meteor.call('util.giveBonusForStaff', email, amount, (error, response) => {
                if (error) {
                    // if error
                    Materialize.toast(error.message, 4000, 'rounded bp-green');
                } else {
                    // do something
                    Materialize.toast('Transfer completed. Please refresh the page to see result.', 4000, 'rounded bp-green');
                }
            });
        } else {
            // email is not in blueplate
            if (email.indexOf('@blueplate.co') == -1) {
                Materialize.toast('Oops! This feature only worked with Blueplate account email.', 4000, 'rounded bp-green');
            }
            // amount
            if (parseInt(amount) <= 0) {
                Materialize.toast('Oops!. Amount must be greater than 0.', 4000, 'rounded bp-green');
            }
        }
    }

    renderListBonusHistory() {
        return this.props.history.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{item.email}</td>
                    <td>{item.amount}</td>
                    <td>{item.date.toString()}</td>
                </tr>
            )
        });
    }

    render() {
        return (
            <div className="card section">
                <h5>Bonus For Staff</h5>
                <span>Give credit to internal staff: create an internal function to help admin give credits to internal staff and save log history.</span>
                <input id="email" type="email" placeholder="Email address" />
                <input id="amount" type="number" placeholder="Amount" />
                <button className="btn" onClick={(e) => this.submit(e)} >Submit</button>
                <h3>Total amount: {this.props.sum}</h3>
                <table className="highlight">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderListBonusHistory() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTracker(props => {
    const handle = Meteor.subscribe("theBonusHistory");
    var history = Bonus_history.find({}).fetch();
    var sum = 0;
    for (var i = 0; i < history.length; i++) {
        sum += parseInt(history[i].amount);
    }
    return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      history: history,
      sum: sum
    };
  })(BonusForStaff);
