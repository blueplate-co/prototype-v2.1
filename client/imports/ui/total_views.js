import React, { Component } from 'react';

const TotalViews = props => {
  return(
      <div className = 'valign-wrapper' style = {{ height: '100%' }}>
        <div className = 'col l12 m12 s12'>
            <p className = 'dashboard-title'>total views:</p>
            <h1>{props.view}</h1>
        </div>
      </div>
  );
}

export default TotalViews;
