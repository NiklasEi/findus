import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";
import { navigate } from "gatsby";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import { FaSpinner } from "react-icons/fa";

export class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loggingIn: false,
      message: ""
    };
    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.callbacks = {
      onSuccess: this.onSuccess,
      onFailure: this.onFailure
    }
  }

  change(event) {
    let input = event.currentTarget;
    let user = this.state.user;
    user[input.name] = input.value;
    this.setState({ user: user });
  }

  login(event) {
    event.preventDefault();
    this.setState({loggingIn: true, message: ""})
    var authenticationData = {
      Username: this.state.user.username,
      Password: this.state.user.password,
    };
    console.log(authenticationData);
    var authenticationDetails = new this.AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: this.state.user.username,
      Pool: userPool,
    };
    var cognitoUser = new this.AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, this.callbacks);
  }

  onSuccess = (result) => {
    // var accessToken = result.getAccessToken().getJwtToken();
    // var idToken = result.idToken.jwtToken;
    console.log(result);
    this.setState({loggingIn: false, message: ""})
    navigate(this.props.redirect ? this.props.redirect : "/");
  }

  onFailure = (err) => {
    console.log("failed to log in");
    console.log(err);
    this.setState({loggingIn: false, message: err.message})
  }

  render() {
    return (
      <>
        <form onSubmit={this.login.bind(this)}>
          {this.state.message ? <FormControlLabel>{this.state.message}</FormControlLabel> : ""}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username or E-mail"
            value={this.state.user.username || ""}
            onChange={this.change.bind(this)}
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={this.state.user.password || ""}
            onChange={this.change.bind(this)}
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Log In {this.state.loggingIn ?
            <FaSpinner/>
            :""}
          </Button>
          <Link href="/auth/signup" variant="body2">
            {"Don't have an account yet? Sign Up"}
          </Link>
        </form>
      </>
    );
  }
}

export default LoginForm;
