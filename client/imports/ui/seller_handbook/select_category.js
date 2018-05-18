import React, { Component } from 'react';

export default class SelectCategory extends Component {
  constructor(props) {
    super(props)
  }

  cat_list = () => {
    return this.props.cat_display.map((item, index) => {
      return (
        <option key={index} value={item._id}>{item.cat_title}</option>
      )
    })
  }

  render () {
    return (
      <div>
        <select ref="dropdown" className="browser-default" id="category_selection" onChange={this.props.handleSelectChange} value={this.props.cat_selected}>
          <option value="" disabled>Choose the category</option>
          {(this.props.cat_display)? this.cat_list():""}
        </select>
      </div>
    )
  }
}
