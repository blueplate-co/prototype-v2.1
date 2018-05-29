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
    this.callSupport = this.callSupport.bind(this);
    this.state = {
      display: false,
      conversation: 0,
    };
  }

  toggleDisplay() {
    if (this.state.display) {
      $("#chat-panel").css("bottom", "-350px");
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
      // renderlist conversation
      if (Meteor.userId() == item.buyer_id) {
        // current user is buyer in current conversation. Get info of opponent. Opponent is kitchen profile
        var profile = Kitchen_details.findOne({
          "user_id": item.seller_id
        });
        tempFriends.push(profile);
      } else {
        // current user is seller in current conversation. Get info of opponent. Opponent is foodie profile
        var profile = Profile_details.findOne({
          "user_id": item.buyer_id
        });
        tempFriends.push(profile);
      }
    });
    return tempFriends;
  }

  // call for support, send SMS to him
  callSupport() {}

  sendMessage(e) {
    if (e.charCode == 13) {
      var message = $("#message-content").val();
      var receiverId = '';

      // get info about current conversation
      var conversation = Conversation.findOne({
        _id: Session.get("current_conservation"),
      });

      if (Meteor.userId() == conversation.buyer_id) {
        // current user is buyer in current conversation. Get info of opponent. Opponent is kitchen profile
        var receiverId = Kitchen_details.findOne({
          "user_id": conversation.seller_id
        }).user_id;
      } else {
        // current user is seller in current conversation. Get info of opponent. Opponent is foodie profile
        var receiverId = Profile_details.findOne({
          "user_id": conversation.buyer_id
        }).user_id;
      }

      Meteor.call(
        "message.createMessage",
        Meteor.userId(),
        receiverId,
        message,
        Session.get("current_conservation"),
        (err, res) => {
          if (!err) {
            $("#message-content").val("");
          }
        }
      );
    }
  }

  // render list of user are joining into chat panel
  renderListJoiner() {
    let tempFriends = this.getListJoiner();
    return (
      <ul className="chat-list-user">
        {tempFriends.map((item, index) => {
          if (item.chef_name) {
            // Opponent is chef, current user is foodie
            var chefId = item.user_id;
            var foodieId = Meteor.userId();
            var conversationId = Conversation.findOne({
              buyer_id: foodieId,
              seller_id: chefId
            })._id;
          } else {
            // Opponent is foodie, current user is chef
            var chefId = Meteor.userId();
            var foodieId = item.user_id;
            var conversationId = Conversation.findOne({
              buyer_id: foodieId,
              seller_id: chefId
            })._id;
          }
          return (
            <li
              key={index}
              className="chat-user active"
              title={item.chef_name}
              onClick={ () => { Session.set('current_conservation', conservationId); Session.set('current_conservation_index', index );  }}
              style={{
                backgroundImage: `url(${item.profileImg.origin})`,
              }}
            />
          );
        })}
      </ul>
    );
  }

  renderListMessage() {
    if (this.props.messages.length == 0) {
      return (
        <div id="list-message-body" className="list-message">
          <ul style={{ height: "225px" }} />
        </div>
      );
    } else {
      return (
        <div id="list-message-body" className="list-message">
          <ul style={{ height: "225px" }}>
            {this.props.messages[Session.get("current_conservation_index")].map(
              (item, index) => {
                switch (item.type) {
                  case "status":
                    return (
                      <li key={index} className="status">
                        {item.message}
                      </li>
                    );
                    break;
                  case "message":
                    return item.sender_id == Meteor.userId() ? (
                      <li key={index} className="message sender">
                        {item.message}
                      </li>
                    ) : (
                      <li key={index} className="message receiver">
                        {item.message}
                      </li>
                    );
                }
              }
            )}
          </ul>
        </div>
      );
    }
  }

  renderMessageTyping() {
    return (
      <div className="typing-container">
        <input
          type="text"
          id="message-content"
          placeholder="Type a message here"
          onKeyPress={e => this.sendMessage(e)}
        />
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages !== this.props.messages) {
    }
  }

  componentDidMount() {
    // make scrollbar always at bottom when receive new message
    var messageBody = document.querySelector("#list-message-body");
    messageBody.scrollTop = messageBody.scrollHeight;
  }

  render() {
    // generator name of chat
    var name = "Chat";
    if (Session.get("current_conservation")) {
      var conversation = Conversation.findOne({
        _id: Session.get("current_conservation"),
        available: true
      });

      if (Meteor.userId() == conversation.buyer_id) {
        // current user is buyer in current conversation. Get info of opponent. Opponent is kitchen profile
        var profile = Kitchen_details.findOne({
          "user_id": conversation.seller_id
        });
        var name = profile.chef_name;
      } else {
        // current user is seller in current conversation. Get info of opponent. Opponent is foodie profile
        var profile = Profile_details.findOne({
          "user_id": conversation.buyer_id
        });
        var name = profile.foodie_name;
      }
    }
    return (
      <div className="col chat-panel-wrapper">
        <div
          onClick={() => {
            this.toggleDisplay();
          }}
          className="chat-header"
        >
          <span className="badge">{this.props.total_unread}</span><span className="chat-header-name">{name}</span>
          <span
            onClick={this.callSupport()}
            id="support-icon"
            title="Contact support"
          >
            <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/support-icon.svg" />
          </span>
        </div>
        <div className="chat-content-wrapper">
          {/* {this.renderProgress()} */}
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
    $or: [{ buyer_id: Meteor.userId() }, { seller_id: Meteor.userId() }],
    available: true
  }).fetch();

  if (all_conversation.length > 0) {
    Session.set("current_conservation", all_conversation[0]._id);
    Session.set("current_conservation_index", 0);
  }

  // get all messages
  for (var i = 0; i < all_conversation.length; i++) {
    var message = Messages.find({
      conversation_id: all_conversation[i]._id,
      available: true
    }).fetch();
    all_messages.push(message);
  }

  // get total number of unread message
  var total_unread = 0;
  all_messages.map((item, index) => {
    if (item.length > 0) {
      item.map((itm, idx) => {
        if (itm.type == 'message') {
          if (!itm.seen && itm.receiver_id == Meteor.userId()) {
            total_unread++;
          }
        }
      })
    }
  })


  return {
    currentUser: Meteor.user(),
    conversation: all_conversation,
    messages: all_messages,
    name: name,
    total_unread: total_unread
  };
})(Message);
