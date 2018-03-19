export function date_time_conversion (date_time_in_ms, current_date_time) {

  if (!current_date_time) {
    var t = date_time_in_ms;
  } else {
    var t = date_time_in_ms - current_date_time;
  }
  var seconds = ("0" + Math.floor( (t/1000) % 60 )).slice(-2);
  var minutes = ("0" + Math.floor( (t/1000/60) % 60 )).slice(-2);
  var hours = ("0" + Math.floor( (t/(1000*60*60)) % 24 )).slice(-2);
  var days = Math.floor( t/(1000*60*60*24) );

  if (t <= 0) {
    Meteor.clearInterval(countdown);
  }

  return {
    //'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}
