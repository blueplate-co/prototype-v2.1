Meteor.startup(function () {
  Notification.requestPermission()
  //- when no user activate intercom chat, boot it again
  if (!Intercom.booted) {
    window.Intercom("boot", {
      app_id: "x75rust2"
    });
  }

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
});

Meteor.subscribe('getAnnoucement');