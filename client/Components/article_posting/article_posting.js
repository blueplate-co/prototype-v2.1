// integrate reactjs
import React from 'react';
import { render } from 'react-dom';

// import for show room react component
import ArticlePosting from '../../imports/ui/seller_handbook/article_posting.js';

Template.article_posting.onRendered(function() {
  render (<ArticlePosting />, document.getElementById('article_posting_container'));
})
