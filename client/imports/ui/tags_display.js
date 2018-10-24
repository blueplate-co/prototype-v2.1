import React from "react";
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import ReactDOM from 'react-dom';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { isMobileDevice } from './../../../imports/functions/isMobileDevice.js';
import { lazyload } from 'react-lazyload';

@lazyload({
  height: 200,
  once: true,
  offset: 100
})
export default class TagsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.handleMoveLeft = this.handleMoveLeft.bind(this);
    this.handleMoveRight = this.handleMoveRight.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.state = {
      tags: [],
      initialPosition: 0,
      move: 0,
      tagColor: [],
      tagListMaskWidth: 0,
      tagListWidth: 0,
      windowSize: window.innerWidth,
    }
    this.style = {
      tagWrapper: {
        width: '100%',
        position: 'relative',
        backgroundColor: 'white',
        verticalAlign: 'middle',
        maxHeight: '80px',
      },
      chevronLeft: {
        position: 'absolute',
        left: '0px',
        bottom: '4px',
        width: '50px',
        paddingLeft: '0px'
      },
      chevronRight: {
        position: 'absolute',
        right: '0px',
        bottom: '4px',
        width: '50px',
        paddingLeft: '30px',
        paddingRight: '0px'
      },
      tagListSmall: {
        display: 'inline-block',
        width: 'auto',
        position: 'relative',
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
        WebkitOverflowScrolling: 'touch',
        WebkitScrollbar: 'none',
      },
      mask: {
        width: '100%',
        position: 'relative',
        display: 'inline-block',
        height: '38px',
        overflow: 'hidden'
      },
      mobileMask: {
        width: '100%',
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        height: '38px',
        overflowX: 'scroll',
        WebkitOverflowScrolling: 'touch',
        WebkitScrollbar: {
          display: 'none'
        },
      }
    }
  }

  componentDidMount() {
    const self = this;
    const color = [
      {
        name: "blue",
        code: "#56AACD"
      },
      {
        name: "orange",
        code: "#EFAB1E"
      },
      {
        name: "green",
        code: "#B1DBBE"
      },
      {
        name: "red",
        code: "#EB5F55"
      }
    ];
    Meteor.call('tags.display', (error, result) => {
      var tagListMaskWidth = ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width
      for (i=0; i < result.length; i++) {
        var randomNumber = Math.floor(Math.random() * 4);
        this.state.tagColor.push(color[randomNumber].code)
      }
      self.setState({
        tags: result,
        tagListMaskWidth: tagListMaskWidth,
      })
    });
    /* Monitor size of the div keeping Tag list to determine whether aarows buttons should appear */
    window.addEventListener('resize', () => {
      this.setState({
        tagListMaskWidth: ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width,
        windowSize: window.innerWidth,
      })
    })
  }

  componentDidUpdate() {
    var tagListWidth = ReactDOM.findDOMNode(this.refs.tag_list).getBoundingClientRect().width
    if (! tagListWidth == this.state.tagListWidth) {
      this.setState({
        tagListWidth: tagListWidth,
      })
    }
    if (! window.innerWidth == this.state.windowSize) {
      this.setState({
        windowSize: window.innerWidth,
        touchMovement: 0,
        move: 0,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.setState({
        tagListMaskWidth: ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width,
        windowSize: window.innerWidth,
      })
    })
  }

  listTags() {
    return this.state.tags.map((item, index) => {
      const tagStyle = {
        display: 'inline-block',
        overflow: 'visible',
        fontSize: '16px',
        position: 'relative',
        zIndex: '5',
        backgroundColor: this.state.tagColor[index],
        cursor: 'pointer',
      };
      return (
          <a key = {index} className = "chip" style = {tagStyle} onClick={() => this.handleTagSelect(item)}>{item.tag_name}</a>
      )
    })
  }

  handleTagSelect(item) {
    FlowRouter.go('/search#all');
    $('#searchQuery').val(item.tag_name);
    Meteor.call('tag_result.get', item, (err, res) => {
      Session.set('search_result', res)
      // get location of kitchens for map markers
      //- get unique kitchen id of 3 lists.
      let uniqueDishKitchen = [...new Set(res.dish.map(item => item.kitchen_id))];
      let uniqueMenuKitchen = [...new Set(res.menu.map(item => item.kitchen_id))];
      let uniqueKitchen = [...new Set(res.kitchen.map(item => item._id))];
      let kitchen_id_list = [...uniqueDishKitchen, ...uniqueMenuKitchen, ...uniqueKitchen];
      // concat 3 arrays and remove duplicated items
      for (var i = 0; i < kitchen_id_list.length; ++i) {
        for (var j = i + 1; j < kitchen_id_list.length; ++j) {
          if (kitchen_id_list[i] === kitchen_id_list[j])
            kitchen_id_list.splice(j--, 1);
        }
      }
      //- get location of item in array
      var listkitchens = [];
      for (var i = 0; i < kitchen_id_list.length; i++) {
        let selected_kitchen = Kitchen_details.findOne({ _id: kitchen_id_list[i] });
        listkitchens.push(selected_kitchen);
      }
      Session.set('list_kitchen_for_map', listkitchens);
      Session.set('search_result_origin', res);
    })
  }

  handleMoveLeft = () => {
    this.setState({
      move: this.state.move + 300,
    })
  }

  handleMoveRight = (document) => {
    this.setState({
      move: this.state.move - 300,
    })
  }

  endOfTagList() {
    if (this.state.tagListMaskWidth - this.state.move >= this.state.tagListWidth) {
      return true
    } else {
      return false
    }
  }

  render() {
    const style = {
      tagListLarge: {
        display: 'inline-block',
        width: 'auto',
        overflowX: 'scroll',
        position: 'relative',
        whiteSpace: 'nowrap',
        transform: 'translateX(' + this.state.move + 'px)',
        transition: 'transform 200ms ease-in-out',
      }
    }
    return (
      <div style = {this.style.tagWrapper}>
        <h6>Can't decide? Here's some extra help:</h6>
          <span style = {isMobileDevice()?this.style.mobileMask:this.style.mask} ref="the_mask">
            {
              this.state.move == 0 || isMobileDevice() ?
                null
              :
                <button
                  className = 'chevronLeft btn-flat transparent z-depth-0 waves-effect waves-light'
                  style = {this.style.chevronLeft}
                  onClick={this.handleMoveLeft}
                >
                  <i className="black-text large material-icons">chevron_left</i>
                </button>
            }
            <span style = {isMobileDevice() ? this.style.tagListSmall : style.tagListLarge} ref="tag_list">
              {this.listTags()}
            </span>
            {
              this.endOfTagList() || isMobileDevice() ?
                null
              :
                <button
                  className = 'chevronRight btn-flat transparent z-depth-0 waves-effect waves-light'
                  style = {this.style.chevronRight}
                  onClick = {this.handleMoveRight}
                >
                  <i className="black-text large material-icons">chevron_right</i>
                </button>
            }
          </span>
      </div>
    )
  }
}
