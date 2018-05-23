import { Meteor } from "meteor/meteor";

Meteor.publish("theConversations", function() {
  return Conversation.find({
    participants: Meteor.userId(),
  });
});

Meteor.publish("theMessages", function() {
  return Messages.find({});
});

Meteor.methods({
  "message.createConversasion"(buyerId, sellerId) {
    var conversation = Conversation.find({
      buyer_id: buyerId,
      seller_id: sellerId,
    }).fetch();

    if (conversation.length > 0) {
      Conversation.update({
        buyer_id: buyerId,
        seller_id: sellerId,
      }, {
        $set: {
          available: true
        }
      });
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
  "message.createStatus"(buyerId, sellerId, status, conversationId) {
    Messages.insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      type: "status",
      message: status,
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
      conversation_id: conversationId,
      createdAt: new Date(),
    });
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
});
