import React, { Component } from "react";
import getUser from "../../utils/auth/getUser";

export class LogoutButton extends Component {
  constructor(props) {
    super(props);

    this.globalLogOutFailure = this.globalLogOutFailure.bind(this);
    this.globalLogOutSuccess = this.globalLogOutSuccess.bind(this);
    this.callbacks = {
      onSuccess: this.globalLogOutSuccess,
      onFailure: this.globalLogOutFailure,
    };
  }

  signOut(event) {
    getUser()
      .then(user => {
        user.signOut();
        // callback
        if (this.props.success) this.props.success();
      })
      .catch(err => {
        // callback
        if (this.props.fail) this.props.fail(err);
      });
  }

  signOutOnAllDevices(event) {
    getUser()
      .then(user => {
        user.globalSignOut(this.callbacks);
      })
      .catch(err => {
        if (this.props.fail) this.props.fail(err);
      });
  }

  globalLogOutFailure(err) {
    console.log(err);
    if (this.props.fail) this.props.fail(err);
  }

  globalLogOutSuccess(result) {
    console.log(result);
    if (this.props.success) this.props.success();
  }

  render() {
    return (
      <>
        <button onClick={this.signOut.bind(this)} className="btn-secondary">
          Log out
        </button>
        <button
          onClick={this.signOutOnAllDevices.bind(this)}
          className="btn-primary"
        >
          Log out on all devices
        </button>
      </>
    );
  }
}

export default LogoutButton;
