import React, { Component } from "react";
import Layout from "../layouts/index";
import axios from "axios";
import { Link } from "gatsby";
import getIdToken from "../utils/auth/getIdToken";

export class Index extends Component {
  check() {
    console.log("check")
    getIdToken()
      .then(token => {
        console.log("calling")
        return axios.get(
          "https://c7kmbued26.execute-api.eu-central-1.amazonaws.com/dev/posts/hello",
          {
            withCredentials: true,
            headers: { Authorization: "Bearer " + token.getJwtToken() },
          }
        );
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <div>
            <p>Welcome to Findus :)</p>
            <p>Easily manage, querry and share your bookmark collections.</p>
            <Link to="/auth/login">
              <button>Login</button>
            </Link>
            <Link to="/auth/signup">
              <button>Signup</button>
            </Link>
            <button onClick={this.check.bind(this)}>Click meeeeeee</button>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
