import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import fs from 'fs-extra';


const bound = Meteor.bindEnvironment((callback) => {
  return callback();
});

const rotate_images = (collection, fileRef, cb) => {
  check(fileRef, Object);

  fs.exists(fileRef.path, (exists) => {
    bound(() => {
      if (!exists) {
        console.log('File ' + fileRef.path + ' not found in [rotate_images] Method');
      }
      const image = gm(fileRef.path).autoOrient();
      const path = '/' + (collection.storagePath(fileRef)) + '/' + fileRef._id + '.' + fileRef.extension;

      // Change width and height proportionally
      image.write(path, (rotateError) => {
        bound(() => {
          console.log('rotation done');
          if (rotateError) {
            console.error('[rotate_images]', rotateError);
            cb && cb(rotateError);
            return;
          }
        });
      });
    });
  });
  return true;
};

export default rotate_images;
