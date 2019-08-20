import React, { Component } from "react";
import Layout from "../layouts/index";
import axios from "axios";
import { Link } from "gatsby";
import getIdToken from "../utils/auth/getIdToken";
import { hello, create } from "../utils/endpoints"
import style from "../styles/index.module.scss"
import getUser from "../utils/auth/getUser";

export class Index extends Component {
  check() {
    console.log("check")
    getIdToken()
      .then(token => {
        console.log("calling")
        return axios.get(
          hello,
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

  create() {
    getIdToken()
    .then(token => {
      token.decodePayload()
    })
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <div className={style.div}>
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
