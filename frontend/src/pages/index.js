import React, { Component } from "react";
import userPool from "../utils/auth/userPool";
import Layout from "../layouts/index"
import Signout from "../components/auth/signout";

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
  }

  change(event) {
    let input = event.currentTarget;
    let user = this.state.user;
    user[input.name] = input.value;
    this.setState({ user: user });
  }

  signup(event) {
    event.preventDefault();
    var attributeList = [];
    var dataEmail = {
      Name: "email",
      Value: this.state.user.email,
    };
    var attributeEmail = new this.AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );
    attributeList.push(attributeEmail);
    userPool.signUp(
      this.state.user.username,
      this.state.user.password,
      attributeList,
      null,
      function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
      }
    );
  }

  login(event) {
    event.preventDefault();
    var authenticationData = {
      Username: this.state.user.username,
      Password: this.state.user.password,
    };
    var authenticationDetails = new this.AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: this.state.user.username,
      Pool: userPool,
    };
    var cognitoUser = new this.AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        // var accessToken = result.getAccessToken().getJwtToken();
        // var idToken = result.idToken.jwtToken;
        console.log(result);
      },

      onFailure: function(err) {
        console.log(err);
      },
    });
  }

  render() {
    return (
      <Layout>
        <p>Hey there, signup:</p>
        <form onSubmit={this.signup.bind(this)}>
          <input
            type="text"
            value={this.state.user.username || ""}
            name="username"
            required
            onChange={this.change.bind(this)}
          />
          <input
            type="text"
            value={this.state.user.email || ""}
            name="email"
            required
            onChange={this.change.bind(this)}
          />
          <input
            type="password"
            value={this.state.user.password || ""}
            name="password"
            required
            onChange={this.change.bind(this)}
          />
          <input type="submit" value="Signup" />
        </form>
        <p>Login:</p>
        <form onSubmit={this.login.bind(this)}>
          <input type="submit" value="Login" />
        </form>
        <Signout/>
      </Layout>
    );
  }
}

export default Index;
