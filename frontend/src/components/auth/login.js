import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";
import { navigate } from "gatsby";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Link } from "gatsby";
import { FaSpinner } from "react-icons/fa";
import style from "../../styles/index.module.scss";

export class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loggingIn: false,
      message: "",
    };
    this.onFailure = this.onFailure.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.resetState = this.resetState.bind(this);
    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.callbacks = {
      onSuccess: this.onSuccess,
      onFailure: this.onFailure,
    };
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let redirect = params.get("redirect");
    let username = params.get("username");

    let state = {};
    if (redirect) {
      state.redirect = redirect;
    }
    if (username) {
      state.user = this.state.user;
      state.user.username = username;
    }
    if (redirect || username) this.setState(state);
  }

  change(event) {
    let input = event.currentTarget;
    let user = this.state.user;
    user[input.name] = input.value;
    this.setState({ user: user });
  }

  login(event) {
    event.preventDefault();
    this.setState({ loggingIn: true, message: "" });
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
    cognitoUser.authenticateUser(authenticationDetails, this.callbacks);
  }

  onSuccess(result) {
    console.log(result)
    navigate(
      this.state.redirect
        ? this.state.redirect
        : this.props.redirect
        ? this.props.redirect
        : "/"
    );
  }

  onFailure(err) {
    console.error(err)
    this.resetState(err.message);
  }

  resetState(message) {
    this.setState({ loggingIn: false, message: message });
  }

  render() {
    return (
      <form
        onSubmit={this.login.bind(this)}
        className={this.props.className || style.form || ""}
      >
        {this.state.message ? <span>{this.state.message}</span> : ""}
        <TextField
          className={style.input}
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
          disabled={this.state.loggingIn}
          autoFocus
        />
        <TextField
          className={style.input}
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
          disabled={this.state.loggingIn}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          {this.state.loggingIn ? (
            <>
              <span>Logging in&nbsp;</span>
              <FaSpinner className="icon-spin" />
            </>
          ) : (
            <span>Log in </span>
          )}
        </Button>
        <Link to="/auth/signup">{"Don't have an account yet? Sign Up"}</Link>
      </form>
    );
  }
}

export default LoginForm;
