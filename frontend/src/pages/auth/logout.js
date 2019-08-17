import React, { Component } from "react";
import Layout from "../../layouts";
import LogoutButton from "../../components/auth/logout";
import { navigate } from "gatsby";


export class Signout extends Component {
  loggedOut() {
    navigate("/")
  }

  fail(err) {
    console.error(err)
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <LogoutButton success={this.loggedOut.bind(this)} fail={this.fail.bind(this)} />
        </div>
      </Layout>
    );
  }
}

export default Signout;
