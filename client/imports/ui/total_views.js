import React, { Component } from "react";

export default class TotalViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0,
    };
  }

  componentDidMount() {
    Meteor.call("total.views", (error, result) => {
      return this.setState({ view: result });
    });
  }

  render() {
    return (
      <div className="col l3 offset-l1 m12 s12 dashboard-block-wrapper totalviews_wrapper">
        <div className="totalview-content">
          <p>total views:</p>
          <h5>{this.state.view}</h5>
        </div>
      </div>
    );
  }
}
