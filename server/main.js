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

Meteor.publish('getDishesLikes', function(){
  return DishesLikes.find();
})

Meteor.publish('getMenusLikes', function(){
  return MenusLikes.find();
})

Meteor.publish('getKitchensLikes', function(){
  return KitchenLikes.find();
})

Meteor.publish('getAnnoucement', function(){
  return Annoucement.find();
})

//- call Meteor methods
if (Meteor.isServer) {
  let publicFolder = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/public';
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
        // return parser.text('every 1 mins')
      },

      job: function() {
        //DO SOME COOL STUFF HERE
        //- delete pubilc/ folder
        let fse = require('fs-extra')

        //- using fs-extra
        fse.remove(publicFolder, err => {
          if (err) return console.error(err)
        
          console.log('Removed public/ folder at 12:00 pm every day')
        })
      }
      
    });
  
    SyncedCron.start();
    
  });

}

Annoucement = new Mongo.Collection('annoucement');

if (Annoucement.find({}).count() == 0) {
  Annoucement.insert({
    message: 'Welcome to Blueplate',
    background: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a18285db9f6a93b9854a835fc1040c0a&auto=format&fit=crop&w=2019&q=80',
    createdAt: new Date()
  });
}
