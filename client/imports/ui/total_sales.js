import React, { Component } from "react";

export default class TotalSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      by: "dishes",
      total_by_dishes: "0",
      total_by_menus: "0",
    };
  }

  componentDidMount() {
    Meteor.call("dashboard.totalSales", (err, response) => {
      this.setState({
        total_by_dishes: response.dish,
        total_by_menus: response.menu,
      });
    });
  }

  changeOption(type) {
    this.setState({
      by: type,
    });
  }

  render() {
    return (
      <div className="col l4 m12 s12 dashboard-block-wrapper totalsales_wrapper">
        <div className="wrapper_content">
          <ul className="list-option">
            <li
              className={this.state.by == "dishes" ? "active" : ""}
              onClick={() => this.changeOption("dishes")}
            >
              by dishes
            </li>
            <li
              className={this.state.by == "menus" ? "active" : ""}
              onClick={() => this.changeOption("menus")}
            >
              by menus
            </li>
          </ul>
          <div className="row" style={{ marginTop: '30px', padding: '0px 20px' }}>
            <span>total sales:</span>
            {this.state.by == "dishes" ? (
              <h5>${this.state.total_by_dishes}</h5>
            ) : (
              <h5>${this.state.total_by_menus}</h5>
            )}
          </div>
        </div>
      </div>
    );
  }
}
