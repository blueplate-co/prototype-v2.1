// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import CategorySummary from '../../imports/ui/seller_handbook/category_summary.js';

Template.category_summary.onRendered(function() {
  render (<CategorySummary />, document.getElementById('category_summary_container'));
})
