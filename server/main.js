//initiate webhook when the website render to allow api.ai send over GET request
import '/imports/api/public/api.js';

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '1658815334192410',
    secret: '7d55362d11e8fe338e061111702e4989',
});

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: '443515033308-et1o2nfgfom025op5bm5unsfmfbimafl.apps.googleusercontent.com',
  secret: 'uDpIjX3dsylPJ5PJP2lwSFtm',
});

Meteor.publish('theDishes', function(){
  return Dishes.find();
});

Meteor.publish('theMenu', function(){
  return Menu.find();
});

Meteor.publish('theIngredients', function(){
  return Ingredients.find();
});

Meteor.publish('getUserShoppingCart', function(){
  return Shopping_cart.find({ buyer_id: Meteor.userId() })
})

//- call Meteor methods
if (Meteor.isServer) {

  Meteor.startup(() => {
    //- create cron jobs
    SyncedCron.config({
      // Log job run details to console
      log: true,
  
      // Use a custom logger function (defaults to Meteor's logging package)
      logger: null,
  
      // Name of collection to use for synchronisation and logging
      collectionName: 'cronHistory',
  
      // Default to using localTime
      utc: false,
  
      /*
        TTL in seconds for history records in collection to expire
        NOTE: Unset to remove expiry but ensure you remove the index from
        mongo by hand
  
        ALSO: SyncedCron can't use the `_ensureIndex` command to modify
        the TTL index. The best way to modify the default value of
        `collectionTTL` is to remove the index by hand (in the mongo shell
        run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
        project. SyncedCron will recreate the index with the updated TTL.
      */
      collectionTTL: 172800
    });

    //- add cron job
    SyncedCron.add({
      name: 'Remove public folder in every day at 12:00 PM',
      schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('at 12:00 pm'); //- at 12:00 on every day 
      },
      job: Meteor.bindEnvironment(function () {

        //DO SOME COOL STUFF HERE
        //- delete pubilc/ folder
        let rimraf = require('rimraf')
        rimraf('/public', function () { 
          console.log('Removed public/ folder at 12:00 pm every day')
        });


      })
    });
  
    SyncedCron.start();
    
  });

}