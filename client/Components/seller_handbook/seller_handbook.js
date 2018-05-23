// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import SellerHandbook from '../../imports/ui/seller_handbook/seller_handbook.js';

Template.seller_handbook.onRendered(function() {
  render (<SellerHandbook />, document.getElementById('seller_handbook_container'));
})
