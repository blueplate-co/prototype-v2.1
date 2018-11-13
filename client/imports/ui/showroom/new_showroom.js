import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';

import SearchSection from '../search_section/search_section';
import ListDistrict from '../list_district/list_district';
import PopularDishList from '../popular_dish_list/popular_dish_list';
import ListCategories from '../list_categories/list_categories';

// App component - represents the whole app
export default class ShowRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
      return (
        <div>
            <SearchSection />
            <LazyLoad height={200} once>
              <ListDistrict />
            </LazyLoad>
            <LazyLoad height={200} once>
              <PopularDishList />
            </LazyLoad>
            <LazyLoad height={200} once>
              <ListCategories />
            </LazyLoad>
        </div>
      )
  }

}
