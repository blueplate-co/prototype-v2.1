import { Template } from 'meteor/templating';

// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// custom component
import Message from '../../imports/ui/message';



Template.message_page.onRendered(function(){
  render(<Message />, document.getElementById('chat-wrapper'));
});
