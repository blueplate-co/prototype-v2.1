Meteor.publish('landingDishes', function(){
  return Dishes.find(
    {
      deleted: false, online_status: true
    }, {
      sort: {average_rating: -1, createdAt: -1}, limit: 4
    }
  );
});
