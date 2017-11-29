import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { navbar_find_by } from '/imports/functions/find_by.js'

Template.navbar_internal_user.onRendered(function(){
  $('.ui_navbar_menu').pushpin({
    top: 50,
    bottom: 0,
    offset: 85
  });
});
