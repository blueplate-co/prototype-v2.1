import React, { Component } from "react";

import DashboardBanner from "../ui/dashboard_banner";
import DashboardBalance from "../ui/dashboard_balance";
import TotalViews from "../ui/total_views";
import TopSelling from "../ui/top_selling";
import TotalSales from "../ui/total_sales";
import Conversions from "../ui/conversion";
import OrderSummary from "../ui/ordersummary";
import Support from "../ui/support";
import DashboardSummary from "../ui/dashboard_summary";

export default class Dashboard extends Component {

  render() {
    return (
      <div>
        <div className="container">
          <h1 className="welcome">Hi chef. Welcome back!</h1>
          <div className="cards">
            <DashboardBanner />
            <DashboardBalance />
            <TotalViews />
            <TopSelling />
            <TotalSales />
            <Conversions />
            <OrderSummary />
            <Support />
            <DashboardSummary />
            {/* <DashboardBalance />
          <TotalViews />
          <TotalSales />
          <Conversions />
          <OrderSummary />
          <DashboardSummary /> */}
          </div>
        </div>
      </div>
    );
  }
}
