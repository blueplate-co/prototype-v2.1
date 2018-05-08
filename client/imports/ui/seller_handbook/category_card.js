import React, { Component } from 'react';

import IconUpload from './icon_upload.js';

export default class CategoryCard extends Component {

  constructor(props) {
    super(props);
    this.highlight_cat = this.highlight_cat.bind(this);
    this.unhighlight_cat = this.unhighlight_cat.bind(this);
    this.state = {
      highlight: false,
      edit: false,
      cat_title: '',
      cat_description: '',
    }
  }

  highlight_cat = (e) => {
    this.setState({
      highlight: true,
    })
  }

  unhighlight_cat = (e) => {
    this.setState({
      highlight: false,
    })
  }

  handle_edit = (e) => {
    this.setState({
      edit: true,
    })
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

  handle_cancel = (e) => {
    this.setState({
      edit: false,
    })
  }

  handle_remove = (e) => {
    Meteor.call('category.remove', this.props.id, (error, result) => {
      if (!error) {
        Materialize.toast('category removed', 4000)
      } else {
        Materialize.toast(error.message)
      }
    })
  }

  render() {
    return (
      <div>
      {
        (this.state.edit)?
        <div className = "card category_display">
          <div className = "card-content">
            <div className = "row">
              <div className = "col s12 m5 l3">
                <IconUpload icon_link = {this.props.icon_link} />
              </div>
              <div className = "col s12 m7 l9">
                <div className="input-field">
                  <input id="cat_title" type="text" value={this.props.title} onChange={this.update_cat_title}/>
                  <label htmlFor="cat_title" className="active">Title</label>
                </div>
                <div className="input-field">
                  <input id="cat_description" type="text" value={this.props.description} onChange={this.update_cat_description} />
                  <label htmlFor="cat_description" className="active">Description</label>
                </div>
              </div>
              <div className = "row">
                <a className = "btn right cat_update">update</a>
                <a className = "btn-flat right waves-effect waves-red" onClick = {this.handle_cancel}>cancel</a>
              </div>
            </div>
          </div>
        </div>
        :
        <div className = "card category_display" onMouseOver = {this.highlight_cat} onMouseLeave = {this.unhighlight_cat} >
          <div className = "card_overlay" style = {(this.state.highlight)?{backgroundColor: "rgba(224,224,224, 1)"}:{backgroundColor: "transparent"}}>
            <div className = "card-content">
              <div className = "row">
                <div className = "col s12 m5 l3">
                  <div className = "cat_icon_uploader grey lighten-2">
                    <img src = {this.props.link} className = "iconDisplay"/>
                  </div>
                </div>
                <div className = "col s12 m7 l9">
                  <h5>{this.props.title}</h5>
                  <p>{this.props.description}</p>
                  <p>Total number of articles: {this.props.article_count}</p>
                  <p>Last updated: {this.props.updatedAt.toString()}</p>
                </div>
                <div className = "overlay_action">
                  {
                    (this.state.highlight) ?
                    <div>
                      <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "edit_cat" onClick = {this.handle_edit}>
                        <i className="material-icons grey-text text-darken-1" id= "edit_cat">edit</i><span>Edit</span>
                      </a>
                      <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "remove_cat" onClick = {this.handle_remove}>
                        <i className="material-icons grey-text text-darken-1" id = "remove_cat">close</i><span>Remove</span>
                      </a>
                    </div>
                    :
                    ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      </div>
    )
  }
}
