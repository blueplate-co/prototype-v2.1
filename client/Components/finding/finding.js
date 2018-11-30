import { Template } from 'meteor/templating';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

import Finding from '../../imports/ui/finding/finding';

Template.finding.onRendered(function(){
  render(<Finding />, document.getElementById('finding_container'));
});