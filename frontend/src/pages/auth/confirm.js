import React, { Component } from "react";
import Layout from "../../layouts/index";
import ConfirmEmailForm from "../../components/auth/confirmEmail";
import { navigate } from "gatsby";

export class Confirm extends Component {
  confirmed() {
    navigate("/auth/login?verified=true")
  }

  fail(err) {
    console.error(err)
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <ConfirmEmailForm success={this.confirmed.bind(this)} fail={this.fail.bind(this)} />
        </div>
      </Layout>
    );
  }
}

export default Confirm;
