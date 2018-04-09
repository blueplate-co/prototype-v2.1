import React, { Component } from 'react';

const TotalViews = () => {
  const getViews = () => {
    Meteor.call('total.views', (error, result) => {
      console.log(error);
      console.log(result);
      return result;
    })
  }

  return (
    <div className = 'totalViews_wrapper'>
      <p>total views:</p>
      <h1>{getViews}</h1>
    </div>
  );

}

export default TotalViews;
