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
      display: false,
      conversation: 0,
    };
  }

  toggleDisplay() {
    if (this.state.display) {
      $("#chat-panel").css("bottom", "-335px");
    } else {
      $("#chat-panel").css("bottom", "0px");
    }
    this.setState({
      display: !this.state.display,
    });
  }

  // get list user joining chat
  getListJoiner() {
    let tempFriends = [];
    this.props.conversation.map((item, index) => {
      for (var i = 0; i < item.participants.length; i++) {
        if (item.participants[i] !== Meteor.userId()) {
          var profile = Kitchen_details.findOne({
            user_id: item.participants[i],
          });
          if (tempFriends.length == 0) {
            tempFriends.push(profile);
          } else {
            // remove duplicate conversation user
            for (var m = 0 ; m < tempFriends.length; m++) {
              if (profile._id !== tempFriends[m]._id) {
                tempFriends.push(profile);
              }
            }
          }
        }
      }
    });
    return tempFriends;
  }

  sendMessage(e) {
    if (e.charCode == 13) {
      var message = $('#message-content').val();
      // get info about current conversation
      var conversation = Conversation.findOne({
        _id: Session.get('current_conservation')
      });
      // get userid of receiver id
      var receiverId = conversation.participants.filter((id) => {
        return id != Meteor.userId()
      })[0];
  
      Meteor.call('message.createMessage', Meteor.userId(), receiverId, message, Session.get('current_conservation'), (err, res) => {
        if (!err) {
          $('#message-content').val("");
        }
      })
    }
  }

  // render list of user are joining into chat panel
  renderListJoiner() {
    let tempFriends = this.getListJoiner();
    return (
      <ul className="chat-list-user">
        {tempFriends.map((item, index) => {
          return (
            <li
              key={index}
              className="chat-user active"
              title={item.chef_name}
              style={{
                backgroundImage: `url(${item.profileImg.origin})`,
              }}
            />
          );
        })}
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
    if (this.props.messages.length == 0) {
      return (
        <ul style={{ height: '205px' }}></ul>
      )
    } else {
      return (
        <div className="list-message">
          <ul style={{ height: '205px' }}>
            {
              this.props.messages[Session.get('current_conservation_index')].map((item, index) => {
                switch (item.type) {
                  case 'status':
                    return (
                      <li key={index} className="status">{ item.message }</li>
                    )
                    break;
                  case 'message':
                    return (
                      (item.sender_id == Meteor.userId()) ? <li key={index} className="message sender">{ item.message }</li> : <li key={index} className="message receiver">{ item.message }</li>
                    )
                }
              })
            }
          </ul>
        </div>
      );
    }
  }

  renderMessageTyping() {
    return (
      <div className="typing-container">
        <input type="text" id="message-content" placeholder="Type a message here" onKeyPress={ e => this.sendMessage(e) } />
        <span title="send message" id="send-message">
          <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/send-message-icon.svg" />
        </span>
      </div>
    );
  }

  render() {
    var chef_name = 'Chat';
    if (Session.get('current_conservation')) {
      var conversation = Conversation.findOne({
        _id: Session.get('current_conservation')
      });
      // get userid of receiver id
      var receiverId = conversation.participants.filter((id) => {
        return id != Meteor.userId()
      })[0];
  
      var profile = Kitchen_details.findOne({
        user_id: receiverId
      });
      chef_name = profile.chef_name;
    }
    return (
      <div className="col chat-panel-wrapper">
        <div
          onClick={() => {
            this.toggleDisplay();
          }}
          className="chat-header"
        >
          <span className="chat-header-name">{ chef_name }</span>
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
  const handleConversation = Meteor.subscribe("theConversations");
  const handleMessages = Meteor.subscribe("theMessages");

  var all_messages = [];
  var all_conversation = [];

  // get all conversation
  all_conversation = Conversation.find({
    participants: Meteor.userId(),
  }).fetch();

  if (all_conversation.length > 0) {
    Session.set('current_conservation', all_conversation[0]._id);
    Session.set('current_conservation_index', 0);
  }

  for (var i = 0; i < all_conversation.length; i++) {
    var message = Messages.find({
      conversation_id: all_conversation[i]._id,
    }).fetch();
    all_messages.push(message);
  }

  return {
    currentUser: Meteor.user(),
    conversation: all_conversation,
    messages: all_messages,
  };
})(Message);
