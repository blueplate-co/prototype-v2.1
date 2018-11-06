import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Dish_Detail from '../../imports/ui/dish_detail';

Template.dish_detail.onRendered(function(){
    var id = FlowRouter.getParam("dish_id")
    render(<Dish_Detail id={id}/>, document.getElementById('dish_detail_container'));
});