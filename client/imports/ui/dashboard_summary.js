import React, { Component } from "react";

export default class DashboardSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "dishes",
      dishes: [],
      menus: [],
      orders: [],
    };
  }

  componentDidMount() {
    Meteor.call("dashboard.summarydishes", (err, response) => {
      if (!err) {
        this.setState({
          dishes: response,
        });
      }
    });
    Meteor.call("dashboard.summarymenu", (err, response) => {
      if (!err) {
        this.setState({
          menus: response,
        });
      }
    });
    Meteor.call("dashboard.summaryorder", (err, response) => {
      if (!err) {
        this.setState({
          orders: response,
        });
      }
    });
  }

  renderContentTable() {
    switch (this.state.current) {
      case "dishes":
        return this.state.dishes.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.views}</td>
              <td>{item.likes}</td>
              <td>{item.orders}</td>
              <td>{item.rating}</td>
            </tr>
          );
        });
        break;
      case "menus":
        return this.state.menus.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.views}</td>
              <td>{item.likes}</td>
              <td>{item.orders}</td>
              <td>{item.rating}</td>
            </tr>
          );
        });
        break;
      case "orders":
        return this.state.orders.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.foodie}</td>
              <td>{item.status}</td>
              <td>{item.amount}</td>
            </tr>
          );
        });
        break;
    }
  }

  renderTable() {
    switch (this.state.current) {
      case "dishes":
        return (
          <table className="responsive-table highlight">
            <thead>
              <tr>
                <th>Name</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Orders</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>{this.renderContentTable()}</tbody>
          </table>
        );
        break;
      case "menus":
        return (
          <table className="responsive-table highlight">
            <thead>
              <tr>
                <th>Name</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Orders</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>{this.renderContentTable()}</tbody>
          </table>
        );
        break;
      case "orders":
        return (
          <table className="responsive-table highlight">
            <thead>
              <tr>
                <th>Date</th>
                <th>Dish/Menu name</th>
                <th>Foodie name</th>
                <th>Status</th>
                <th>Order Amount</th>
              </tr>
            </thead>
            <tbody>{this.renderContentTable()}</tbody>
          </table>
        );
        break;
    }
  }
  render() {
    return (
      <div className="col l12 m12 s12 dashboard-block-wrapper summary_wrapper">
        <div className="wrapper_content">
          <h5>Summary</h5>
          <ul>
            <li
              className={this.state.current == "dishes" ? "active" : ""}
              onClick={() => this.setState({ current: "dishes" })}
            >
              Dishes
            </li>
            <li
              className={this.state.current == "menus" ? "active" : ""}
              onClick={() => this.setState({ current: "menus" })}
            >
              Menus
            </li>
            <li
              className={this.state.current == "orders" ? "active" : ""}
              onClick={() => this.setState({ current: "orders" })}
            >
              Order History
            </li>
          </ul>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}
