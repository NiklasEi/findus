import React, { Component } from "react";
import Helmet from "react-helmet";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { NotificationContainer } from "react-notifications";

import "react-notifications/lib/notifications.css";
const faviconSizes = [16, 32, 40];

export class Layout extends Component {
  render() {
    return (
      <div className={this.props.className ? this.props.className : "layout"}>
        <Helmet>
          <title>Findus</title>
          {faviconSizes.map(size => (
            <link
              rel="icon"
              type="image/png"
              href={`/images/favicon/${size}x${size}.png`}
              sizes={`${size}x${size}`}
              key={`${size}x${size}`}
            />
          ))}
        </Helmet>
        <Nav />
        <div className="content">
          {this.props.children}
        </div>
        <Footer />
        <NotificationContainer />
      </div>
    );
  }
}

export default Layout;
