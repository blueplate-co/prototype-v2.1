import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Mongo } from 'meteor/mongo';

class UsersVerify extends Component {
  constructor(props) {
    super(props);
    this.handleVerify = this.handleVerify.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      verifying: false,
      selectedId: []
    }
  }

  handleChange (event) {
    if (this.state.selectedId.includes(event.target.value)) {
      var idUpdate = [...this.state.selectedId];
      var index = idUpdate.indexOf(event.target.value)
      idUpdate.splice(index, 1)
      this.setState({
        selectedId: idUpdate
      })
    } else {
      this.setState({
        selectedId: [...this.state.selectedId, event.target.value]
      })
    }
  }

  handleVerify() {
    this.setState({
      verifying: true
    })
    for (i=0; i < this.state.selectedId.length; i++) {
      Meteor.call('user.verify', this.state.selectedId[i], (error, result) => {
        if (result) {
          Materialize.toast('success')
        } else {
          Materialize.toast(error)
        }
      })
    }
    this.setState({
      verifying: false,
      selectedId: []
    })
  }

  renderList = () => {
    return this.props.usersDetails.map((details, index) => {
      return (
        <tr className = 'collection-item' key = {index}>
          <td>
          <p>
            <input type="checkbox" id={details._id} value = {details._id} onChange={this.handleChange}/>
            <label htmlFor={details._id}></label>
          </p>
          </td>
          <td>{details.emails[0].address}</td>
          <td className = 'hide-on-small-only'>{details.createdAt.toLocaleString()}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className = 'show_room_wrapper'>
        <div className = 'section no-side-padding'>
          <h4>Users Verifications</h4>
          <p>Select the accounts that you would like to verify by checking the checkbox on the left column of the table.</p>
        </div>
        <div>
        </div>
        <table className = {this.props.usersDetails.length > 0 ? 'highlight':''}>
          <thead>
            <tr>
            <th>
            </th>
             <th>Email:</th>
             <th className = 'hide-on-small-only'>Sign Up Time:</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.listloading ?
              <tr>
                <td>Loading...</td>
              </tr>
              :
              this.props.usersDetails.length > 0 ?
                this.renderList()
                :
                <tr>
                  <td>All accounts have been verified.</td>
                </tr>
            }
          </tbody>
        </table>
        <div className = 'section no-side-padding'>
        {
          this.props.usersDetails.length > 0 ?
          <a
            className = 'btn bp-blue white-text'
            onClick = { this.handleVerify }
            disabled={this.state.verifying ? "true" : ""}
          >
            {this.state.verifying ? "verifying..." : "verify"}
          </a>
          :
          ''
        }
        </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe('unverifiedAccounts');
  return {
      currentUser: Meteor.user(),
      listLoading: !handle.ready(),
      usersDetails: Meteor.users.find({"emails.0.verified": false}, {sort: {createdAt: -1}}).fetch(),
  };
})(UsersVerify);
