import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';

import SearchSection from '../search_section/search_section';
import ListDistrict from '../list_district/list_district';
import RecommendChefList from '../recommend_chef_list/recommend_chef_list';
import ListCategories from '../list_categories/list_categories';
import NearbyList from '../nearby_list/nearby_list';

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
              <RecommendChefList />
            </LazyLoad>
            <LazyLoad height={200} once>
              <NearbyList />
            </LazyLoad>
            <LazyLoad height={200} once>
              <ListCategories />
            </LazyLoad>
        </div>
      )
  }

}