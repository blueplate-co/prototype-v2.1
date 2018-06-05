import React, { Component } from 'react';

// App component - represents the whole app
export default class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rating: parseInt(this.props.rating)
    }
  }

  render() {
    return (
        <span className="rating-container">
            <span className={ (this.props.rating >= 1) ? "fa fa-star checked " : "fa fa-star empty" }></span>
            <span className={ (this.props.rating >= 2) ? "fa fa-star checked " : "fa fa-star empty" }></span>
            <span className={ (this.props.rating >= 3) ? "fa fa-star checked " : "fa fa-star empty" }></span>
            <span className={ (this.props.rating >= 4) ? "fa fa-star checked " : "fa fa-star empty" }></span>
            <span className={ (this.props.rating >= 5) ? "fa fa-star checked " : "fa fa-star empty" }></span>
        </span>
    );
  }
}
