import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

import PaymentGenerator from '../ui/util_payment_generator';
import SellingPriceGenerator from '../ui/util_selling_price_generator';

export default class Util extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Meteor.call("util.check_logged_user", (err, res) => {
      var email = res.emails[0].address;
      if (email.indexOf('@blueplate.co') === -1) {
          alert('Only account from Blueplate can access that');
          window.location.href = "/";
      } else {
        $('#chat-panel').remove();
      }
    });
  }

  render() {
    return (
      <div>
          <PaymentGenerator />
          <SellingPriceGenerator />
      </div>
    );
  }
}
