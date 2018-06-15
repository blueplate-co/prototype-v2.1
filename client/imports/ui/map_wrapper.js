import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';

import MapContainer from './map_container';

class MapWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Meteor.call("util.check_logged_user", (err, res) => {
      var email = res.emails[0].address;
      if (email.indexOf('@blueplate.co') === -1) {
          alert('Only account from Blueplate can access that');
          window.location.href = "/";
      } else {
        $('#chat-panel').remove();
      }
    });
  }

  render() {
    return (
      <MapContainer kitchens = {this.props.kitchens} />
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('theKitchenDetail')
  var kitchen_info = Kitchen_details.find({}).fetch();
  return {
    loading: !handle.ready(),
    kitchens: kitchen_info
  }
})(MapWrapper)
