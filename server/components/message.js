import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';

Meteor.publish("theConversations", function() {
  return Conversation.find({
    $or: [{ buyer_id: Meteor.userId() }, { seller_id: Meteor.userId() }],
  });
});

Meteor.publish("theMessages", function() {
  return Messages.find({});
});

Meteor.methods({
  "message.createConversasion"(buyerId, sellerId) {
    var existedConversation = Conversation.findOne({
      buyer_id: buyerId,
      seller_id: sellerId,
    });
    // console.log(existedConversation);
    if (existedConversation) {
      if (!existedConversation.available) {
        var conversation = Conversation.update(
          {
            buyer_id: buyerId,
            seller_id: sellerId,
          },
          {
            $set: {
              available: true,
            },
          }
        );
        return existedConversation._id;
      }
    } else {
      var conversation = Conversation.insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        available: true,
        createdAt: new Date(),
      });
    }
    return conversation;
  },
  "message.createStatus"(senderId, receiverId, status, conversationId) {
    Messages.insert({
      sender_id: senderId,
      receiver_id: receiverId,
      type: "status",
      message: status,
      available: true,
      seen: false,
      conversation_id: conversationId,
      createdAt: new Date(),
    });
  },
  "message.createMessage"(senderId, receiverId, status, conversationId) {
    Messages.insert({
      sender_id: senderId,
      receiver_id: receiverId,
      type: "message",
      message: status,
      available: true,
      seen: false,
      conversation_id: conversationId,
      createdAt: new Date(),
    });
  },
  "message.disableConversation"(conversationId) {
    var conversation = Conversation.findOne({
      _id: conversationId,
    });
    if (conversation) {
      Conversation.update(
        {
          _id: conversationId,
        },
        {
          $set: {
            available: false,
          },
        }
      );
      // DONT DISABLE MESSAGE AFTER CONVERSATION DISABLED T_T
      // var messages = Messages.find({ conversation_id: conversationId });
      // messages.forEach(function(mess) {
      //   Messages.update(
      //     {
      //       _id: mess._id,
      //     },
      //     {
      //       $set: {
      //         available: false,
      //       },
      //     }
      //   );
      // });
    }
  },
  "message.sms"(phonenumber, content) {
    console.log('Phone number receive: ' + phonenumber);
    console.log('Content to sent: ' + content);
    // real devices
    const accountSid = "ACa1eff75c106b95b3b3cc55e0bc09ca30";
    const authToken = "39ba5c8a8293447d3adf434b558818c4";
    // testing
    // const accountSid = "ACdee9d52a82e9321cd35c065153cdfdd2";
    // const authToken = "2c175d8aed982e1baf0b5d74dbe48a20";
    const client = require("twilio")(accountSid, authToken);
    let sender = '+85264507389';
    // if phonenumber come from HK
    if (phonenumber.indexOf('+852') > -1) {
      sender = 'Blueplate';
    }
    client.messages
      .create({
        body: content,
        from: sender,
        to: phonenumber,
      })
      .then(message => console.log(message.sid))
      .done();
  },
  "message.seenMessage"(conversation_id, receiver_id) {
    let conversation = [];
    conversation = Conversation.find({
      _id: conversation_id,
    }).fetch();
    // console.log('Current conservation: ' + conversation_id)

    var sender_id = "";
    // console.log(conversation[0]);
    if (conversation[0].buyer_id == receiver_id) {
      sender_id = conversation[0].seller_id;
    } else {
      sender_id = conversation[0].buyer_id;
    }

    let error = false;
    try {
      Messages.update(
        {
          sender_id: sender_id,
          receiver_id: receiver_id,
        },
        {
          $set: {
            seen: true,
          },
        },
        { multi: true }
      );
    } catch (error) {
      return new Error(error);
      error = true;
    }

    return true;
  },
  "message.findOne_conversation"(buyer_id, seller_id) {
    return Conversation.findOne({ buyer_id: buyer_id, seller_id: seller_id });
  },
  "message.send_verify_phonenumber_code"(phone_number, country_code) {
      let url = 'https://api.authy.com/protected/json/phones/verification/start';
      let options = {
        headers: { 'X-Authy-API-Key' : 'BpUkLBPlCzBQvWtcTdlDN5JAyhBnvb98' },
        params: {
          'via': 'sms',
          'phone_number': phone_number,
          'country_code': country_code,
        }
      };
      return HTTP.call('POST', url, options);
  },
  "message.verify_verification_number"(phone_number, country_code, verification_code) {
    let url = `https://api.authy.com/protected/json/phones/verification/check?phone_number=${phone_number}&country_code=${country_code}&verification_code=${verification_code}`;
    let options = {
      headers: { 'X-Authy-API-Key' : 'BpUkLBPlCzBQvWtcTdlDN5JAyhBnvb98' }
    };
    return HTTP.call('GET', url, options);
  }
});
