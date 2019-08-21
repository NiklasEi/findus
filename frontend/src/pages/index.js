import React, { Component } from "react";
import Layout from "../layouts/index";
import { Link } from "gatsby";
import getIdToken from "../utils/auth/getIdToken";
import style from "../styles/index.module.scss"

import "../styles/notifications.scss"

export class Index extends Component {
  create() {
    getIdToken()
    .then(token => {
      token.decodePayload()
    })
  }

  render() {
    return (
      <Layout className="layout index">
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
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
