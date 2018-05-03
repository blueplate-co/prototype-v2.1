import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import IconUpload from './icon_upload.js';

export default class CategoryInput extends Component {

  constructor (props) {
    super(props);
    this.save_cat = this.save_cat.bind(this);
    this.state = {
      cat_title: '',
      cat_description: '',
      incomplete_form: true,
    }
  }

  incomplete_form = () => {
    return this.state.cat_title === '' && this.state.cat_description === ''
  }

  save_cat = () => {
    const cat_title = this.state.cat_title;
    const cat_description = this.state.cat_description;
    const createdAt = new Date();
    const createdBy = Meteor.userId();
    const icon_link = Session.get('shIcons')
    Meteor.call('category.add', cat_title, cat_description, icon_link, createdBy, (error, result) => {
      if (!error) {
        Materialize.toast('Category added', 4000)
      } else {
        Materialize.toast(error.message)
      }
    })
    this.props.close_add_cat();
  }

  update_cat_title = (e) => {
    this.setState({
      cat_title: e.target.value,
    });
  }

  update_cat_description = (e) => {
    this.setState({
      cat_description: e.target.value,
    });
  }

  render () {
    return (
      <div className = "card z-depth-0 category_display">
        <a className = "btn-floating waves-effect waves-red z-depth-0 transparent grey-text text-darken-1" id = "close_input" onClick={this.props.close_add_cat}>
          <i className="material-icons grey-text text-darken-1">close</i>
        </a>
        <div className = "card-content">
          <div className = "row">
            <div className = "col s12 m5 l3">
              <IconUpload />
            </div>
            <div className = "col s12 m7 l9">
              <div className="input-field">
                <input id="cat_title" type="text" value={this.state.cat_title} onChange={this.update_cat_title}/>
                <label htmlFor="cat_title">Title</label>
              </div>
              <div className="input-field">
                <input id="cat_description" type="text" value={this.state.cat_description} onChange={this.update_cat_description} />
                <label htmlFor="cat_description">Description</label>
              </div>
            </div>
            <div className = "row">
              <a className = "btn right cat_save" disabled = {this.state.cat_title.trim().length + this.state.cat_description.trim().length == 0} onClick = {this.save_cat}>save</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
