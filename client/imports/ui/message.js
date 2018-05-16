import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Mongo } from "meteor/mongo";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import Rating from "./rating";
import ProgressiveImages from "./progressive_image";

// App component - represents the whole app
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
        display: false
    }
  }

  toggleDisplay() {
    if (this.state.display) {
      $('#chat-panel').css('bottom', '-335px');
    } else {
      $('#chat-panel').css('bottom', '0px');
    }
    this.setState({
      display: !this.state.display
    })
  }

  // render list of user are joining into chat panel
  renderListJoiner() {
    return (
      <ul className="chat-list-user">
        <li
          className="chat-user active"
          style={{
            backgroundImage: `url(https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/82_jftih2zo.jpg)`,
          }}
        />
        <li
          className="chat-user"
          style={{
            backgroundImage: `url(https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/244_jftdwfnb.jpg)`,
          }}
        />
      </ul>
    );
  }

  renderProgress() {
    return (
      <div className="progress-bar">
        <span className="progressing" style={{ width: "85%" }} />
        <span className="progressing-time">0 hour 5 mins</span>
      </div>
    );
  }

  renderListMessage() {
    return  (
        <div className="list-message">
            <ul>
                <li className="status">
                    Start conversation with Noel
                </li>
                <li className="message sender">
                    Hello. It's me. I need a pasta dish with chilli pepper instead of tomatoes. 🙌
                </li>
                <li className="message receiver">
                    Ok. What size of pasta dish do you want?
                </li>
                <li className="message receiver">
                    And would you like some vegetables 🥗?
                </li>
                <li className="message sender">
                    Yes, please.
                </li>
            </ul>
        </div>
    );
  }

  renderMessageTyping() {
    return (
        <div className="typing-container">
            <input type="text" placeholder="Type a message here" />
            <span title="send message" id="send-message"><img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/send-message-icon.svg" /></span>
        </div>
    );
  }

  render() {
    return (
      <div className="col chat-panel-wrapper">
        <div onClick={() => { this.toggleDisplay() }}  className="chat-header">
          <span className="chat-header-name">Noel</span>
          <span id="support-icon" title="Contact support">
            <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/support-icon.svg" />
          </span>
        </div>
        <div className="chat-content-wrapper">
          {this.renderProgress()}
          {this.renderListJoiner()}
          {this.renderListMessage()}
          {this.renderMessageTyping()}
        </div>
      </div>
    );
  }
}

export default withTracker(props => {
  var all_messages = [];
  var all_conversation = [];
  Meteor.call('message.getConversation', (err, res) => {
    all_conversation = res;
    if (all_conversation.length > 0) {
      Meteor.call('getMessages', (err, res) => {
        if (!err) {
          all_messages = res;
        } else {
          alert('Error when get all messages');
        }
      });
    }
  });
  return {
    currentUser: Meteor.user(),
    conversation: all_conversation,
    messages: all_messages
  };
})(Message);
