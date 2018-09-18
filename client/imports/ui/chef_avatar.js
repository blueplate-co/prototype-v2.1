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

  componentWillMount = () => {
    let kitchen_details = Kitchen_details.find({ user_id: this.props.userId }, { limit: 1 }).fetch();
    if (kitchen_details.length > 0 && kitchen_details[0].profileImg) {
      this.setState({
        profileImages: kitchen_details[0].profileImg.origin,
        kitchenId: kitchen_details[0]._id
      })
    } else if (kitchen_details.length > 0) {
      var chef_avatar = kitchen_details[0].profileImg != undefined ? kitchen_details[0].profileImg.origin : util.getDefaultChefImage();

      this.setState({
        profileImages: chef_avatar,
        kitchenId: kitchen_details[0]._id
      });
    }
  }

  componentWillReceiveProps = () => {
    let kitchen_details = Kitchen_details.find({ user_id: this.props.userId }, { limit: 1 }).fetch();
    if (kitchen_details.length > 0 && kitchen_details[0].profileImg) {
      this.setState({
        profileImages: kitchen_details[0].profileImg.origin,
        kitchenId: kitchen_details[0]._id
      })
    } else if (kitchen_details.length > 0) {
      var chef_avatar = kitchen_details[0].profileImg != undefined ? kitchen_details[0].profileImg.origin : util.getDefaultChefImage();

      this.setState({
        profileImages: chef_avatar,
        kitchenId: kitchen_details[0]._id
      });
    }

  }

  kitchenLink = () => {
    return '/kitchen/' + this.state.kitchenId;
  }

  render() {
    return (
        (!this.state.profileImages)
        ?
            <div className="chef-avatar-container"></div>
        :
            <a className="chef-avatar-container close-modal" 
              style={{ backgroundImage: `url( ${ this.state.profileImages } )` }} 
              onClick={() => {$('.modal-overlay').remove(); FlowRouter.go(this.kitchenLink())}}>

            </a>
    );
  }

}
