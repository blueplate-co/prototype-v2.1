import { Meteor } from "meteor/meteor";

Meteor.methods({
  "message.getConversation"() {
    var result = [];
    result = Conversation.find({
      $or: [{ senderId: Meteor.userId() }, { receiverId: Meteor.userId() }],
    }).fetch();
    return result;
  },
  "message.getMessage"(conversationId) {
    if (conversationId) {
      var result = [];
      result = Messages.find({
        conversation_id: conversationId,
        $or: [{ senderId: Meteor.userId() }, { receiverId: Meteor.userId() }],
      }).fetch();
      return result;
    }
  },
  "message.createConversasion"(senderId, receiverId) {
    var participants = [senderId, receiverId];
    Conversation.insert({
      participants: participants,
      createdAt: new Date(),
    });
  },
});
