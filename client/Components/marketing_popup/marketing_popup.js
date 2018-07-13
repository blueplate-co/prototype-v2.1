import { Template } from 'meteor/templating';

import React from 'react';
import { render } from 'react-dom';

import MarketingPopup2 from '../../imports/ui/marketing_popup2.js';

Template.marketing_popup.onRendered( function() {
  render(<MarketingPopup2 />, document.getElementById('marketing_popup2_container'));
});
