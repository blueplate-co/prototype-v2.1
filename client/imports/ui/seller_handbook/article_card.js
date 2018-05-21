import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import IconUpload from './icon_upload.js';

class ArticleCard extends Component {

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
    const article_id = this.props._id
    const edit_link = '/seller-handbook/edit/articles/' + article_id
    FlowRouter.go(edit_link);
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
    Meteor.call('article.remove', this.props.cat_id, this.props._id, (error, result) => {
      if (!error) {
        Materialize.toast('article removed', 4000)
      } else {
        Materialize.toast(error.message)
      }
    })
  }

  render() {
    return (
      <div>
        <a className = "card z-depth-0 category_display" href="" onClick = {this.handle_edit} onMouseOver = {this.highlight_cat} onMouseLeave = {this.unhighlight_cat} >
          <div className = "card_overlay" style = {(this.state.highlight)?{backgroundColor: "rgba(224,224,224, 1)"}:{backgroundColor: "transparent"}}>
            <div className = "card-content">
              <div className = "row">
                <div className = "col s12 m5 l3">
                  <div className = "cat_icon_uploader grey lighten-2">
                    <img src = {this.props.img} className = "iconDisplay"/>
                  </div>
                </div>
                <div className = "col s12 m7 l9">
                  <h5>{this.props.title}</h5>
                  <div className = "outline_post_text truncate" id={this.props._id} dangerouslySetInnerHTML = {{__html: this.props.description}} />
                  <p>Author: {this.props.user_details.foodie_name}</p>
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
          </div>
        </a>
      </div>
    )
  }
}

export default withTracker (({user_id}) => {
  return {
    user_details: Profile_details.findOne({user_id: user_id})
  }
})(ArticleCard)
