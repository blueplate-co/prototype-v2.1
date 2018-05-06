import React from 'react';

const CategoryCard = (props) => {
  return (
    <div className = "card category_display">
      <div className = "card_overlay">
        <div className = "card-content">
          <div className = "row">
            <div className = "col s12 m5 l3">
              <div className = "cat_icon_uploader grey lighten-2">
                <img src = {props.link} className = "iconDisplay"/>
              </div>
            </div>
            <div className = "col s12 m7 l9">
              <h5>{props.title}</h5>
              <p>{props.description}</p>
              <p>Total number of articles: {props.article_count}</p>
              <p>Last updated: {props.updatedAt.toString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard;
