import React, { Component } from "react";
import Layout from "../layouts/index";
import axios from "axios"
import { Link } from "gatsby";
import getIdToken from "../utils/auth/getIdToken";

export class Index extends Component {
  async check() {
    let token = await getIdToken
    axios.get("https://c7kmbued26.execute-api.eu-central-1.amazonaws.com/dev/posts/hello", {
      withCredentials: true,
      headers: {'Authorization': "Bearer " + token.getJwtToken()}
    })
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <Layout>
        <div className="flexCenter">
          <div>
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
