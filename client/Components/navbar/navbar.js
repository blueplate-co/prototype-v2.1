import { Template } from 'meteor/templating';


// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// custom component
import TopNavigation from '../../imports/ui/top_navigation';



Template.navbar.onRendered(function(){


  render(<TopNavigation />, document.getElementById('top-navigation-container'));

});
