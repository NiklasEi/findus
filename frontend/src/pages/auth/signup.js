import React, { Component } from "react";
import Layout from "../../layouts";
import SignupForm from "../../components/auth/signup";

export class Signup extends Component {
  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <SignupForm />
        </div>
      </Layout>
    );
  }
}

export default Signup;
