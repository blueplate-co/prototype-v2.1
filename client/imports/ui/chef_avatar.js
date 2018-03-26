import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';


export default class ChefAvatar extends Component {

  constructor(props) {
    super(props);
    this.state = {
        
    }
  }

  componentWillMount = () => {
    let avatar = profile_images.find({ userId: this.props.userId }, { limit: 1 }).fetch();
    if (avatar.length > 0) {
      this.setState({
        profileImages: avatar[0].meta.base64
      })
    }
  }

  render() {
    return (
        (!this.state.profileImages)
        ?
            <div className="chef-avatar-container"></div>
        :
            <div className="chef-avatar-container" style={{ backgroundImage: `url( ${ this.state.profileImages } )` }}></div>
    );
  }

}