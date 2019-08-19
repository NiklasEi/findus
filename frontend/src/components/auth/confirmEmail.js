import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";
import { navigate } from "gatsby";

export class ConfirmEmailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      username: "",
    };

    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get("code");
    let username = params.get("username");

    if (code || username) {
      this.setState({
        code: code || "",
        username: username || "",
      });
    }
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
      if(result === "SUCCESS") {
        navigate("/auth/login?username=" + this.state.username)
      }
      console.log("call result: " + result);
    }.bind(this));
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
          placeholder="Username"
          required
          onChange={this.onChange}
          value={this.state.username}
        />
        <input
          type="text"
          name="code"
          placeholder="Verification code"
          required
          onChange={this.onChange}
          value={this.state.code}
        />
        <input type="submit" value="Verify my e-mail" />
      </form>
    );
  }
}

export default ConfirmEmailForm;
