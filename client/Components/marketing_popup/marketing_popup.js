import { Template } from 'meteor/templating';

import React from 'react';
import { render } from 'react-dom';

import MarketingPopup from '../../imports/ui/marketing_popup.js';

Template.marketing_popup.onRendered( function() {
  render(<MarketingPopup />, document.getElementById('marketing_popup2_container'));
});
