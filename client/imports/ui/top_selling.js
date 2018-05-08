import React, { Component } from "react";

export default class TopSelling extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list: []
    }
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount() {
    Meteor.call("dashboard.topselling", (err, response) => {
      this.setState({
        list: response,
      });
    });
  }

  renderList() {
    return this.state.list.map((item, index) => {
        return (
            <li key={index}>
                <span className="thumbnail" style={{background: "url(" + item.meta.large + ")"}}></span>
                <span className="dish-title">{item.dish_name}</span>
                <span className="order-count">{item.order_count}</span>
            </li>
        )
    });
  }

  render() {
    return (
      <div className="card dashboard-topselling">
        <h1>Top Selling Dishes</h1>
        <ul className="list-dishes">{this.renderList()}</ul>
      </div>
    );
  }
}
