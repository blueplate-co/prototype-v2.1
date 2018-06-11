import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for payment react component
import Claim from '../../imports/ui/claim';

Template.claim.onRendered(function(){
  render(<Claim />, document.getElementById('claim_container'));
});