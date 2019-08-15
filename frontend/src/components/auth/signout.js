import React, { Component } from "react";
import user from "../../utils/auth/user";

export class Signout extends Component {
  signOut(event) {
    user.then(user => user.signOut()).catch(err => console.error(err));
  }

  render() {
    return <button onClick={this.signOut.bind(this)}>Sign out</button>;
  }
}

export default Signout;
