import { Tracker } from 'meteor/tracker'

Template.notifications.helpers({
  'notifications': function() {
    Tracker.autorun(function(){
      Notifications.find({receiver_id: Meteor.userId(), read: false}).observeChanges({
        added:function(id, doc){
          var option = {
            body: doc.content
          }
          var notification = new Notification(doc.title, option);
            notification.onshow = function() {
              Meteor.call('notification.update', id);
            }
            notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            if (doc.title === 'New incoming order') {
              window.open('/cooking/orders', '_blank');
            }
          }
          notification.onclose = function(event) {
            return false;
          }
        }
      });
    })
  }
});
