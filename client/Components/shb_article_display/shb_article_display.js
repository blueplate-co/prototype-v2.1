// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ArticleDisplay from '../../imports/ui/seller_handbook/article_display.js';

Template.shb_article_display.onRendered(function() {
  render (<ArticleDisplay />, document.getElementById('shb_article_display'));
})
