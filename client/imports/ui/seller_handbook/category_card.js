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
      parentElement: ''
    }
  }

  componentDidMount() {
    if (this.props.parentElement) {
      this.setState({
        parentElement: this.props.parentElement
      })
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
      cat_title: this.props.title,
      cat_description: this.props.description,
    })
    Session.set('shIcons', this.props.icon_link)
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
    e.preventDefault();
    Meteor.call('category.remove', this.props.id, (error, result) => {
      if (!error) {
        Materialize.toast('category removed', 4000)
      } else {
        Materialize.toast(error.message)
      }
    })
  }

  handle_update = (e) => {
    const id = this.props.id
    const cat_title = this.state.cat_title;
    const cat_description = this.state.cat_description;
    const createdBy = Meteor.userId();
    const icon_link = Session.get('shIcons')
    Meteor.call('category.update', id, cat_title, cat_description, icon_link, createdBy, (error, result) => {
      if (!error) {
        Materialize.toast('Category updated', 4000)
        Session.set('shIcons', {})
        this.setState({
          edit: false,
        })
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
        <div className = "card z-depth-0 category_display">
          <div className = "card-content">
            <div className = "row">
              <div className = "col s12 m5 l3">
                <IconUpload icon_link = {this.props.icon_link.origin} />
              </div>
              <div className = "col s12 m7 l9">
                <div className="input-field">
                  <input id="cat_title" type="text" value={this.state.cat_title} onChange={this.update_cat_title}/>
                  <label htmlFor="cat_title" className="active">Title</label>
                </div>
                <div className="input-field">
                  <input id="cat_description" type="text" value={this.state.cat_description} onChange={this.update_cat_description} />
                  <label htmlFor="cat_description" className="active">Description</label>
                </div>
              </div>
              <div className = "row">
                <a className = "btn right cat_update" onClick = {this.handle_update}>update</a>
                <a className = "btn-flat right waves-effect waves-red" onClick = {this.handle_cancel}>cancel</a>
              </div>
            </div>
          </div>
        </div>
        :
        <div className = "card z-depth-0 category_display" onMouseOver = {this.highlight_cat} onMouseLeave = {this.unhighlight_cat} >
          <div className = "card_overlay" style = {(this.state.highlight)?{backgroundColor: "rgba(224,224,224, 1)"}:{backgroundColor: "transparent"}}>
            <a href="" onClick = {this.handle_edit}>
              <div className = "card-content">
                <div className = "row">
                  <div className = "col s12 m5 l3">
                    <div className = "cat_icon_uploader grey lighten-2">
                      <img src = {this.props.link}/>
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
            </a>
          </div>
        </div>
      }
      </div>
    )
  }
}
