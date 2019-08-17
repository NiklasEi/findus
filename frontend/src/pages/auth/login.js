import React, { Component } from "react";
import Layout from "../../layouts";
import LoginForm from "../../components/auth/login";

export class Login extends Component {
  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <LoginForm />
        </div>
      </Layout>
    );
  }
}

export default Login;
