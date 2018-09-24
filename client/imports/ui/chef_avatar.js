import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class ChefAvatar extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  kitchenLink = () => {
    return '/kitchen/' + this.props.kitchenId;
  }

  render() {
    return (
        (!this.props.profileimages)
        ?
            <div className="chef-avatar-container"></div>
        :
            <a className="chef-avatar-container close-modal" 
              style={{ backgroundImage: `url( ${ this.props.profileimages } )` }} 
              onClick={() => {$('.modal-overlay').remove(); FlowRouter.go(this.kitchenLink())}}>

            </a>
    );
  }

}
