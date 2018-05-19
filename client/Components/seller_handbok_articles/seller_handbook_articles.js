// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ArticleListDisplay from '../../imports/ui/seller_handbook/article_list_display.js';

Template.shb_articles.onRendered(function() {
  render (<ArticleListDisplay />, document.getElementById('shb_articles_container'));
})
