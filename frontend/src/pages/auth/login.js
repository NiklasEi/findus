import React, { Component } from "react";
import Layout from "../../layouts";
import LoginForm from "../../components/auth/login";
import { NotificationManager } from "react-notifications";

export class Login extends Component {
  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let verified = params.get("verified");

    if (verified) {
      NotificationManager.info(
        "Successfully verified. You can now log in.",
        null,
        10000
      );
    }
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <LoginForm redirect="/app/profile" />
        </div>
      </Layout>
    );
  }
}

export default Login;
