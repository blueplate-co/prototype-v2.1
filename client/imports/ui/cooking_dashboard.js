import React, { Component } from 'react';
import TotalViews from './total_views';
import CsBanner from './cs_banner';
import ShowroomBanner from './showroom_banner';

export default class CookingDashboard extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="container">
        <h1 className="welcome">Hi Chef! Welcome back!</h1>
        <div className="row">
          <div className="col s12 m12 l12 xl12">
            <ShowroomBanner />
          </div>
        </div>


        <div className="row">
          <div className="col s12 m8 l8 xl8">
            <div className="card-panel balance">current balance</div>
          </div>

          <div className="col s12 m4 l4 xl4">
            <div className="card-panel view" id="view">
              <TotalViews />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m4 l4 xl4">
            <div className="card-panel top-selling-menu">top selling menu</div>
          </div>
          <div className="col s12 m8 l8 xl8">
            <div className="card-panel total-sales">total sales</div>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m8 l8 xl8">
            <div className="card-panel conversion">conversion</div>
          </div>
          <div className="col s12 m4 l4 xl4">
            <div className="card-panel order">order</div>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m7 l7 xl7">
            <div className="card-panel demographics">buyer demographics</div>
          </div>
          <div className="col s12 m5 l5 xl5">
            <CsBanner />
          </div>
        </div>

        <div className="row">
          <div className="col card-panel table s12 m12 l12 xl12">
            <table className="responsive-table">
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Item Name</th>
                    <th>Item Price</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>A</td>
                  <td>E</td>
                  <td>$0.87</td>
                </tr>
                <tr>
                  <td>A</td>
                  <td>J</td>
                  <td>$3.76</td>
                </tr>
                <tr>
                  <td>Jo</td>
                  <td>L</td>
                  <td>$7.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
