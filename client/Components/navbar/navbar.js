import {
  Template
} from 'meteor/templating';
// integrate reactjs
import React from 'react';
import {
  render
} from 'react-dom';
// custom component
import TopNavigation from '../../imports/ui/top_navigation';
import T from 'i18n-react';
import en from "../../imports/lang/en";
import zh from "../../imports/lang/zh";

Template.navbar.onRendered(function () {
  let default_language = localStorage.getItem('default_language');
  switch (default_language) {
    case 'en':
      T.setTexts(en);
      break;
    case 'zh':
      T.setTexts(zh);
      break;
    default:
      T.setTexts(en);
      break;
  }
  render( <
    TopNavigation / > , document.getElementById('top-navigation-container'));
});