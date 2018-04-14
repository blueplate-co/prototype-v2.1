import React, {Component} from 'react';

const TopSells = props => {
  renderList = () => {
    return props.data.map((item, index) => {
      return (
        <div key = {index} className = "row info_wrapper">
          <div className = 'col s3 m3 l3 xl3'><img className = 'top_sell_thumbnail' src = {item.meta.small} /></div>
          <div className = 'col s9 m9 l9 xl9'>
            <p className = "truncate">{item.dish_name}</p>
            <p>${item.dish_selling_price}</p>
          </div>
        </div>
      )
    })
  }
  return (
    <div className = 'card-panel top-selling-menu'>
      <p className = 'dashboard-title'>top sellers</p>
      <div className = 'col s12 m12 l12 xl12'>
        <ul className = 'tabs'>
          <li className = 'tab col s6 m6 l6 xl6'><a href='#top_dishes'>dishes</a></li>
          <li className = 'tab col s6 m6 l6 xl6'><a href='#top_menus'>menus</a></li>
        </ul>
      </div>
      <div className = 'section' id='top_dishes'>
        {this.renderList()}
      </div>
      <div className = 'section' id='top_menus'>
      </div>
    </div>
  )
}

export default TopSells;
