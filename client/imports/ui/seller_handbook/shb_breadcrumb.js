import React from 'react';

const Shb_breadcrumb = (props) => {
  return (
    <nav className = "z-depth-0" id = "shb_nav">
      <div className="nav-wrapper" id = "shb_breadcrumb">
        <a href="/seller_handbook/" className="breadcrumb bp-blue-text">Seller Handbook</a>
        <a href={"/seller_handbook/category/" + props.cat_title} className="breadcrumb bp-blue-text">{props.cat_title}</a>
      </div>
    </nav>
  )
}

export default Shb_breadcrumb;
