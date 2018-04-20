import React, { Component } from 'react';

import DashboardBalance from '../ui/dashboard_balance';
import TotalViews from '../ui/total_views';
import TotalSales from '../ui/total_sales';
import Conversions from '../ui/conversion';
import OrderSummary from '../ui/ordersummary';

export default class Dashboard extends Component {

  render() {
    return(
        <div className="row">
            <div className="row">
                <DashboardBalance />
                <TotalViews />
            </div>
            <div className="row">
                <TotalSales />
            </div>
            <div className="row">
                <Conversions />
                <OrderSummary />
            </div>
        </div>
    );
  }
}