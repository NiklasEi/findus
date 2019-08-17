import React, { Component } from 'react'
import userPool from "../../utils/auth/userPool";
import { navigate } from "gatsby"

export class SignupForm extends Component {
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
        navigate("/auth/confirm?username=" + result.user.username)
      }
    );
  }

  render() {
    return (
      <form onSubmit={this.signup.bind(this)}>
        <input
          type="text"
          value={this.state.user.username || ""}
          name="username"
          placeholder="Username"
          required
          onChange={this.change.bind(this)}
        />
        <input
          type="text"
          value={this.state.user.email || ""}
          name="email"
          placeholder="E-mail"
          required
          onChange={this.change.bind(this)}
        />
        <input
          type="password"
          value={this.state.user.password || ""}
          name="password"
          placeholder="Password"
          required
          onChange={this.change.bind(this)}
        />
        <input type="submit" value="Signup" />
      </form>
    )
  }
}

export default SignupForm
