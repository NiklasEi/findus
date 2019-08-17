import React, { Component } from "react";
import getUser from "../../utils/auth/getUser";

export class LogoutButton extends Component {
  signOut(event) {
    getUser
    .then(user => {
      user.signOut()
      // callback
      if(this.props.success) this.props.success()
    })
    .catch(err => {
      // callback
      if(this.props.fail) this.props.fail(err)
    });
  }

  render() {
    return <button onClick={this.signOut.bind(this)}>Log out</button>;
  }
}

export default LogoutButton;
