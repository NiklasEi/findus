import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";

export class ConfirmEmail extends Component {
  constructor(props) {
    super(props);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get("code");
    let username = params.get("username");

    this.state = {
      code: code || "",
      username: username || "",
    };

    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  submit(event) {
    event.preventDefault();
    var userData = {
      Username: this.state.username,
      Pool: userPool,
    };

    var cognitoUser = new this.AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(this.state.code, true, function(
      err,
      result
    ) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        return;
      }
      console.log("call result: " + result);
    });
  }

  onChange(event) {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <input
          type="text"
          name="username"
          required
          onChange={this.onChange}
          value={this.state.username}
        />
        <input
          type="text"
          name="code"
          required
          onChange={this.onChange}
          value={this.state.code}
        />
        <input type="submit" value="Verify my e-mail" />
      </form>
    );
  }
}

export default ConfirmEmail;
