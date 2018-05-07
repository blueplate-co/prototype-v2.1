import React, { Component } from "react";

export default class DashboardBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background: ''
    };
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    Meteor.call('getConfig',(err, res) => {
      this.setState({
        background: res.background,
        message: res.message
      })
    })
  }

  render() {
    return (
        <div className="card dashboard-banner" style={{ backgroundImage: "url(" + this.state.background + ")" }}>
        <h1 className="title">{ this.state.message }</h1>
        <div className="overlay"></div>
        </div>
    )
  }
}
