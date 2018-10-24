Meteor.startup(function () {
  Notification.requestPermission()

  // GoogleMaps.load({
  //   v: '3',
  //   key: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac',
  //   language: 'en',
  //   libraries: 'places'
  // });
  //- when no user activate intercom chat, boot it again
  if (!Intercom.booted) {
    window.Intercom("boot", {
      app_id: "x75rust2"
    });
  }

  // window.fbAsyncInit = function () {
  //   FB.init({
  //     appId: '{your-app-id}',
  //     cookie: true,
  //     xfbml: true,
  //     version: '{latest-api-version}'
  //   });
  //   FB.AppEvents.logPageView();
  // };


  // check mobile device
  window.detectmob = function () {
    if (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // (function (d, s, id) {
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) {
  //     return;
  //   }
  //   js = d.createElement(s);
  //   js.id = id;
  //   js.src = "//connect.facebook.net/en_US/sdk.js";
  //   fjs.parentNode.insertBefore(js, fjs);
  // }(document, 'script', 'facebook-jssdk'));
});

Meteor.subscribe('getAnnoucement');