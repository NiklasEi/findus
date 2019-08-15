import React, { Component } from "react";
import Layout from "../layouts";

export class NotFound extends Component {
  render() {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <strong>Sorry, page not found (404))</strong>
        </div>
      </Layout>
    );
  }
}

export default NotFound;
