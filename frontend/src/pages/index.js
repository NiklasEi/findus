import React, { Component } from "react";
import Layout from "../layouts/index";
import { Link } from "gatsby";
import style from "../styles/index.module.scss";

import "../styles/notifications.scss";

export class Index extends Component {
  render() {
    return (
      <Layout className="layout index">
        <div className="flexCenter">
          <div className={style.div}>
            <h2>Welcome to Findus!</h2>
            <strong>
              Easily manage, querry and share your bookmark collections.
            </strong>
            <br/>
            <br/>
            <div className={style.getStarted}>
            <p>Getting started:</p>
            <ul>
              <li>
                <Link to="/auth/signup">Create an account</Link> or <Link to="/auth/login">log in</Link> to
                you existing one
              </li>
              <li>
                Create your first bookmark collection
              </li>
              <li>
                Add bookmarks to your collection
              </li>
              <li>
                You can now log in from anywhere and use aour bookmarks
              </li>
            </ul>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
