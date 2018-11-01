
window.detectBrowser = window.detectBrowser || {};
Meteor.startup(function () {
  Notification.requestPermission();
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
})
