import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { validatePhoneNumber, getCountryCodeFromKitChen, getCountryCodeFromProfile } from '/imports/functions/common';

// App component - represents the whole app
class Message extends Component {
  constructor(props) {
    super(props);
    this.callSupport = this.callSupport.bind(this);
    this.state = {
      display: false,
      index: 0,
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
    if (this.props.conversation.length > 0) {
      Meteor.call('message.seenMessage', this.props.conversation[this.state.index]._id, Meteor.userId(), (err, res) => {
        if (!err) {
          console.log(res);
        }
      });
    }
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
      } else if (Meteor.userId() == item.seller_id) {
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
  callSupport(e) {
    e.stopPropagation();
    Meteor.call('message.sendToSupport', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        alert('Clicked support');
      }
    })
  }

  sendMessage(e) {
    if (e.charCode == 13) {
      var message = $("#message-content").val();
      if (message.trim().length <= 1) {
        Materialize.toast('Your message must at least 2 characters.', 4000, 'rounded bp-green');
        return false;
      }
      var receiverId = '',
          receiver = {},
          phoneNumber,
          countryCode,
          userMessage;

      // get info about current conversation
      var conversation = Conversation.findOne({
        _id: this.props.conversation[this.state.index]._id,
      });

      if (!conversation.available) {
        Materialize.toast('Your conversation has stopped.', 4000, 'rounded bp-green');
        return false;
      }

      if (Meteor.userId() == conversation.buyer_id) {
        // current user is buyer in current conversation. Get info of opponent. Opponent is kitchen profile
        receiver = Kitchen_details.findOne({"user_id": conversation.seller_id});

        receiverId = receiver.user_id;
        phoneNumber = receiver.kitchen_contact;
        countryCode = getCountryCodeFromKitChen(receiver);
        userMessage = Profile_details.findOne({"user_id": conversation.buyer_id}).foodie_name;
      } else {
        // current user is seller in current conversation. Get info of opponent. Opponent is foodie profile
        receiver = Profile_details.findOne({"user_id": conversation.buyer_id});

        receiverId = receiver.user_id;
        phoneNumber = receiver.mobile;
        countryCode = getCountryCodeFromProfile(receiver),
        userMessage = Kitchen_details.findOne({"user_id": conversation.seller_id}).chef_name;
      }

      Meteor.call(
        "message.createMessage",
        Meteor.userId(),
        receiverId,
        message,
        this.props.conversation[this.state.index]._id,
        (err, res) => {
          if (!err) {
            $("#message-content").val("");
          } else {
            console.log(err);
          }
        }
      );

      message = message + '\nPlease reply this message on our platform at ' + location.href;
      var contentMessage = 'Blueplate: ' + userMessage + ', ' + message;
      phoneNumber = validatePhoneNumber(phoneNumber, countryCode);

      Meteor.call(
        'message.sms',
        phoneNumber,
        contentMessage.trim(),
        (err, res) => {
          if (!err) {
            console.log(err);
          }
        }
      );
    }
  }

  seenMessage() {
    if (this.props.conversation.length > 0) {
      Meteor.call('message.seenMessage', this.props.conversation[this.state.index]._id, Meteor.userId(), (err, res) => {
        if (!err) {
          console.log(res);
        }
      });
    }
  }

  // switch chat conversation
  switchConversation(item, index) {
    console.log(item);
    if (item.chef_name) {
      // Opponent is chef, current user is foodie
      var chefId = item.user_id;
      var foodieId = Meteor.userId();
      var conversationId = Conversation.findOne({
        buyer_id: foodieId,
        seller_id: chefId
      })._id;
      this.setState({
        index: index
      })
    } else {
      // Opponent is foodie, current user is chef
      var chefId = Meteor.userId();
      var foodieId = item.user_id;
      var conversationId = Conversation.findOne({
        buyer_id: foodieId,
        seller_id: chefId
      })._id;
      this.setState({
        index: index
      });
    }
  }

  // render list of user are joining into chat panel
  renderListJoiner() {
    let tempFriends = this.getListJoiner();
    return (
      <ul className="chat-list-user">
        {
          tempFriends.map((item, index) => {
            // get unread message from friends
            // get conversation id of friends with current user
            var name = '';
            if (item.hasOwnProperty('chef_name')) {
              name = item.chef_name;
            } else {
              name = item.foodie_name;
            }
            var unread;
            let user_id = item.user_id;
            let conversation = Conversation.findOne({
              $or: [{ buyer_id: Meteor.userId() }, { seller_id: Meteor.userId() }]
            });
            let conversation_id = conversation._id;
            // get all unseen messages in available conversation
            if (conversation_id) {
              let count = Messages.find({
                conversation_id: conversation_id,
                receiver_id: Meteor.userId(),
                sender_id: user_id,
                seen: false,
                available: true
              }).count();
              unread = count > 0 ?
              (
                <span className="unread-badge">{count}</span>
              ) : (
                ''
              );
            }
            if (item.profileImg == null) {
              return (
                <span title={name} key={index} style={{position: 'relative'}}>
                  <li
                    key={index}
                    title={name}
                    className={(this.state.index == index) ? 'chat-user active' : 'chat-user'}
                    title={item.chef_name}
                    onClick={() => this.switchConversation(item, index)}
                    style={{
                      backgroundColor: `#ccc`,
                    }}
                  />
                  {unread}
                </span>
              )
            } else {
              return (
                <span title={name} key={index} style={{position: 'relative'}}>
                  <li
                    key={index}
                    title={name}
                    className={(this.state.index == index) ? 'chat-user active' : 'chat-user'}
                    title={item.chef_name}
                    onClick={() => this.switchConversation(item, index)}
                    style={{
                      backgroundImage: `url(${item.profileImg.origin})`,
                    }}
                  />
                  {unread}
                </span>
              )
            }
          })
        }
      </ul>
    );
  }

  renderListMessage() {
    if (this.props.conversation.length == 0) {
      return (
        <div id="list-message-body" className="list-message">
          <ul style={{ height: "225px" }}>
            <li className="status">You have no chef to chat, let's check out your cart or leave us messages if you need any help.</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div id="list-message-body" className="list-message">
          <ul>
            {this.props.messages[this.state.index].map(
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
          onClick={() => { this.seenMessage() }}
        />
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    var messageBody = document.querySelector('#list-message-body');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }

  render() {
    // generator name of chat
    var name = 'Chat';
    // get detail info of current conservation
    if (this.props.conversation[this.state.index]) {
      var conversation = Conversation.findOne({
        _id: this.props.conversation[this.state.index]._id
      });
      if (Meteor.userId() == conversation.buyer_id) {
        // current user is buyer in current conversation. Get info of opponent. Opponent is kitchen profile
        var profile = Kitchen_details.findOne({
          "user_id": conversation.seller_id
        });
        name = profile.chef_name
      } else {
        // current user is seller in current conversation. Get info of opponent. Opponent is foodie profile
        var profile = Profile_details.findOne({
          "user_id": conversation.buyer_id
        });
        name = profile.foodie_name
      }
    }

    if (this.state.display) {
      if (this.props.conversation.length > 0) {
        Meteor.call('message.seenMessage', this.props.conversation[this.state.index]._id, Meteor.userId(), (err, res) => {
          if (!err) {
            console.log(res);
          }
        });
      }
    }

    const header = parseInt(this.props.total_unread) > 0 ? (
      <div>
        <span className="badge">{this.props.total_unread}</span><span className="chat-header-name">{name}</span>
      </div>
    ) : (
      <span className="chat-header-name">{name}</span>
    );

    return (
      <div className="col chat-panel-wrapper">
        <div
          onClick={() => {
            this.toggleDisplay();
          }}
          className="chat-header"
        >
          {header}
          <span
            onClick={(e) => this.callSupport(e)}
            id="support-icon"
            title="Contact support"
          >
            {/* <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/support-icon.svg" /> */}
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

  var all_messages = [];
  var all_conversation = [];

  // get all conversation
  all_conversation = Conversation.find({
    $or: [{ buyer_id: Meteor.userId() }, { seller_id: Meteor.userId() }]
  }).fetch();

  // get all messages
  for (var i = 0; i < all_conversation.length; i++) {
    var message = Messages.find({
      conversation_id: all_conversation[i]._id,
      available: true
    }).fetch();
    if (message.length > 2) {
      if ((message[0].message == message[1].message) && (message[0].message == 'Start conversation')) {
        message.shift();
      }
    }
    all_messages.push(message);
  }

  // get total number of unread message
  var total_unread = 0;
  all_messages.map((item, index) => {
    if (item.length > 1) {
      item.map((itm, idx) => {
        if (!itm.seen && itm.receiver_id == Meteor.userId()) {
          total_unread++;
        }
      })
    }
  });


  return {
    currentUser: Meteor.user(),
    conversation: all_conversation,
    messages: all_messages,
    total_unread: total_unread
  };
})(Message);
