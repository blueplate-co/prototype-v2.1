import React, { Component } from 'react';

import SearchSection from './search_section';
import ListDistrict from './list_district';
import PopularDishList from './popular_dish_list';

// App component - represents the whole app
export default class ShowRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
      return (
        <div>
            <SearchSection />
            <ListDistrict />
            <PopularDishList />
        </div>
      )
  }

}
