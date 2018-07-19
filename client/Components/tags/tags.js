import { Template } from 'meteor/templating';

import React from 'react';
import { render } from 'react-dom';

import TagsUtil from '../../imports/ui/tags.js';

Template.tags_util.onRendered( function() {
  render(<TagsUtil />, document.getElementById('tags_util'));
});
