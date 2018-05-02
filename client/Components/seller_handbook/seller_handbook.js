// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import CategorySummary from '../../imports/ui/seller_handbook/seller_handbook.js';

Template.category_list.onRendered(function() {
  render (<CategorySummary />, document.getElementById('category_list_container'));
})
