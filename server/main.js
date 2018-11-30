//initiate webhook when the website render to allow api.ai send over GET request
// import '/imports/api/public/api.js';

// ServiceConfiguration.configurations.remove({
//     service: "facebook"
// });

// ServiceConfiguration.configurations.insert({
//     service: "facebook",
//     appId: '1658815334192410',
//     secret: '7d55362d11e8fe338e061111702e4989',
// });

// ServiceConfiguration.configurations.remove({
//   service: "google"
// });

// ServiceConfiguration.configurations.insert({
//   service: "google",
//   clientId: '443515033308-et1o2nfgfom025op5bm5unsfmfbimafl.apps.googleusercontent.com',
//   secret: 'uDpIjX3dsylPJ5PJP2lwSFtm',
// });

Meteor.publish('theDishes', function(){
  return Dishes.find();
});

Meteor.publish('theMenu', function(){
  return Menu.find();
});

Meteor.publish('theIngredients', function(){
  return Ingredients.find();
});

Meteor.publish('theKitchens', function(){
  return Kitchen_details.find();
});

Meteor.publish('getUserShoppingCart', function(){
  return Shopping_cart.find({ buyer_id: Meteor.userId() })
});

Meteor.publish('getAnnoucement', function(){
  return Annoucement.find();
})

Inject.rawHead('headGA', `
<!-- Google Tag Manager -->
<script async>(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
    'gtm.start':
      new Date().getTime(), event: 'gtm.js'
  }); var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-59ZQ9NL');</script>
<!-- End Google Tag Manager -->
`);

Inject.rawBody('bodyGA', `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-59ZQ9NL"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`);

//- call Meteor methods
if (Meteor.isServer) {
  let publicFolder = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/public';
  Meteor.startup(() => {
    //- create cron jobs
    SyncedCron.config({
      log: true,
      logger: null,
      collectionName: 'cronHistory',
      utc: false,
      collectionTTL: 172800
    });

    //- add cron job
    SyncedCron.add({
      name: 'Calculate available profit on the 15th of the month',
      schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('on the 15th of the month'); //- on the 15th of the month
      },

      job: function() {
        Meteor.call('claim.summaryProfit', (err, res) => {
          if (!err) {
            console.log('Calculate available profit on the 15th of the month');
          } else {
            console.log(err);
          }
        });
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
