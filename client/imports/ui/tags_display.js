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
      initialTouch: 0,
      touchMovement: 0,
      initialPosition: 0,
      move: 0,
      tagColor: [],
      tagListMaskWidth: 0,
      tagListWidth: 0,
      windowSize: window.innerWidth,
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
        position: 'absolute',
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
        initialTouch: 0,
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
        zIndex: '1000',
        backgroundColor: this.state.tagColor[index],
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
      tagListSmall: {
        display: 'inline-block',
        width: 'auto',
        overflowX: 'scroll',
        position: 'relative',
        whiteSpace: 'nowrap',
      },
      tagListLarge: {
        display: 'inline-block',
        width: 'auto',
        overflowX: 'scroll',
        position: 'relative',
        whiteSpace: 'nowrap',
        transform: 'translateX(' + this.state.move + 'px)',
        transition: 'transform 200ms ease-in-out',
      },
      mask: {
        width: this.state.windowSize < 768 ? '100%' : this.state.move == 0 || this.endOfTagList() ? 'calc(100% - 64px)' : 'calc(100% - 64px - 64px)',
        overflowX: 'scroll',
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        height: 'calc(100% - 2%)',
        overflowX: 'scroll',
        WebkitOverflowScrolling: 'touch',
        WebkitScrollBar: 'none',
      }
    }
    return (
      <div style = {this.style.tagWrapper}>
        <h6>Can't decide? Here's some extra help:</h6>
          {
            this.endOfTagList() ?
              null
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
              <span style = {this.state.windowSize < 768 ? styles.tagListSmall : styles.tagListLarge} ref="tag_list">
                {this.listTags()}
              </span>
            </span>
          {
            (this.state.move == 0) ?
              null
            :
              <button
                className = 'btn-floating transparent z-depth-0 waves-effect waves-red hide-on-small-only'
                style = {this.style.chevronRight}
                onClick = {this.handleMoveRight}
              >
                <i className="black-text medium material-icons">chevron_right</i>
              </button>
          }
      </div>
    )
  }
}
