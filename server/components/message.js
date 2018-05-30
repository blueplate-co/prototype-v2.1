import { Meteor } from "meteor/meteor";

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
    console.log(existedConversation);
    if (existedConversation) {
      if (!existedConversation.available) {
        Conversation.update(
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
      var messages = Messages.find({ conversation_id: conversationId });
      messages.forEach(function(mess) {
        Messages.update(
          {
            _id: mess._id,
          },
          {
            $set: {
              available: false,
            },
          }
        );
      });
    }
  },
  "message.sendToSupport"() {
    const accountSid = "AC3807512e0f88d45d2eb403ddbbe071c7";
    const authToken = "dfe3e83e75dd5f7cb737929d8c087136";
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: "+15017122661",
        to: "+15558675310",
      })
      .then(message => console.log(message.sid))
      .done();
  },
  "message.seenMessage"(conversation_id, receiver_id) {
    const conversation = Conversation.findOne({
      _id: conversation_id,
    });

    var sender_id = "";
    if (conversation.buyer_id == receiver_id) {
      sender_id = conversation.seller_id;
    } else {
      sender_id = conversation.buyer_id;
    }

    var allunseen = Messages.find({
      sender_id: sender_id,
      receiver_id: receiver_id,
      seen: false,
    });

    console.log("Sender: " + sender_id);
    console.log("Receiver: " + receiver_id);

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
});
