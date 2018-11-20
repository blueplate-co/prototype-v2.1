import { Template } from 'meteor/templating';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

import Search from '../../imports/ui/search_page/search_page';

Template.search.onRendered(function(){
  render(<Search />, document.getElementById('search_container'));
});