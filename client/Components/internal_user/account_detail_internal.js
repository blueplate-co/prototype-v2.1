import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import { navbar_find_by } from '/imports/functions/find_by.js';

Template.account_detail_internal.helper(function(){
  $('.internal_user_wrapper').pushpin({
    top: 35,
    bottom: 2000,
    offset: 85
  });
});
