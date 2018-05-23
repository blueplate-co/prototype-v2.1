export function saveToKraken (imgName, imgPath, sessionName) {
  //- meteor call
  Meteor.call('saveToKraken', imgName, imgPath, (error, result)=>{
    if(error) console.log('kraken errors', error);
    console.log(result);
  });

  //- declare some sizes
  var original = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/' + imgName;
  var large    = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/' + imgName;
  var medium   = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/medium/' + imgName;
  var small    = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/small/' + imgName;

  //- add to sizes object
  var sizes    = {};
  sizes.origin = original;
  sizes.large  = large;
  sizes.medium = medium;
  sizes.small  = small;

  //- set to session
  Session.set(sessionName, sizes);
  console.log('kitchen name: ', Session.get(sessionName));
}
