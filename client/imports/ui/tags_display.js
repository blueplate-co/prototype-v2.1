import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import ReactDOM from 'react-dom';

export default class TagsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.handleMoveLeft = this.handleMoveLeft.bind(this);
    this.handleMoveRight = this.handleMoveRight.bind(this);
    this.state = {
      tags: [],
      move: 0,
      color: [],
      tagListMaskWidth: 0,
      tagListWidth: 0,
    }
    this.style = {
      tagWrapper: {
        paddingTop: '12px',
        position: 'absolute',
        width: '100%',
        position: 'sticky',
        top: '80px',
        zIndex: '100',
        backgroundColor: 'white',
        whiteSpace: 'nowrap',
        transition: 'top 0.3s',
        verticalAlign: 'middle',
        maxHeight: '80px',
        cursor: 'pointer',
      },
      chevronLeft: {
        display: 'inline-block',
        position: 'relative',
        left: '0px',
        top: '-21px'
      },
      chevronRight: {
        display: 'inline-block',
        position: 'absolute',
        right: '0px',
        bottom: '-9px'
      }
    }
  }

  componentDidMount() {
    const self = this;
    Meteor.call('tags.display', (error, result) => {
      var tagListMaskWidth = ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width
      self.setState({
        tags: result,
        tagListMaskWidth: tagListMaskWidth,
      })
    });
    /* Monitor size of the div keeping Tag list to determine whether aarows buttons should appear */
    window.addEventListener('resize', () => {
      this.setState({
        tagListMaskWidth: ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width
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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.setState({
        tagListMaskWidth: ReactDOM.findDOMNode(this.refs.the_mask).getBoundingClientRect().width
      })
    })
  }

  listTags() {
    return this.state.tags.map((item, index) => {
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
      const randomNumber = Math.floor(Math.random() * 4);
      const tagStyle = {
        display: 'inline-block',
        overflow: 'visible',
        fontSize: '16px',
        zIndex: '1000',
        backgroundColor: `${color[randomNumber].code}`,
        cursor: 'pointer',
      };
      return (
          <a key = {index} className = "chip" style = {tagStyle} onClick={()=> Session.set('tag_selected', item)}>{item.tag_name}</a>
      )
    })
  }

  handleMoveLeft = () => {
    this.setState({
      move: this.state.move - 300,
    })
  }

  handleMoveRight = (document) => {
    this.setState({
      move: this.state.move + 300,
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
    const styles = {
      tagList: {
        display: 'inline-block',
        width: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        whiteSpace: 'nowrap',
        transform: 'translateX(' + this.state.move + 'px)',
        transition: 'transform 200ms ease-in-out',
      },
      mask: {
        width: this.state.move == 0 ? 'calc(100% - 64px)' : 'calc(100% - 64px - 64px)',
        overflowX: 'hidden',
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
      }
    }
    return (
      <div style = {this.style.tagWrapper}>
        <h6>Can't decide? Here's some extra help:</h6>
          {
            this.endOfTagList() ?
              ""
            :
              <button
                className = 'btn-floating transparent z-depth-0 waves-effect waves-red hide-on-small-only'
                style = {this.style.chevronLeft}
                onClick={this.handleMoveLeft}
              >
                <i className="black-text medium material-icons">chevron_left</i>
              </button>
          }
          <span style = {styles.mask} ref="the_mask">
            <span  style = {styles.tagList} ref="tag_list">
              {this.listTags()}
            </span>
          </span>
          {
            (this.state.move == 0) ?
              ""
            :
              <button
                className = 'btn-floating transparent z-depth-0 waves-effect waves-red hide-on-small-only'
                style = {this.style.chevronRight}
                onClick={this.handleMoveRight}
              >
                <i className="black-text medium material-icons">chevron_right</i>
              </button>
          }
      </div>
    )
  }
}
