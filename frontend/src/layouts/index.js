import React, { Component } from "react";
import Helmet from "react-helmet";
import Nav from "../components/nav";
import Footer from "../components/footer";

const faviconSizes = [32, 64, 256];

export class Layout extends Component {
  render() {
    return (
      <>
        <Helmet>
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
        <div className="content">{this.props.children}</div>
        <Footer />
      </>
    );
  }
}

export default Layout;
