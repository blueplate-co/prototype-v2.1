import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

import PaymentGenerator from '../ui/util_payment_generator';
import SellingPriceGenerator from '../ui/util_selling_price_generator';
import PaymentForClaim from '../ui/util_payment_for_claim';
import BonusForStaff from '../ui/util_bonus_for_staff';

export default class Util extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Meteor.call("util.check_logged_user", (err, res) => {
      var email = res.emails[0].address;
      if ((email !== 'trang.nguyen@blueplate.co') && (email !== 'michael.lin@blueplate.co')) {
          alert('Only 2 admins from Blueplate can access that');
          window.location.href = "/";
      } else {
        $('#chat-panel').remove();
      }
    });
  }

  render() {
    return (
      <div>
          {/* <PaymentGenerator />
          <SellingPriceGenerator />
          <PaymentForClaim /> */}
          <BonusForStaff/>
      </div>
    );
  }
}
