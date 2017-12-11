import { Meteor } from 'meteor/meteor';
UserAudios = new Mongo.Collection('user_audio');

Meteor.methods({
    // add new audio information about specific userId
    'user_audio.insert'(user_id, name, audio, save_Date) {
      UserAudios.insert({
        user_id: user_id, // id of specific user
        name: name, // name of audio file name
        audio: audio, // binary data of audio has been store (has format as Uint8Array)
        save_Date: Date.now() // date of saved audio file, default is current date
      })
    }

});
