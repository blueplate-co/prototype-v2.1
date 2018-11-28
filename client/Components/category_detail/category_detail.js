import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Category_Detail from '../../imports/ui/category_detail';

Template.category_detail.onRendered(function(){
    var id = FlowRouter.getParam("category_id");
    var tag = FlowRouter.getParam("tag_name");
    render(<Category_Detail id={id} tag={tag} />, document.getElementById('category_detail_container'));
});