import React, { Component } from 'react';

export default class PathOption extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="container">
        <div className='col l4 m12 s12'>
          <h2 id='create_first_dish'>create your first dish</h2>
        </div>
        <div className='col l4 m12 s12'>
          <h2 id='preview_kitchen_profile'>preview kitchen profile</h2>
        </div>
        <div className='col l4 m12 s12'>
          <h2 id='divert_showroom'>browser around</h2>
        </div>
      </div>
    );
  }
}
