import { Meteor } from "meteor/meteor";

Meteor.publish('theConversations', function () {
  return Conversation.find({
    participants: Meteor.userId()
  });
});

Meteor.publish('theMessages', function () {
  return Messages.find({});
});

Meteor.methods({
  "message.createConversasion"(senderId, receiverId) {
    var participants = [senderId, receiverId];
    var conversation = Conversation.insert({
      participants: participants,
      createdAt: new Date(),
    });
    return conversation;
  },
  "message.createStatus"(senderId, receiverId, status, conversationId) {
    Messages.insert({
      sender_id: senderId,
      receiver_id: receiverId,
      type: 'status',
      message: status,
      conversation_id: conversationId,
      createdAt: new Date()
    })
  },
  "message.createMessage"(senderId, receiverId, status, conversationId) {
    Messages.insert({
      sender_id: senderId,
      receiver_id: receiverId,
      type: 'message',
      message: status,
      conversation_id: conversationId,
      createdAt: new Date()
    })
  }
});
