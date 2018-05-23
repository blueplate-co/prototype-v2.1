import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


// Messages = new Mongo.Collection('messages');

// set permission about Messages
// Messages.deny({
//   remove() { return true }
// });

// Meteor.methods({
//   'messages.insert'(text, owner, channel, chips, component) {
//     check(text, String);
//     check(owner, Match.Any);
//     check(channel, Match.Any);
//     check(chips, Match.Any);
//     check(component, Match.Any);

//     // Check if user is logged in
//     //    if(!Meteor.userId()){
//     //      throw new Meteor.Error('not-authorized');
//     //    }
//     var set_time = new Date();
//     // Convert machine time to human readable time
//     var message_timestamp = ("0" + set_time.getHours()).slice(-2) + ":" + ("0" + set_time.getMinutes()).slice(-2)

//     Messages.insert({
//       text,
//       current_time: message_timestamp,
//       createdAt: new Date(),
//       owner: owner,
//       channel: channel,
//       chips: chips,
//       component: component
//     });
//   },

//   'apiai.response'(text) {
//     var accessToken = "31cd49742ab64d17815beb84ba78e585";
//     var baseUrl = "https://api.api.ai/v1/";
//     // HTTP POST request
//     HTTP.call(
//       'POST', baseUrl + "query?v=2017", {
//           headers: {
//             "Authorization": "Bearer " + accessToken,
//             "Content-Type": "application/json; charset=utf-8"
//           },
//           data: {
//             query: text,
//             lang: "en",
//             sessionId: "somerandomthing"
//           }
//       }, (error, result) => {
//         if(!error) {
//           var response = result.data.result.fulfillment.messages[0].speech;
//           var chips_check = result.data.result.fulfillment.messages[1];
//           var component = result.data.result.fulfillment.messages[1].payload.component;
//           if (typeof chips_check != 'undefined') {
//             var chips = result.data.result.fulfillment.messages[1].payload.chips;
//           } else {
//             var chips = "";
//           }
//           Meteor.call('messages.insert',response, "Cameron Stevenson", Meteor.userId(),chips,component);
//         } else {
//           console.log(error);
//         }
//       });
//     },

//   'messages.clear'(channel){
//       check(channel, String);
//       Messages.remove({channel: channel});
//   }
// });
