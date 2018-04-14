import React, { Component } from 'react';

const CsBanner = () => {
  const getHelpBtnStyle = {
    height: 45,
    marginTop: 12,
    marginBottom: 12,
    position: 'absolute',
    bottom: 0,
    right: 24,
    width: 180
  };

  const getHelpText = {
    fontSize: '1em',
    lineHeight: '100%'
  };

  return (
    <div className = "card help-med-up">
      <div className = "card-title">
        <h2>Need help?</h2>
        <p style = {getHelpText}>Our Community Specialists are here for you</p>
      </div>
      <div className = "bp-orange btn-white-border btn" style = { getHelpBtnStyle }>get help</div>
    </div>
  )
}

export default CsBanner;
