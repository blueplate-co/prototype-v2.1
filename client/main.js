
import {
  stepper
} from 'materialize-stepper'

Meteor.startup(function() {
  Notification.requestPermission()

  GoogleMaps.load({
    key: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac'
  });

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      cookie     : true,
      xfbml      : true,
      version    : '{latest-api-version}'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})
