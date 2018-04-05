import React, { Component } from 'react';
import MenuList from './menu_list';
import Modal from './modal';

export default class ShowMenuProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDish: {},
      selectedMenu: {}
    }
  }

  handleMenuPopup = (item) => {
    this.setState({
      selectedMenu: item
    });
  }

  render() {
    return (
      <div className = "col xl12 l12 m12 s12">
        <MenuList titel="" seemore="" popup={ this.handleMenuPopup } />
        <Modal dish = {this.state.selectedMenu} />
      </div>
    )
  }

}
