import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import AdminEditFunc from '../../imports/ui/admin_edit_func/admin_edit_func.js';
import './admin_edit_func.html';

Template.admin_edit_function.onRendered(function(){
    if (Meteor.userId()) {
        render(<AdminEditFunc/>, document.getElementById('admin_edit_function'));
    } else {
        FlowRouter.go('/main');
    }
});