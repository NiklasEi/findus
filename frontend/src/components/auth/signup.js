import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";
import { navigate } from "gatsby";
import style from "../../styles/index.module.scss";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Link } from "gatsby";
import { FaSpinner } from "react-icons/fa";
import { NotificationManager } from "react-notifications";

export class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      passwordVerificationError: "",
      validEmail: false,
      validate: {
        minLength: false,
        lowerCase: false,
        upperCase: false,
        specialCharacters: false,
      },
    };
    this.AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.change = this.change.bind(this);
    this.validation = {
      minLength: "be at least 8 characters long",
      lowerCase: "contain at least one lower case letter",
      upperCase: "contain at least one upper case letter",
      specialCharacters: "contain at least one special character",
    };
  }

  change(event) {
    let input = event.currentTarget;
    let user = this.state.user;
    user[input.name] = input.value;
    if (input.name.includes("password")) {
      let state = {};
      if (this.verifyPassword(input)) {
        state = { user: user, passwordVerificationError: "" };
      } else {
        state = {
          user: user,
          passwordVerificationError: "Passwords don't match",
        };
      }
      if (input.name === "password") {
        state.validate = {
          minLength: input.value.length >= 8,
          lowerCase: /[a-z]/.test(input.value),
          upperCase: /[A-Z]/.test(input.value),
          specialCharacters: /[^A-Za-z0-9]/.test(input.value),
        };
      }
      this.setState(state);
    } else if (input.name === "email") {
      this.setState({
        user: user,
        validEmail: /^\S+@\S+\.\S+$/.test(input.value),
      });
    } else {
      this.setState({ user: user });
    }
  }

  verifyPassword(input) {
    let pwd =
      input.name === "password" ? input.value : this.state.user.password;
    let pwdVer =
      input.name === "passwordver" ? input.value : this.state.user.passwordver;
    if (!pwd || !pwdVer) return true;
    return pwd === pwdVer;
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
          NotificationManager.error(err.message, "Failed to sign up", 20000);
          this.setState({ signingUp: false });
          return;
        }
        console.log(result);
        navigate("/auth/confirm?username=" + result.user.username);
      }.bind(this)
    );
  }

  render() {
    return (
      <form
        onSubmit={this.signup.bind(this)}
        className={this.props.className || style.form || ""}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          value={this.state.user.username || ""}
          onChange={this.change}
          name="username"
          autoComplete="username"
          disabled={this.state.signingUp}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-mail"
          error={
            !this.state.validEmail &&
            this.state.user.email &&
            this.state.user.email.length > 0
          }
          helperText={
            this.state.validEmail || !this.state.user.email
              ? ""
              : "Please enter a valid E-mail adress"
          }
          value={this.state.user.email || ""}
          onChange={this.change}
          name="email"
          autoComplete="email"
          disabled={this.state.signingUp}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          error={
            this.state.passwordVerificationError !== "" &&
            this.state.passwordVerificationError.length > 0 || ! (
            this.state.validate.minLength &&
            this.state.validate.lowerCase &&
            this.state.validate.upperCase &&
            this.state.validate.specialCharacters
            )
          }
          type="password"
          value={this.state.user.password || ""}
          onChange={this.change}
          id="password"
          autoComplete="current-password"
          disabled={this.state.signingUp}
        />
        {this.state.validate.minLength &&
        this.state.validate.lowerCase &&
        this.state.validate.upperCase &&
        this.state.validate.specialCharacters ? (
          <div id="password-helper-text">
            <p>Password is OK</p>
          </div>
        ) : (
          <div id="password-helper-text">
          <p>Your password should:</p>
            <ul>
            {Object.keys(this.validation)
            .filter(key => !this.state.validate[key])
            .map(
              function(key, index) {
                let text = this.validation[key];
                return (
                  <li
                    className={
                      this.state.validate[key] ? style.pwdok : style.pwdnotok
                    }
                  >
                    {text}
                  </li>
                );
              }.bind(this)
            )}
            </ul>
          </div>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="passwordver"
          label="Password verification"
          helperText={this.state.passwordVerificationError}
          error={
            this.state.passwordVerificationError !== "" &&
            this.state.passwordVerificationError.length > 0
          }
          type="password"
          value={this.state.user.passwordver || ""}
          onChange={this.change}
          id="passwordver"
          disabled={this.state.signingUp}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          {this.state.signingUp ? (
            <>
              <span>Signing you up&nbsp;</span>
              <FaSpinner className="icon-spin" />
            </>
          ) : (
            <span>Sign me up</span>
          )}
        </Button>
        <Link to="/auth/login">{"Already have an account? Log in"}</Link>
      </form>
    );
  }
}

export default SignupForm;
