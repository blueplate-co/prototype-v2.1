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
