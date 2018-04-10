import React, { Component } from 'react';

export default class TotalViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0
    }
  }

  componentDidMount() {
    Meteor.call('total.views', (error, result) => {
      return this.setState({view:result});
    })
  }

  render() {
    return(
        <div className = 'valign-wrapper' style = {{ height: '100%' }}>
        <div className = 'col l12 m12 s12'>
            <p>total views:</p>
            <h1>{this.state.view}</h1>
        </div>
        </div>
    );
  }
}
