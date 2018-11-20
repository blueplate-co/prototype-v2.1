import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

import Search from '../../imports/ui/search';

Template.search.onRendered(function(){
  render(<Search />, document.getElementById('search_container'));
});