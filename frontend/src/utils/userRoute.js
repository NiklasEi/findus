import React, { Component } from "react";
import { navigate } from "gatsby";
import getUser from "./auth/getUser";

class UserRoute extends Component {
  async componentDidMount() {
    const { location } = this.props
    try {
      await getUser();
    } catch (err) {
      navigate("/auth/login?redirect=" + location.pathname);
      return null;
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return <Component {...rest} />;
  }
}

export default UserRoute;
