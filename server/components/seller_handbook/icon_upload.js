import { Meteor } from 'meteor/meteor';

shIcons = new FilesCollection({
  storagePath: () => {
    return process.env.PWD + '/public/shIcons_upload/';
  },
  collectionName: 'shIcons',
  allowClientCode: false,
  onBeforeUpload(file) {

    if (file.size <= 2097152 && /png|jpg|jpeg|svg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 2MB';
    }
  }
});

Meteor.publish('shIcons.all', function() {
  return shIcons.find({})
});
