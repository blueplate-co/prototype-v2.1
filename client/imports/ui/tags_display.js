import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

export default class TagsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.handleMoveLeft = this.handleMoveLeft.bind(this);
    this.handleMoveRight = this.handleMoveRight.bind(this);
    this.state = {
      tags: [],
      move: 0,
      color: []
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
      },
      mask: {
        width: 'calc(100% - 64px - 64px)',
        overflowX: 'hidden',
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
      }
    }
  }

  componentDidMount() {
    const self = this;
    Meteor.call('tags.display', (error, result) => {
      self.setState({
        tags: result,
      })
    });
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

  handleMoveLeft = (document) => {
    this.setState({
      move: this.state.move - 300,
    })
    console.log(this.tagListWidth)
  }

  handleMoveRight = (document) => {
    this.setState({
      move: this.state.move + 300,
    })
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
    }
    return (
      <div style = {this.style.tagWrapper}>
        <h6>Can't decide? Here's some extra help:</h6>
          <button
            className = 'btn-floating transparent z-depth-0 waves-effect waves-red hide-on-small-only'
            style = {this.style.chevronLeft}
            onClick={this.handleMoveLeft}
          >
            <i className="black-text medium material-icons">chevron_left</i>
          </button>
          <span style = {this.style.mask}>
            <span style = {styles.tagList}>
              {this.listTags()}
            </span>
          </span>
          <button
            className = 'btn-floating transparent z-depth-0 waves-effect waves-red hide-on-small-only'
            style = {this.style.chevronRight}
            onClick={this.handleMoveRight}
            disabled={(this.state.move == 0) ? true : false}
          >
            <i className="black-text medium material-icons">chevron_right</i>
          </button>
      </div>
    )
  }
}
