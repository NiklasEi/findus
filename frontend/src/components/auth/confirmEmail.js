import React, { Component } from "react";
import userPool from "../../utils/auth/userPool";
import { FaCheck } from "react-icons/fa";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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
    this.setState({ verifying: true });
    cognitoUser.confirmRegistration(
      this.state.code,
      true,
      function(err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
          if (this.props.fail) {
            this.props.fail();
          }
          return;
        }
        if (result === "SUCCESS") {
          this.setState({ verifying: false });
          if (this.props.success) {
            this.props.success();
          }
        }
      }.bind(this)
    );
  }

  onChange(event) {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <TextField
          className={style.input}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          value={this.state.username || ""}
          onChange={this.change.bind(this)}
          name="username"
          autoComplete="username"
          disabled={this.state.verifying}
          autoFocus
        />
        <TextField
          className={style.input}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="code"
          label="Verification code"
          type="code"
          value={this.state.password || ""}
          onChange={this.change.bind(this)}
          id="code"
          disabled={this.state.verifying}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          {this.state.verifying ? (
            <>
              <span>Verifying&nbsp;</span>
              <FaSpinner className="icon-spin" />
            </>
          ) : (
            <>
              <span>Verify&nbsp;</span>
              <FaCheck />
            </>
          )}
        </Button>
      </form>
    );
  }
}

export default ConfirmEmailForm;
